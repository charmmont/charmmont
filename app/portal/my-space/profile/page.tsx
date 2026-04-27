import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import ProfileForm from './ProfileForm'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export const metadata: Metadata = { title: 'My Profile' }

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role === 'practitioner') redirect('/portal/dashboard')

  const t = await getTranslations('MyProfile')

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

      <div className="max-w-md">
        <ProfileForm profile={profile} userId={user.id} />
      </div>
    </PortalShell>
  )
}
