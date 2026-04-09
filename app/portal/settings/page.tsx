import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Settings' }

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ google?: string }>
}) {
  const { google } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'practitioner') redirect('/portal/my-space')

  const isConnected = !!profile?.google_refresh_token

  return (
    <PortalShell role="practitioner" name={profile?.full_name ?? user.email ?? ''}>
      <div className="mb-8">
        <h1
          className="text-2xl font-semibold text-[#1C1C1A]"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Settings
        </h1>
        <p className="text-[#6B6B65] text-sm mt-1">Manage your account and integrations.</p>
      </div>

      <div className="space-y-4 max-w-2xl">
        {/* Google Calendar */}
        <div className="bg-white rounded-2xl p-6 border border-[#2D4A3E]/10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {/* Google Calendar icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="#2D4A3E" strokeWidth="1.5"/>
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="#2D4A3E" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M8 14h2v2H8zM11 14h2v2h-2zM14 14h2v2h-2zM8 17h2v2H8zM11 17h2v2h-2z" fill="#7A9E8E"/>
                </svg>
                <h2 className="text-sm font-semibold text-[#1C1C1A]">Google Calendar</h2>
                {isConnected && (
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#2D4A3E]/10 text-[#2D4A3E] uppercase tracking-wide">
                    Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-[#6B6B65] leading-relaxed">
                {isConnected
                  ? 'Sessions you book in Deepbloom will appear in your Google Calendar automatically.'
                  : 'Connect your Google Calendar to sync sessions automatically. Each practitioner connects their own account.'}
              </p>
              {google === 'connected' && (
                <p className="text-xs text-[#2D4A3E] font-medium mt-2">Calendar connected successfully.</p>
              )}
              {google === 'error' && (
                <p className="text-xs text-red-500 mt-2">Something went wrong. Please try again.</p>
              )}
            </div>
            <Link
              href="/portal/settings/google"
              className="shrink-0 text-sm px-4 py-2 rounded-full border border-[#2D4A3E]/20 text-[#2D4A3E] hover:bg-[#2D4A3E]/5 transition-colors whitespace-nowrap"
            >
              {isConnected ? 'Reconnect' : 'Connect'}
            </Link>
          </div>
        </div>

        {/* Profile info */}
        <div className="bg-white rounded-2xl p-6 border border-[#2D4A3E]/10">
          <h2 className="text-sm font-semibold text-[#1C1C1A] mb-3">Your account</h2>
          <div className="space-y-2 text-sm text-[#6B6B65]">
            <div className="flex justify-between">
              <span>Name</span>
              <span className="text-[#1C1C1A] font-medium">{profile?.full_name ?? '—'}</span>
            </div>
            <div className="flex justify-between">
              <span>Email</span>
              <span className="text-[#1C1C1A]">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Role</span>
              <span className="text-[#1C1C1A] capitalize">{profile?.role}</span>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  )
}
