import { NextRequest, NextResponse } from 'next/server'

const SPANISH_COUNTRIES = new Set([
  'ES','MX','AR','CO','PE','VE','CL','EC','GT','CU',
  'BO','DO','HN','PY','SV','NI','CR','PA','UY','GQ','PR',
])
const COOKIE = 'NEXT_LOCALE'

export function middleware(request: NextRequest) {
  // Respect existing language choice
  const existing = request.cookies.get(COOKIE)?.value
  if (existing === 'en' || existing === 'es') return NextResponse.next()

  // Auto-detect from Vercel geo header
  const country = (request.headers.get('x-vercel-ip-country') ?? '').toUpperCase()
  const acceptLang = request.headers.get('accept-language') ?? ''
  const isSpanish = SPANISH_COUNTRIES.has(country) || /^es\b/i.test(acceptLang)
  const locale = isSpanish ? 'es' : 'en'

  const response = NextResponse.next()
  response.cookies.set(COOKIE, locale, { path: '/', maxAge: 60 * 60 * 24 * 365 })
  return response
}

export const config = {
  matcher: ['/((?!_next|api|favicon\\.ico|.*\\..*).*)', '/'],
}
