import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import BookSessionForm from './BookSessionForm'
import SessionActions from './SessionActions'
import type { Metadata } from 'next'
import { getTranslations, getLocale } from 'next-intl/server'

export const metadata: Metadata = { title: 'Sessions' }

const PROGRAMME_PILL: Record<string, string> = {
  first_root:    'bg-[#7A9E8E]/15 text-[#2D4A3E]',
  becoming:      'bg-[#2D4A3E]/10 text-[#2D4A3E]',
  in_full_bloom: 'bg-[#A8C4B8]/30 text-[#2D4A3E]',
}

const STATUS_PILL: Record<string, string> = {
  booked:      'bg-amber-100 text-amber-700',
  confirmed:   'bg-[#2D4A3E]/10 text-[#2D4A3E]',
  cancelled:   'bg-[#6B6B65]/10 text-[#6B6B65] line-through',
  rescheduled: 'bg-blue-50 text-blue-600',
  draft:       'bg-amber-50 text-amber-600',
  complete:    'bg-[#2D4A3E]/10 text-[#2D4A3E]',
}

export default async function SessionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'practitioner') redirect('/portal/my-space')

  const today = new Date().toISOString().split('T')[0]

  const { data: upcoming } = await supabase
    .from('sessions')
    .select('*, clients(id, profiles(full_name))')
    .gte('session_date', today)
    .in('status', ['booked', 'confirmed'])
    .order('scheduled_at', { ascending: true, nullsFirst: false })
    .order('session_date', { ascending: true })

  const { data: past } = await supabase
    .from('sessions')
    .select('*, clients(id, profiles(full_name))')
    .or(`session_date.lt.${today},status.in.(confirmed,cancelled,rescheduled,complete)`)
    .order('session_date', { ascending: false })
    .limit(50)

  const { data: clients } = await supabase
    .from('clients')
    .select('id, profiles(full_name)')
    .eq('status', 'active')

  const isGoogleConnected = !!profile?.google_refresh_token

  const [t, locale] = await Promise.all([getTranslations('Sessions'), getLocale()])
  const dateLang = locale === 'es' ? 'es-ES' : 'en-GB'

  const PROGRAMME_LABELS: Record<string, string> = {
    first_root:    t('programme_first_root'),
    becoming:      t('programme_becoming'),
    in_full_bloom: t('programme_in_full_bloom'),
  }

  const TYPE_LABEL: Record<string, string> = {
    video:     t('type_video'),
    phone:     t('type_phone'),
    in_person: t('type_in_person'),
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
          {!isGoogleConnected && (
            <p className="text-xs text-[#6B6B65] mt-1">
              <a href="/portal/settings/google" className="text-[#2D4A3E] hover:underline">{t('connect_calendar')}</a>
              {' '}{t('connect_calendar_post')}
            </p>
          )}
        </div>
        <BookSessionForm clients={clients ?? []} />
      </div>

      {/* Upcoming */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#6B6B65] mb-3">{t('upcoming_title')}</h2>
        <div className="bg-white rounded-2xl overflow-hidden border border-[#2D4A3E]/10">
          {upcoming && upcoming.length > 0 ? (
            <div className="divide-y divide-[#2D4A3E]/08">
              {upcoming.map((s: any) => {
                const isToday = s.session_date === today
                return (
                  <div key={s.id} className="px-6 py-4 flex items-center gap-4">
                    {/* Date block */}
                    <div className="text-center shrink-0 w-12">
                      <p className={`text-[10px] font-semibold uppercase tracking-wide ${isToday ? 'text-[#2D4A3E]' : 'text-[#6B6B65]'}`}>
                        {isToday ? t('today') : new Date(s.session_date).toLocaleDateString(dateLang, { weekday: 'short' })}
                      </p>
                      <p className="text-xl font-semibold text-[#1C1C1A] leading-tight">
                        {new Date(s.session_date).getDate()}
                      </p>
                      <p className="text-[10px] text-[#6B6B65]">
                        {new Date(s.session_date).toLocaleDateString(dateLang, { month: 'short' })}
                      </p>
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-[#1C1C1A]">
                          {s.clients?.profiles?.full_name ?? 'Client'}
                        </p>
                        {s.programme && (
                          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${PROGRAMME_PILL[s.programme] ?? 'bg-[#6B6B65]/10 text-[#6B6B65]'}`}>
                            {PROGRAMME_LABELS[s.programme]}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#6B6B65] mt-0.5">
                        {s.scheduled_at
                          ? new Date(s.scheduled_at).toLocaleTimeString(dateLang, { hour: '2-digit', minute: '2-digit' })
                          : t('time_tbc')}
                        {' · '}{s.duration_minutes ?? 60} min
                        {s.session_type ? ` · ${TYPE_LABEL[s.session_type] ?? s.session_type}` : ''}
                      </p>
                    </div>
                    {/* Actions */}
                    <SessionActions sessionId={s.id} sessionDate={s.session_date} sessionTime={s.scheduled_at} status={s.status} />
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-[#6B6B65] italic">{t('no_upcoming')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Past */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#6B6B65] mb-3">{t('past_title')}</h2>
        <div className="bg-white rounded-2xl overflow-hidden border border-[#2D4A3E]/10">
          {past && past.length > 0 ? (
            <>
              <div className="hidden md:grid grid-cols-[1fr_130px_90px_100px_100px_80px] gap-3 px-6 py-3 border-b border-[#2D4A3E]/10 text-xs font-medium text-[#6B6B65] uppercase tracking-wider">
                <span>{t('col_client')}</span>
                <span>{t('col_date')}</span>
                <span>{t('col_duration')}</span>
                <span>{t('col_programme')}</span>
                <span>{t('col_type')}</span>
                <span>{t('col_status')}</span>
              </div>
              <div className="divide-y divide-[#2D4A3E]/08">
                {past.map((s: any) => (
                  <div key={s.id} className="px-6 py-4">
                    <div className="hidden md:grid grid-cols-[1fr_130px_90px_100px_100px_80px] gap-3 items-center">
                      <p className="text-sm font-medium text-[#1C1C1A] truncate">
                        {s.clients?.profiles?.full_name ?? 'Unknown'}
                      </p>
                      <p className="text-sm text-[#6B6B65]">
                        {new Date(s.session_date).toLocaleDateString(dateLang, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-sm text-[#6B6B65]">{s.duration_minutes ?? 60} min</p>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full w-fit ${PROGRAMME_PILL[s.programme] ?? 'bg-[#6B6B65]/10 text-[#6B6B65]'}`}>
                        {PROGRAMME_LABELS[s.programme] ?? '—'}
                      </span>
                      <p className="text-sm text-[#6B6B65]">{TYPE_LABEL[s.session_type] ?? '—'}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full w-fit font-medium ${STATUS_PILL[s.status] ?? 'bg-[#6B6B65]/10 text-[#6B6B65]'}`}>
                        {s.status === 'confirmed' || s.status === 'complete' ? t('status_confirmed') : s.status ?? '—'}
                      </span>
                    </div>
                    {/* Mobile */}
                    <div className="md:hidden">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium text-[#1C1C1A]">{s.clients?.profiles?.full_name ?? 'Unknown'}</p>
                          <p className="text-xs text-[#6B6B65] mt-0.5">
                            {new Date(s.session_date).toLocaleDateString(dateLang, { day: 'numeric', month: 'short', year: 'numeric' })}
                            {' · '}{s.duration_minutes ?? 60} min
                          </p>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium shrink-0 ${STATUS_PILL[s.status] ?? 'bg-[#6B6B65]/10 text-[#6B6B65]'}`}>
                          {s.status === 'confirmed' || s.status === 'complete' ? t('status_confirmed') : s.status ?? '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-[#6B6B65] italic">{t('no_past')}</p>
            </div>
          )}
        </div>
      </section>
    </PortalShell>
  )
}
