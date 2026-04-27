import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Privacy Policy',
}

export default async function PrivacyPage() {
  const t = await getTranslations('Privacy')

  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: 'var(--color-bg)' }}>

      {/* ── Opening hero ── */}
      <section className="pub-hero" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '120px 60px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: 760, textAlign: 'center', animation: 'fadeUp 0.9s ease both' }}>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(34px, 4vw, 52px)',
              fontWeight: 900,
              color: 'var(--color-text-primary)',
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
            }}>
              {t('title_pre')} <em style={{ fontStyle: 'italic', color: 'var(--color-sage)' }}>{t('title_em')}</em>
            </h1>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="hero-divider" style={{ display: 'flex', justifyContent: 'center', paddingBottom: 80 }}>
        <div style={{ width: 80, height: 1, background: 'var(--color-border)' }} />
      </div>

      {/* ── Content card ── */}
      <section className="pub-section-x" style={{ padding: '0 60px 72px' }}>
        <div className="card-inner" style={{ maxWidth: 1200, margin: '0 auto', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-2xl)', padding: '48px 52px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'var(--font-body)', fontSize: 15, fontWeight: 300, color: 'var(--color-text-secondary)', lineHeight: 1.88 }}>
            <p>{t('intro')}</p>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginTop: 16 }}>
              {t('s1_title')}
            </h2>
            <p>{t('s1_body')}</p>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginTop: 16 }}>
              {t('s2_title')}
            </h2>
            <p>{t('s2_body')}</p>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginTop: 16 }}>
              {t('s3_title')}
            </h2>
            <p>
              {t('s3_body')}{' '}
              <a href="mailto:hello@deepbloom.me" style={{ color: 'var(--color-pine)', textDecoration: 'none' }}>
                hello@deepbloom.me
              </a>
              .
            </p>

            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(18px, 2vw, 24px)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginTop: 16 }}>
              {t('s4_title')}
            </h2>
            <p>{t('s4_body')}</p>

            <div style={{ height: 1, background: 'var(--color-border)', marginTop: 16 }} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 500, letterSpacing: '0.06em', color: 'var(--color-text-secondary)' }}>
              {t('updated')}
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
