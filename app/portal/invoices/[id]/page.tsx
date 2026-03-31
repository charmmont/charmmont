import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import InvoiceDetailClient from './InvoiceDetailClient'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = { title: 'Invoice' }

export default async function InvoiceDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()
  if (profile?.role !== 'practitioner') redirect('/portal/my-space')

  const { data: invoice } = await supabase
    .from('invoices')
    .select('*, clients(id, profiles(full_name, email))')
    .eq('id', id)
    .single()

  if (!invoice) notFound()

  // For edit: fetch active clients list
  const { data: clientRows } = await supabase
    .from('clients')
    .select('id, profiles(full_name)')
    .eq('status', 'active')

  const clients = (clientRows ?? []).map((c: any) => ({
    id: c.id,
    full_name: c.profiles?.full_name ?? 'Unknown',
  }))

  return (
    <PortalShell role="practitioner" name={profile?.full_name ?? user.email ?? ''}>
      <Link
        href="/portal/invoices"
        className="text-sm text-[#6B6B65] hover:text-[#2D4A3E] transition-colors inline-flex items-center gap-2 mb-8 print:hidden"
      >
        ← Invoices
      </Link>
      <InvoiceDetailClient invoice={invoice} clients={clients} practitionerName={profile?.full_name ?? ''} />
    </PortalShell>
  )
}
