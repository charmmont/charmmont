import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { exchangeGoogleCode } from '@/lib/google-calendar'

const BASE = 'https://deepbloom.me'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code  = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) return NextResponse.redirect(`${BASE}/portal/settings?google=error`)

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(`${BASE}/portal/login`)

  try {
    const tokens = await exchangeGoogleCode(code!)
    await supabase
      .from('profiles')
      .update({ google_refresh_token: tokens.refresh_token })
      .eq('id', user.id)
  } catch {
    return NextResponse.redirect(`${BASE}/portal/settings?google=error`)
  }

  return NextResponse.redirect(`${BASE}/portal/settings?google=connected`)
}
