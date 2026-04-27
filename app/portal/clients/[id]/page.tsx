import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import ClientTabs from './ClientTabs'
import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'

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
    .select('*, profiles(id, full_name, email, created_at, preferred_language)')
    .eq('id', id)
    .single()

  if (!client) notFound()

  const [t, locale] = await Promise.all([getTranslations('ClientDetail'), getLocale()])

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

  const [{ data: invoices }, { data: documents }] = await Promise.all([
    supabase
      .from('invoices')
      .select('*')
      .eq('client_id', id)
      .order('invoice_date', { ascending: false }),
    supabase
      .from('documents')
      .select('*')
      .eq('client_id', id)
      .order('created_at', { ascending: false }),
  ])

  return (
    <PortalShell role="practitioner" name={profile?.full_name ?? user.email ?? ''}>
      {/* Back */}
      <Link
        href="/portal/clients"
        className="text-sm text-[#6B6B65] hover:text-[#2D4A3E] transition-colors inline-flex items-center gap-2 mb-8"
      >
        {t('back')}
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-semibold text-[#1C1C1A]"
            style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
          >
            {(client as any).profiles?.full_name ?? 'Client'}
          </h1>
          <p className="text-[#6B6B65] text-sm mt-1">{(client as any).profiles?.email}</p>
        </div>
        <div className="flex items-center gap-2">
          {(client as any).profiles?.preferred_language === 'es' && (
            <span
              title={t('lang_label')}
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.06em',
                padding: '3px 8px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(122,158,142,0.15)',
                color: 'var(--color-pine)',
                border: '1px solid rgba(122,158,142,0.35)',
              }}
            >
              {t('lang_es')} {t('lang_label')}
            </span>
          )}
          <span className={`text-xs px-3 py-1 rounded-full ${
            client.status === 'active'
              ? 'bg-[#2D4A3E]/10 text-[#2D4A3E]'
              : 'bg-[#6B6B65]/10 text-[#6B6B65]'
          }`}>
            {client.status}
          </span>
        </div>
      </div>

      <ClientTabs
        client={client}
        sessions={sessions ?? []}
        assignments={assignments ?? []}
        invoices={invoices ?? []}
        documents={documents ?? []}
        locale={locale}
      />
    </PortalShell>
  )
}
