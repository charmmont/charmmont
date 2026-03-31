import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import GdprActions from './GdprActions'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Privacy & Data' }

export default async function GdprPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role === 'practitioner') redirect('/portal/dashboard')

  return (
    <PortalShell role="client" name={profile?.full_name ?? user.email ?? ''}>
      <Link
        href="/portal/my-space/profile"
        className="text-sm text-[#6B6B65] hover:text-[#2D4A3E] transition-colors inline-flex items-center gap-2 mb-8"
      >
        ← Profile
      </Link>

      <h1
        className="text-2xl font-semibold text-[#1C1C1A] mb-2"
        style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
      >
        Privacy & Your Data
      </h1>
      <p className="text-sm text-[#6B6B65] mb-8 max-w-lg">
        Under GDPR you have the right to access, download, and request deletion of your personal data.
      </p>

      <GdprActions name={profile?.full_name ?? ''} email={profile?.email ?? ''} />
    </PortalShell>
  )
}
