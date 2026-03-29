import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import ToolBuilder from '../ToolBuilder'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Edit Tool' }

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditToolPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'practitioner') redirect('/portal/my-space')

  const { data: tool } = await supabase.from('tools').select('*').eq('id', id).single()
  if (!tool) notFound()

  return (
    <PortalShell role="practitioner" name={profile?.full_name ?? user.email ?? ''}>
      <ToolBuilder initialTool={tool} />
    </PortalShell>
  )
}
