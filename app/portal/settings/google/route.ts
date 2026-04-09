import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getGoogleAuthUrl } from '@/lib/google-calendar'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/portal/login', 'https://deepbloom.me'))

  const url = getGoogleAuthUrl(user.id)
  return NextResponse.redirect(url)
}
