'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'

interface Props {
  profile: any
  userId: string
}

export default function ProfileForm({ profile, userId }: Props) {
  const t = useTranslations('MyProfile')
  const router = useRouter()

  const [name, setName] = useState(profile?.full_name ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)
  const [pwError, setPwError] = useState('')

  const [lang, setLang] = useState<'en' | 'es'>(profile?.preferred_language ?? 'en')
  const [langSaving, setLangSaving] = useState(false)
  const [langSaved, setLangSaved] = useState(false)

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const supabase = createClient()
    const { error: err } = await supabase
      .from('profiles')
      .update({ full_name: name })
      .eq('id', userId)
    if (err) { setError(err.message); setSaving(false); return }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault()
    setPwError('')
    if (newPassword !== confirmPassword) { setPwError(t('error_match')); return }
    if (newPassword.length < 8) { setPwError(t('error_length')); return }
    setPwSaving(true)
    const supabase = createClient()
    const { error: err } = await supabase.auth.updateUser({ password: newPassword })
    if (err) { setPwError(err.message); setPwSaving(false); return }
    setPwSaving(false)
    setPwSaved(true)
    setNewPassword('')
    setConfirmPassword('')
    setTimeout(() => setPwSaved(false), 3000)
  }

  async function saveLanguage(next: 'en' | 'es') {
    setLang(next)
    setLangSaving(true)
    const supabase = createClient()
    await supabase.from('profiles').update({ preferred_language: next }).eq('id', userId)
    document.cookie = `NEXT_LOCALE=${next}; path=/; max-age=31536000; SameSite=Lax`
    setLangSaving(false)
    setLangSaved(true)
    setTimeout(() => setLangSaved(false), 3000)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Profile info */}
      <form onSubmit={saveProfile} className="bg-white rounded-2xl p-6 space-y-4">
        <h2
          className="font-semibold text-[#1C1C1A]"
          style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
        >
          {t('personal_title')}
        </h2>
        <div>
          <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">{t('field_name')}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">{t('field_email')}</label>
          <input
            type="email"
            value={profile?.email ?? ''}
            disabled
            className="w-full border border-[#2D4A3E]/10 rounded-xl px-4 py-3 text-sm bg-[#FAF7F2] text-[#6B6B65] cursor-not-allowed"
          />
          <p className="text-xs text-[#6B6B65] mt-1">{t('email_note')}</p>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {saved && <p className="text-[#2D4A3E] text-sm">{t('saved')}</p>}
        <button
          type="submit"
          disabled={saving}
          className="bg-[#2D4A3E] text-white px-6 py-2.5 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors disabled:opacity-60"
        >
          {saving ? t('saving') : t('save')}
        </button>
      </form>

      {/* Language preference */}
      <div className="bg-white rounded-2xl p-6 space-y-3">
        <h2
          className="font-semibold text-[#1C1C1A]"
          style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
        >
          {t('lang_title')}
        </h2>
        <p className="text-sm text-[#6B6B65]">{t('lang_body')}</p>
        <div className="flex gap-3">
          {(['en', 'es'] as const).map((l) => (
            <button
              key={l}
              onClick={() => saveLanguage(l)}
              disabled={langSaving}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                border: `1.5px solid ${lang === l ? 'var(--color-pine)' : 'var(--color-border)'}`,
                background: lang === l ? 'var(--color-pine)' : 'transparent',
                color: lang === l ? 'var(--color-text-inverse)' : 'var(--color-text-secondary)',
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                fontWeight: lang === l ? 600 : 400,
                cursor: langSaving ? 'default' : 'pointer',
                opacity: langSaving ? 0.6 : 1,
                transition: 'all 0.18s',
              }}
            >
              {l === 'en' ? t('lang_en') : t('lang_es')}
            </button>
          ))}
        </div>
        {langSaving && <p className="text-xs text-[#6B6B65]">{t('lang_saving')}</p>}
        {langSaved && <p className="text-xs text-[#2D4A3E]">{t('lang_saved')}</p>}
      </div>

      {/* GDPR / Data & Privacy */}
      <div className="bg-white rounded-2xl p-6">
        <h2
          className="font-semibold text-[#1C1C1A] mb-1"
          style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
        >
          {t('data_title')}
        </h2>
        <p className="text-sm text-[#6B6B65] mb-4">{t('data_body')}</p>
        <Link
          href="/portal/my-space/gdpr"
          className="text-sm text-[#2D4A3E] underline underline-offset-2 hover:text-[#7A9E8E] transition-colors"
        >
          {t('data_link')}
        </Link>
      </div>

      {/* Password change */}
      <form onSubmit={changePassword} className="bg-white rounded-2xl p-6 space-y-4">
        <h2
          className="font-semibold text-[#1C1C1A]"
          style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
        >
          {t('password_title')}
        </h2>
        <div>
          <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">{t('new_password_label')}</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors"
            placeholder={t('new_password_placeholder')}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">{t('confirm_label')}</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors"
            placeholder={t('confirm_placeholder')}
          />
        </div>
        {pwError && <p className="text-red-500 text-sm">{pwError}</p>}
        {pwSaved && <p className="text-[#2D4A3E] text-sm">{t('pw_saved')}</p>}
        <button
          type="submit"
          disabled={pwSaving}
          className="bg-[#2D4A3E] text-white px-6 py-2.5 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors disabled:opacity-60"
        >
          {pwSaving ? t('pw_saving') : t('pw_save')}
        </button>
      </form>
    </div>
  )
}
