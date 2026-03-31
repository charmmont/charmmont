import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()

  if (profile?.role === 'practitioner') {
    return NextResponse.json({ error: 'Not available for practitioners' }, { status: 403 })
  }

  const { data: clientRecord } = await supabase
    .from('clients').select('*').eq('profile_id', user.id).single()

  const clientId = clientRecord?.id

  if (!clientId) {
    return NextResponse.json({ error: 'Client record not found' }, { status: 404 })
  }

  const [
    { data: sessions },
    { data: toolAssignments },
    { data: toolResponses },
    { data: moodEntries },
    { data: journalEntries },
    { data: invoices },
    { data: documents },
  ] = await Promise.all([
    supabase.from('sessions').select('*').eq('client_id', clientId),
    supabase.from('tool_assignments').select('*, tools(name, type)').eq('client_id', clientId),
    supabase.from('tool_responses').select('*').eq('client_id', clientId),
    supabase.from('mood_entries').select('*').eq('client_id', clientId),
    supabase.from('journal_entries').select('*').eq('client_id', clientId),
    supabase.from('invoices').select('*').eq('client_id', clientId).neq('status', 'draft'),
    supabase.from('documents').select('id, file_name, label, category, created_at').eq('client_id', clientId).eq('is_shared', true),
  ])

  const export_data = {
    exported_at: new Date().toISOString(),
    profile: {
      full_name: profile?.full_name,
      email: profile?.email,
      created_at: profile?.created_at,
    },
    client: {
      programme: clientRecord?.programme,
      start_date: clientRecord?.start_date,
      status: clientRecord?.status,
    },
    sessions: (sessions ?? []).map((s: any) => ({
      date: s.session_date,
      duration_minutes: s.duration_minutes,
      type: s.session_type,
      notes_shared: s.notes_shared,
      next_steps: s.next_steps,
      homework: s.homework,
    })),
    tool_assignments: (toolAssignments ?? []).map((a: any) => ({
      tool_name: a.tools?.name,
      tool_type: a.tools?.type,
      assigned_at: a.assigned_at,
      due_date: a.due_date,
      status: a.status,
      note: a.note,
    })),
    tool_responses: toolResponses ?? [],
    mood_entries: (moodEntries ?? []).map((e: any) => ({
      date: e.entry_date,
      mood_rating: e.mood_rating,
      reflection: e.reflection,
    })),
    journal_entries: (journalEntries ?? []).map((e: any) => ({
      created_at: e.created_at,
      content: e.content,
      is_private: e.is_private,
    })),
    invoices: (invoices ?? []).map((i: any) => ({
      invoice_number: i.invoice_number,
      date: i.invoice_date,
      total: i.total,
      status: i.status,
    })),
    documents: documents ?? [],
  }

  return new NextResponse(JSON.stringify(export_data, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="deepbloom-data-export-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  })
}
