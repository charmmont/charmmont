import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'

export const metadata: Metadata = { title: 'My Invoices' }

const STATUS_STYLES: Record<string, string> = {
  draft:   'bg-[#6B6B65]/10 text-[#6B6B65]',
  sent:    'bg-blue-100 text-blue-700',
  paid:    'bg-[#2D4A3E]/10 text-[#2D4A3E]',
  overdue: 'bg-red-100 text-red-600',
}

export default async function MyInvoicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role === 'practitioner') redirect('/portal/dashboard')

  const { data: clientRecord } = await supabase
    .from('clients').select('id').eq('profile_id', user.id).single()

  const { data: invoices } = await supabase
    .from('invoices')
    .select('*')
    .eq('client_id', clientRecord?.id ?? '')
    .neq('status', 'draft')
    .order('invoice_date', { ascending: false })

  const list = invoices ?? []
  const outstanding = list
    .filter((i: any) => i.status === 'sent' || i.status === 'overdue')
    .reduce((sum: number, i: any) => sum + Number(i.total), 0)

  const [t, locale] = await Promise.all([getTranslations('MyInvoices'), getLocale()])
  const dateLang = locale === 'es' ? 'es-ES' : 'en-GB'

  return (
    <PortalShell role="client" name={profile?.full_name ?? user.email ?? ''}>
      <Link
        href="/portal/my-space"
        className="text-sm text-[#6B6B65] hover:text-[#2D4A3E] transition-colors inline-flex items-center gap-2 mb-8"
      >
        {t('back')}
      </Link>

      <h1
        className="text-2xl font-semibold text-[#1C1C1A] mb-8"
        style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
      >
        {t('title')}
      </h1>

      {outstanding > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-amber-800">{t('outstanding')}</p>
            <p className="text-xl font-semibold text-amber-900 mt-0.5">£{outstanding.toFixed(2)}</p>
          </div>
          <span className="text-2xl">🧾</span>
        </div>
      )}

      {list.length > 0 ? (
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="divide-y divide-[#2D4A3E]/10">
            {list.map((invoice: any) => (
              <Link
                key={invoice.id}
                href={`/portal/my-space/invoices/${invoice.id}`}
                className="flex items-center justify-between p-5 hover:bg-[#FAF7F2] transition-colors group"
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium font-mono text-[#1C1C1A]">{invoice.invoice_number}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[invoice.status] ?? STATUS_STYLES.sent}`}>
                      {invoice.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B6B65]">
                    {new Date(invoice.invoice_date).toLocaleDateString(dateLang, { day: 'numeric', month: 'long', year: 'numeric' })}
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
          <p className="text-sm text-[#6B6B65] italic">{t('empty')}</p>
        </div>
      )}
    </PortalShell>
  )
}
