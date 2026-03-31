import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import ClientTabs from './ClientTabs'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = { title: 'Client Profile' }

export default async function ClientProfilePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'practitioner') redirect('/portal/my-space')

  const { data: client } = await supabase
    .from('clients')
    .select('*, profiles(id, full_name, email, created_at)')
    .eq('id', id)
    .single()

  if (!client) notFound()

  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .eq('client_id', id)
    .order('session_date', { ascending: false })

  const { data: assignments } = await supabase
    .from('tool_assignments')
    .select('*, tools(name, type, description, content, questions)')
    .eq('client_id', id)
    .order('assigned_at', { ascending: false })

  return (
    <PortalShell role="practitioner" name={profile?.full_name ?? user.email ?? ''}>
      {/* Back */}
      <Link
        href="/portal/clients"
        className="text-sm text-[#6B6B65] hover:text-[#2D4A3E] transition-colors inline-flex items-center gap-2 mb-8"
      >
        ← Clients
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-semibold text-[#1C1C1A]"
            style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
          >
            {(client as any).profiles?.full_name ?? 'Client'}
          </h1>
          <p className="text-[#6B6B65] text-sm mt-1">{(client as any).profiles?.email}</p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full ${
          client.status === 'active'
            ? 'bg-[#2D4A3E]/10 text-[#2D4A3E]'
            : 'bg-[#6B6B65]/10 text-[#6B6B65]'
        }`}>
          {client.status}
        </span>
      </div>

      <ClientTabs
        client={client}
        sessions={sessions ?? []}
        assignments={assignments ?? []}
      />
    </PortalShell>
  )
}
