import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'

export const metadata: Metadata = { title: 'My Documents' }

const FILE_ICONS: Record<string, string> = {
  'application/pdf': '📄',
  'application/msword': '📝',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
  'image/jpeg': '🖼',
  'image/png': '🖼',
}

export default async function MyDocumentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role === 'practitioner') redirect('/portal/dashboard')

  const { data: clientRecord } = await supabase
    .from('clients').select('id').eq('profile_id', user.id).single()

  const { data: docs } = await supabase
    .from('documents')
    .select('*')
    .eq('client_id', clientRecord?.id ?? '')
    .eq('is_shared', true)
    .order('created_at', { ascending: false })

  const [t, locale] = await Promise.all([getTranslations('MyDocuments'), getLocale()])
  const dateLang = locale === 'es' ? 'es-ES' : 'en-GB'

  const CATEGORY_LABELS: Record<string, string> = {
    consent_form:       t('cat_consent_form'),
    agreement:          t('cat_agreement'),
    resource:           t('cat_resource'),
    programme_material: t('cat_programme_material'),
    other:              t('cat_other'),
  }

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

      {docs && docs.length > 0 ? (
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="divide-y divide-[#2D4A3E]/10">
            {docs.map((doc: any) => (
              <div key={doc.id} className="flex items-center gap-4 p-5">
                <span className="text-2xl shrink-0">
                  {FILE_ICONS[doc.file_type ?? ''] ?? '📎'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1C1C1A]">{doc.label ?? doc.file_name}</p>
                  <p className="text-xs text-[#6B6B65] mt-0.5">
                    {CATEGORY_LABELS[doc.category ?? 'other'] ?? t('cat_other')}
                    {' · '}
                    {new Date(doc.created_at).toLocaleDateString(dateLang, { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  {doc.description && (
                    <p className="text-xs text-[#6B6B65] mt-0.5 italic">{doc.description}</p>
                  )}
                </div>
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#2D4A3E] hover:text-[#7A9E8E] transition-colors shrink-0"
                >
                  {t('download')}
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-16 text-center">
          <div className="w-12 h-12 bg-[#FAF7F2] rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">📎</div>
          <p className="text-sm text-[#6B6B65] italic">{t('empty')}</p>
        </div>
      )}
    </PortalShell>
  )
}
