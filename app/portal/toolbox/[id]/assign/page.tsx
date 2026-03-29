import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import AssignToolForm from './AssignToolForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Assign Tool' }

interface Props {
  params: Promise<{ id: string }>
}

export default async function AssignToolPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'practitioner') redirect('/portal/my-space')

  const { data: tool } = await supabase.from('tools').select('*').eq('id', id).single()
  if (!tool) notFound()

  const { data: clients } = await supabase
    .from('clients')
    .select('id, profiles(full_name, email)')
    .eq('status', 'active')

  return (
    <PortalShell role="practitioner" name={profile?.full_name ?? user.email ?? ''}>
      <AssignToolForm tool={tool} clients={clients ?? []} practitionerId={user.id} />
    </PortalShell>
  )
}
