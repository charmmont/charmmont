'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from '@/lib/google-calendar'
import { sendSessionRescheduledEmail } from '@/lib/email'

const PROGRAMME_LABELS: Record<string, string> = {
  first_root:    'Deepbloom — The First Root',
  becoming:      'Deepbloom — The Becoming',
  in_full_bloom: 'Deepbloom — In Full Bloom',
}

async function getPractitionerProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'practitioner') throw new Error('Not a practitioner')
  return { supabase, profile }
}

// ── Book a session ────────────────────────────────────────────────────────────

export async function bookSession(formData: FormData) {
  const { supabase, profile } = await getPractitionerProfile()

  const clientId       = formData.get('client_id') as string
  const sessionDate    = formData.get('session_date') as string
  const sessionTime    = formData.get('session_time') as string
  const durationMins   = Number(formData.get('duration_minutes') ?? 60)
  const sessionType    = formData.get('session_type') as string
  const programme      = formData.get('programme') as string | null

  // Build scheduled_at datetime
  const scheduledAt = sessionTime
    ? new Date(`${sessionDate}T${sessionTime}`).toISOString()
    : null

  // Get client name for calendar event title
  const { data: clientRecord } = await supabase
    .from('clients')
    .select('profiles(full_name)')
    .eq('id', clientId)
    .single()
  const clientName = (clientRecord?.profiles as any)?.full_name ?? 'Client'

  let googleEventId: string | null = null

  // Create Google Calendar event if practitioner has connected their calendar
  if (profile.google_refresh_token && scheduledAt) {
    try {
      const endAt = new Date(new Date(scheduledAt).getTime() + durationMins * 60000).toISOString()
      googleEventId = await createCalendarEvent(
        profile.google_refresh_token,
        profile.google_calendar_id ?? 'primary',
        {
          summary: `${PROGRAMME_LABELS[programme ?? ''] ?? 'Session'} with ${clientName}`,
          description: `Programme: ${programme ?? 'session'}\nDelivery: ${sessionType}`,
          startDateTime: scheduledAt,
          endDateTime: endAt,
        }
      )
    } catch (e) {
      console.error('Google Calendar create failed:', e)
    }
  }

  await supabase.from('sessions').insert({
    client_id:        clientId,
    session_date:     sessionDate,
    scheduled_at:     scheduledAt,
    duration_minutes: durationMins,
    session_type:     sessionType,
    programme:        programme || null,
    status:           'booked',
    google_event_id:  googleEventId,
  })

  revalidatePath('/portal/sessions')
  revalidatePath('/portal/dashboard')
}

// ── Confirm session (mark as held / billable) ─────────────────────────────────

export async function confirmSession(sessionId: string) {
  const { supabase } = await getPractitionerProfile()
  await supabase
    .from('sessions')
    .update({ status: 'confirmed' })
    .eq('id', sessionId)
  revalidatePath('/portal/sessions')
  revalidatePath('/portal/dashboard')
}

// ── Cancel session ────────────────────────────────────────────────────────────

export async function cancelSession(sessionId: string) {
  const { supabase, profile } = await getPractitionerProfile()

  const { data: session } = await supabase
    .from('sessions')
    .select('google_event_id')
    .eq('id', sessionId)
    .single()

  if (profile.google_refresh_token && session?.google_event_id) {
    try {
      await deleteCalendarEvent(
        profile.google_refresh_token,
        profile.google_calendar_id ?? 'primary',
        session.google_event_id,
      )
    } catch (e) {
      console.error('Google Calendar delete failed:', e)
    }
  }

  await supabase
    .from('sessions')
    .update({ status: 'cancelled', google_event_id: null })
    .eq('id', sessionId)

  revalidatePath('/portal/sessions')
  revalidatePath('/portal/dashboard')
}

// ── Reschedule session ────────────────────────────────────────────────────────

export async function rescheduleSession(formData: FormData) {
  const { supabase, profile } = await getPractitionerProfile()

  const sessionId   = formData.get('session_id') as string
  const sessionDate = formData.get('session_date') as string
  const sessionTime = formData.get('session_time') as string

  const { data: session } = await supabase
    .from('sessions')
    .select('*, clients(profiles(full_name, email))')
    .eq('id', sessionId)
    .single()

  const scheduledAt = sessionTime
    ? new Date(`${sessionDate}T${sessionTime}`).toISOString()
    : null

  if (profile.google_refresh_token && scheduledAt && session) {
    try {
      const endAt = new Date(
        new Date(scheduledAt).getTime() + (session.duration_minutes ?? 60) * 60000
      ).toISOString()
      const clientName = (session.clients as any)?.profiles?.full_name ?? 'Client'
      const label = PROGRAMME_LABELS[session.programme ?? ''] ?? 'Session'

      if (session.google_event_id) {
        await updateCalendarEvent(
          profile.google_refresh_token,
          profile.google_calendar_id ?? 'primary',
          session.google_event_id,
          {
            summary: `${label} with ${clientName}`,
            description: `Programme: ${session.programme ?? 'session'}\nDelivery: ${session.session_type}`,
            startDateTime: scheduledAt,
            endDateTime: endAt,
          }
        )
      } else {
        const newEventId = await createCalendarEvent(
          profile.google_refresh_token,
          profile.google_calendar_id ?? 'primary',
          {
            summary: `${label} with ${clientName}`,
            description: `Programme: ${session.programme ?? 'session'}\nDelivery: ${session.session_type}`,
            startDateTime: scheduledAt,
            endDateTime: endAt,
          }
        )
        await supabase.from('sessions').update({ google_event_id: newEventId }).eq('id', sessionId)
      }
    } catch (e) {
      console.error('Google Calendar reschedule failed:', e)
    }
  }

  await supabase
    .from('sessions')
    .update({
      session_date: sessionDate,
      scheduled_at: scheduledAt,
      status: 'booked',
    })
    .eq('id', sessionId)

  // Notify client by email
  const clientProfile = (session?.clients as any)?.profiles
  const clientEmail = clientProfile?.email
  const clientName = clientProfile?.full_name ?? 'there'
  if (clientEmail) {
    const displayDate = new Date(sessionDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    const displayTime = sessionTime
      ? new Date(`${sessionDate}T${sessionTime}`).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      : null
    const typeLabels: Record<string, string> = { video: 'Video call', phone: 'Phone call', in_person: 'In person' }
    try {
      await sendSessionRescheduledEmail({
        clientEmail,
        clientName,
        newDate: displayDate,
        newTime: displayTime,
        sessionType: session?.session_type ? (typeLabels[session.session_type] ?? session.session_type) : null,
      })
    } catch (e) {
      console.error('Reschedule email failed:', e)
    }
  }

  revalidatePath('/portal/sessions')
  revalidatePath('/portal/dashboard')
}
