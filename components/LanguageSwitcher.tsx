'use client'

import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'

interface Props {
  style?: React.CSSProperties
}

export default function LanguageSwitcher({ style }: Props) {
  const locale = useLocale()
  const router = useRouter()

  function switchTo(next: string) {
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; SameSite=Lax`
    router.refresh()
  }

  const base: React.CSSProperties = {
    fontFamily: 'var(--font-body)',
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.06em',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: '2px 4px',
    borderRadius: 4,
    transition: 'color 0.18s',
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2, ...style }}>
      <button
        onClick={() => switchTo('en')}
        style={{
          ...base,
          color: locale === 'en' ? 'var(--color-pine)' : 'var(--color-text-secondary)',
          fontWeight: locale === 'en' ? 600 : 400,
        }}
        aria-current={locale === 'en' ? 'true' : undefined}
      >
        EN
      </button>
      <span style={{ color: 'var(--color-border)', fontSize: 11 }}>|</span>
      <button
        onClick={() => switchTo('es')}
        style={{
          ...base,
          color: locale === 'es' ? 'var(--color-pine)' : 'var(--color-text-secondary)',
          fontWeight: locale === 'es' ? 600 : 400,
        }}
        aria-current={locale === 'es' ? 'true' : undefined}
      >
        ES
      </button>
    </div>
  )
}
