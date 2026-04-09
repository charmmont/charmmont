import { NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { exchangeGoogleCode } from '@/lib/google-calendar'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code  = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) redirect('/portal/settings?google=error')

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  try {
    const tokens = await exchangeGoogleCode(code)
    await supabase
      .from('profiles')
      .update({ google_refresh_token: tokens.refresh_token })
      .eq('id', user.id)
  } catch {
    redirect('/portal/settings?google=error')
  }

  redirect('/portal/settings?google=connected')
}
