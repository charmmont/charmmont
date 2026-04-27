import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import DocumentUpload from './DocumentUpload'
import DocumentList from './DocumentList'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export const metadata: Metadata = { title: 'Documents' }

export default async function DocumentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()
  if (profile?.role !== 'practitioner') redirect('/portal/my-space')

  const [{ data: docs }, { data: clientRows }] = await Promise.all([
    supabase
      .from('documents')
      .select('*, clients(id, profiles(full_name))')
      .order('created_at', { ascending: false }),
    supabase
      .from('clients')
      .select('id, profiles(full_name)')
      .eq('status', 'active'),
  ])

  const clients = (clientRows ?? []).map((c: any) => ({
    id: c.id,
    full_name: c.profiles?.full_name ?? 'Unknown',
  }))

  const t = await getTranslations('Documents')

  return (
    <PortalShell role="practitioner" name={profile?.full_name ?? user.email ?? ''}>
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-2xl font-semibold text-[#1C1C1A]"
          style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
        >
          {t('title')}
        </h1>
        <DocumentUpload clients={clients} />
      </div>

      <DocumentList documents={docs ?? []} clients={clients} />
    </PortalShell>
  )
}
