import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import InvoiceForm from '../InvoiceForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'New Invoice' }

export default async function NewInvoicePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()
  if (profile?.role !== 'practitioner') redirect('/portal/my-space')

  const { data: clientRows } = await supabase
    .from('clients')
    .select('id, profiles(full_name)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const clients = (clientRows ?? []).map((c: any) => ({
    id: c.id,
    full_name: c.profiles?.full_name ?? 'Unknown',
  }))

  return (
    <PortalShell role="practitioner" name={profile?.full_name ?? user.email ?? ''}>
      <Link
        href="/portal/invoices"
        className="text-sm text-[#6B6B65] hover:text-[#2D4A3E] transition-colors inline-flex items-center gap-2 mb-8"
      >
        ← Invoices
      </Link>
      <h1
        className="text-2xl font-semibold text-[#1C1C1A] mb-8"
        style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
      >
        New invoice
      </h1>
      <InvoiceForm clients={clients} />
    </PortalShell>
  )
}
