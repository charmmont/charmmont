'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useTranslations } from 'next-intl'

type Step = 'loading' | 'set-password' | 'success' | 'error'

export default function SetPasswordPage() {
  const t = useTranslations('SetPassword')
  const router = useRouter()
  const [step, setStep] = useState<Step>('loading')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const hash = window.location.hash.substring(1)
    const params = new URLSearchParams(hash)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')

    if (!accessToken) {
      setStep('error')
      return
    }

    const supabase = createClient()
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken ?? '',
    }).then(({ error }) => {
      if (error) {
        setStep('error')
      } else {
        setStep('set-password')
        window.history.replaceState(null, '', '/portal/set-password')
      }
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError(t('error_length'))
      return
    }
    if (password !== confirm) {
      setError(t('error_match'))
      return
    }

    setSaving(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      setStep('success')
      setTimeout(() => {
        router.push(profile?.role === 'practitioner' ? '/portal/dashboard' : '/portal/my-space')
      }, 2000)
    } else {
      setStep('success')
      setTimeout(() => router.push('/portal/login'), 2000)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col items-center gap-1">
            <span
              className="text-2xl font-semibold text-[#2D4A3E]"
              style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
            >
              Deepbloom
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-8">
          {step === 'loading' && (
            <div className="text-center py-6">
              <p className="text-[#6B6B65] text-sm">{t('verifying')}</p>
            </div>
          )}

          {step === 'set-password' && (
            <>
              <h1
                className="text-xl font-semibold text-[#1C1C1A] mb-2 text-center"
                style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
              >
                {t('title')}
              </h1>
              <p className="text-[#6B6B65] text-sm text-center mb-6">{t('sub')}</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">
                    {t('new_password_label')}
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors"
                    placeholder={t('new_password_placeholder')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">
                    {t('confirm_label')}
                  </label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    required
                    className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors"
                    placeholder={t('confirm_placeholder')}
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-[#2D4A3E] text-white py-3 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors disabled:opacity-60 mt-2"
                >
                  {saving ? t('submitting') : t('submit')}
                </button>
              </form>
            </>
          )}

          {step === 'success' && (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full bg-[#2D4A3E]/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-[#2D4A3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p
                className="text-xl font-semibold text-[#1C1C1A] mb-2"
                style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
              >
                {t('success_title')}
              </p>
              <p className="text-[#6B6B65] text-sm">{t('success_body')}</p>
            </div>
          )}

          {step === 'error' && (
            <div className="text-center py-6">
              <p
                className="text-xl font-semibold text-[#1C1C1A] mb-3"
                style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
              >
                {t('expired_title')}
              </p>
              <p className="text-[#6B6B65] text-sm mb-6">{t('expired_body')}</p>
              <Link
                href="/portal/login"
                className="text-sm text-[#2D4A3E] hover:text-[#7A9E8E] transition-colors"
              >
                {t('sign_in')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
