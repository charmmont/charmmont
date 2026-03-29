import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import ToolBuilder from '../ToolBuilder'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Create Tool' }

export default async function NewToolPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'practitioner') redirect('/portal/my-space')

  return (
    <PortalShell role="practitioner" name={profile?.full_name ?? user.email ?? ''}>
      <ToolBuilder />
    </PortalShell>
  )
}
