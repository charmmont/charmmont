import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const SPANISH_COUNTRIES = new Set([
  'ES','MX','AR','CO','PE','VE','CL','EC','GT','CU',
  'BO','DO','HN','PY','SV','NI','CR','PA','UY','GQ','PR',
])
const LOCALE_COOKIE = 'NEXT_LOCALE'

export async function proxy(request: NextRequest) {
  // Determine whether to set locale cookie
  const existingLocale = request.cookies.get(LOCALE_COOKIE)?.value
  let newLocale: string | null = null
  if (existingLocale !== 'en' && existingLocale !== 'es') {
    const country = (request.headers.get('x-vercel-ip-country') ?? '').toUpperCase()
    const acceptLang = request.headers.get('accept-language') ?? ''
    const isSpanish = SPANISH_COUNTRIES.has(country) || /^es\b/i.test(acceptLang)
    newLocale = isSpanish ? 'es' : 'en'
  }

  const setLocaleCookie = (response: NextResponse) => {
    if (newLocale) {
      response.cookies.set(LOCALE_COOKIE, newLocale, { path: '/', maxAge: 60 * 60 * 24 * 365 })
    }
    return response
  }

  // Non-portal routes: only locale detection needed
  const isPortalRoute = request.nextUrl.pathname.startsWith('/portal')
  if (!isPortalRoute) {
    return setLocaleCookie(NextResponse.next())
  }

  // Portal routes: Supabase auth + locale
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isLoginRoute = request.nextUrl.pathname === '/portal/login'
  const isPublicPortalRoute =
    request.nextUrl.pathname === '/portal/set-password' ||
    request.nextUrl.pathname === '/portal/reset-password'

  if (!isLoginRoute && !isPublicPortalRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/portal/login'
    return setLocaleCookie(NextResponse.redirect(url))
  }

  if (isLoginRoute && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const url = request.nextUrl.clone()
    url.pathname = profile?.role === 'practitioner' ? '/portal/dashboard' : '/portal/my-space'
    return setLocaleCookie(NextResponse.redirect(url))
  }

  return setLocaleCookie(supabaseResponse)
}

export const config = {
  matcher: ['/((?!_next|api|favicon\\.ico|.*\\..*).*)', '/'],
}
