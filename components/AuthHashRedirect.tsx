'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// Detects Supabase auth tokens in the URL hash (invite / password-reset flow)
// and redirects to the set-password page with the hash intact.
export default function AuthHashRedirect() {
  const router = useRouter()

  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return

    const params = new URLSearchParams(hash.substring(1))
    const accessToken = params.get('access_token')
    const type = params.get('type')

    if (accessToken && (type === 'invite' || type === 'recovery')) {
      router.replace(`/portal/set-password${hash}`)
    }
  }, [router])

  return null
}
