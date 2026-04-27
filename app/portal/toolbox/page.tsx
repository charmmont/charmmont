import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export const metadata: Metadata = { title: 'Toolbox' }

export default async function ToolboxPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'practitioner') redirect('/portal/my-space')

  const { data: tools } = await supabase
    .from('tools')
    .select('*')
    .order('created_at', { ascending: false })

  const t = await getTranslations('Toolbox')

  const TOOL_TYPE_LABELS: Record<string, string> = {
    onboarding_questionnaire:     t('cat_onboarding'),
    self_discovery_questionnaire: t('cat_self_discovery'),
    values_exercise:              t('cat_values_exercise'),
    wheel_of_life:                t('cat_wheel_of_life'),
    belief_mapping:               t('cat_belief_mapping'),
    mood_tracker:                 t('cat_mood_tracker'),
    reflection_journal:           t('cat_reflection_journal'),
    gamified_challenge:           t('cat_gamified_challenge'),
  }

  return (
    <PortalShell role="practitioner" name={profile?.full_name ?? user.email ?? ''}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-semibold text-[#1C1C1A]"
            style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
          >
            {t('title')}
          </h1>
          <p className="text-[#6B6B65] text-sm mt-1">{t('sub')}</p>
        </div>
        <Link
          href="/portal/toolbox/new"
          className="bg-[#2D4A3E] text-white px-4 py-2 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors"
        >
          {t('create_tool')}
        </Link>
      </div>

      {tools && tools.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool: any) => (
            <div key={tool.id} className="bg-white rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs text-[#7A9E8E] border border-[#7A9E8E]/30 px-2 py-0.5 rounded-full">
                    {TOOL_TYPE_LABELS[tool.type] ?? tool.type}
                  </span>
                  <h3
                    className="font-semibold text-[#1C1C1A] text-base mt-2"
                    style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
                  >
                    {tool.name}
                  </h3>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${
                  tool.status === 'published'
                    ? 'bg-[#2D4A3E]/10 text-[#2D4A3E]'
                    : 'bg-[#6B6B65]/10 text-[#6B6B65]'
                }`}>
                  {tool.status}
                </span>
              </div>
              {tool.description && (
                <p className="text-[#6B6B65] text-sm leading-relaxed line-clamp-2">{tool.description}</p>
              )}
              <div className="flex gap-2 mt-auto pt-2">
                <Link
                  href={`/portal/toolbox/${tool.id}`}
                  className="flex-1 text-center text-xs border border-[#2D4A3E]/20 text-[#2D4A3E] py-2 rounded-full hover:bg-[#2D4A3E] hover:text-white transition-colors"
                >
                  {t('btn_edit')}
                </Link>
                <Link
                  href={`/portal/toolbox/${tool.id}/assign`}
                  className="flex-1 text-center text-xs bg-[#2D4A3E] text-white py-2 rounded-full hover:bg-[#7A9E8E] transition-colors"
                >
                  {t('btn_assign')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-16 text-center">
          <p className="text-[#6B6B65] text-sm italic mb-4">{t('empty_title')}</p>
          <p className="text-[#6B6B65] text-sm mb-8">{t('empty_body')}</p>
          <Link
            href="/portal/toolbox/new"
            className="inline-block bg-[#2D4A3E] text-white px-6 py-2.5 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors"
          >
            {t('empty_cta')}
          </Link>
        </div>
      )}
    </PortalShell>
  )
}
