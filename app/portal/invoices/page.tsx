import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'

export const metadata: Metadata = { title: 'Invoices' }

const STATUS_STYLES: Record<string, string> = {
  draft:    'bg-[#6B6B65]/10 text-[#6B6B65]',
  sent:     'bg-blue-100 text-blue-700',
  paid:     'bg-[#2D4A3E]/10 text-[#2D4A3E]',
  overdue:  'bg-red-100 text-red-600',
}

export default async function InvoicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase.from('profiles').select('role, full_name').eq('id', user.id).single()
  if (profile?.role !== 'practitioner') redirect('/portal/my-space')

  const { data: invoices } = await supabase
    .from('invoices')
    .select('*, clients(id, profiles(full_name))')
    .order('invoice_date', { ascending: false })

  const list = invoices ?? []

  const outstanding = list
    .filter((i: any) => i.status === 'sent' || i.status === 'overdue')
    .reduce((sum: number, i: any) => sum + Number(i.total), 0)

  const paidThisMonth = list
    .filter((i: any) => {
      if (i.status !== 'paid' || !i.paid_at) return false
      const d = new Date(i.paid_at)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((sum: number, i: any) => sum + Number(i.total), 0)

  const [t, locale] = await Promise.all([getTranslations('Invoices'), getLocale()])
  const dateLang = locale === 'es' ? 'es-ES' : 'en-GB'

  return (
    <PortalShell role="practitioner" name={profile?.full_name ?? user.email ?? ''}>
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-2xl font-semibold text-[#1C1C1A]"
          style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
        >
          {t('title')}
        </h1>
        <Link
          href="/portal/invoices/new"
          className="bg-[#2D4A3E] text-white px-5 py-2.5 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors"
        >
          {t('new_invoice')}
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: t('outstanding_label'), value: `£${outstanding.toFixed(2)}`, sub: t('outstanding_sub') },
          { label: t('paid_label'), value: `£${paidThisMonth.toFixed(2)}`, sub: t('paid_sub') },
          { label: t('total_label'), value: list.length, sub: t('total_sub') },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5">
            <p
              className="text-2xl font-semibold text-[#2D4A3E]"
              style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
            >
              {s.value}
            </p>
            <p className="text-xs text-[#6B6B65] mt-1">{s.label}</p>
            <p className="text-xs text-[#6B6B65]/60">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Invoice list */}
      {list.length > 0 ? (
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="divide-y divide-[#2D4A3E]/10">
            {list.map((invoice: any) => (
              <Link
                key={invoice.id}
                href={`/portal/invoices/${invoice.id}`}
                className="flex items-center justify-between p-5 hover:bg-[#FAF7F2] transition-colors group"
              >
                <div>
                  <div className="flex items-center gap-3 mb-0.5">
                    <span className="text-sm font-medium text-[#1C1C1A] font-mono">{invoice.invoice_number}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[invoice.status] ?? STATUS_STYLES.draft}`}>
                      {invoice.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B6B65]">
                    {(invoice as any).clients?.profiles?.full_name ?? 'Unknown client'}
                    {' · '}
                    {new Date(invoice.invoice_date).toLocaleDateString(dateLang, { day: 'numeric', month: 'short', year: 'numeric' })}
                    {invoice.due_date && invoice.status !== 'paid' && (
                      <> · {t('due_date', { date: new Date(invoice.due_date).toLocaleDateString(dateLang, { day: 'numeric', month: 'short' }) })}</>
                    )}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold text-[#1C1C1A]">£{Number(invoice.total).toFixed(2)}</p>
                  <p className="text-xs text-[#6B6B65] group-hover:text-[#2D4A3E] transition-colors">{t('view')}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-16 text-center">
          <div className="w-12 h-12 bg-[#FAF7F2] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">🧾</div>
          <p className="font-semibold text-[#1C1C1A] text-sm mb-2">{t('empty_title')}</p>
          <p className="text-sm text-[#6B6B65] mb-6">{t('empty_body')}</p>
          <Link
            href="/portal/invoices/new"
            className="bg-[#2D4A3E] text-white px-5 py-2.5 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors"
          >
            {t('new_invoice')}
          </Link>
        </div>
      )}
    </PortalShell>
  )
}
