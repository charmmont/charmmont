'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Props {
  profile: any
  userId: string
}

export default function ProfileForm({ profile, userId }: Props) {
  const [name, setName] = useState(profile?.full_name ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  // Password change
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwSaved, setPwSaved] = useState(false)
  const [pwError, setPwError] = useState('')

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
    if (newPassword !== confirmPassword) {
      setPwError('Passwords do not match.')
      return
    }
    if (newPassword.length < 8) {
      setPwError('Password must be at least 8 characters.')
      return
    }
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

  return (
    <div className="space-y-6">
      {/* Profile info */}
      <form onSubmit={saveProfile} className="bg-white rounded-2xl p-6 space-y-4">
        <h2
          className="font-semibold text-[#1C1C1A]"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Personal details
        </h2>
        <div>
          <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Full name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Email</label>
          <input
            type="email"
            value={profile?.email ?? ''}
            disabled
            className="w-full border border-[#2D4A3E]/10 rounded-xl px-4 py-3 text-sm bg-[#FAF7F2] text-[#6B6B65] cursor-not-allowed"
          />
          <p className="text-xs text-[#6B6B65] mt-1">Email cannot be changed here.</p>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {saved && <p className="text-[#2D4A3E] text-sm">Profile updated.</p>}
        <button
          type="submit"
          disabled={saving}
          className="bg-[#2D4A3E] text-white px-6 py-2.5 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>

      {/* GDPR / Data & Privacy */}
      <div className="bg-white rounded-2xl p-6">
        <h2
          className="font-semibold text-[#1C1C1A] mb-1"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Data & privacy
        </h2>
        <p className="text-sm text-[#6B6B65] mb-4">
          You can export your data or request account deletion under GDPR.
        </p>
        <Link
          href="/portal/my-space/gdpr"
          className="text-sm text-[#2D4A3E] underline underline-offset-2 hover:text-[#7A9E8E] transition-colors"
        >
          Manage your data →
        </Link>
      </div>

      {/* Password change */}
      <form onSubmit={changePassword} className="bg-white rounded-2xl p-6 space-y-4">
        <h2
          className="font-semibold text-[#1C1C1A]"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Change password
        </h2>
        <div>
          <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">New password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors"
            placeholder="Minimum 8 characters"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1C1C1A] mb-1.5">Confirm password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-[#2D4A3E]/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#2D4A3E] transition-colors"
            placeholder="••••••••"
          />
        </div>
        {pwError && <p className="text-red-500 text-sm">{pwError}</p>}
        {pwSaved && <p className="text-[#2D4A3E] text-sm">Password updated.</p>}
        <button
          type="submit"
          disabled={pwSaving}
          className="bg-[#2D4A3E] text-white px-6 py-2.5 rounded-full text-sm hover:bg-[#7A9E8E] transition-colors disabled:opacity-60"
        >
          {pwSaving ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </div>
  )
}
