import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import ToolResponderFull from './ToolResponderFull'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ assignmentId: string }>
}

export const metadata: Metadata = { title: 'Complete Tool' }

export default async function ToolPage({ params }: Props) {
  const { assignmentId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role === 'practitioner') redirect('/portal/dashboard')

  const { data: clientRecord } = await supabase
    .from('clients').select('id').eq('profile_id', user.id).single()

  const { data: assignment } = await supabase
    .from('tool_assignments')
    .select('*, tools(id, name, description, type, content, questions)')
    .eq('id', assignmentId)
    .eq('client_id', clientRecord?.id ?? '')
    .single()

  if (!assignment) notFound()

  // Load existing responses for this assignment
  const { data: existingResponse } = await supabase
    .from('tool_responses')
    .select('*')
    .eq('assignment_id', assignmentId)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .single()

  // Load mood entries for mood_tracker
  const { data: moodEntries } = await supabase
    .from('mood_entries')
    .select('*')
    .eq('assignment_id', assignmentId)
    .order('logged_at', { ascending: true })

  // Load journal entries for reflection_journal
  const { data: journalEntries } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('assignment_id', assignmentId)
    .order('created_at', { ascending: false })

  return (
    <PortalShell role="client" name={profile?.full_name ?? user.email ?? ''}>
      <Link
        href="/portal/my-space/tools"
        className="text-sm text-[#6B6B65] hover:text-[#2D4A3E] transition-colors inline-flex items-center gap-2 mb-8"
      >
        ← My Tools
      </Link>

      <ToolResponderFull
        assignment={assignment}
        clientId={clientRecord?.id ?? ''}
        clientName={profile?.full_name ?? ''}
        existingResponse={existingResponse ?? null}
        moodEntries={moodEntries ?? []}
        journalEntries={journalEntries ?? []}
      />
    </PortalShell>
  )
}
