import { getRequestConfig } from 'next-intl/server'
import { cookies } from 'next/headers'

const SUPPORTED = ['en', 'es'] as const
type Locale = (typeof SUPPORTED)[number]

function isValid(l: string | undefined): l is Locale {
  return SUPPORTED.includes(l as Locale)
}

export default getRequestConfig(async ({ requestLocale }) => {
  // URL-segment locale comes first (for future locale-prefix routes)
  let locale: string | undefined = await requestLocale

  // Fall back to cookie (our primary detection mechanism)
  if (!isValid(locale)) {
    const cookieStore = await cookies()
    locale = cookieStore.get('NEXT_LOCALE')?.value
  }

  if (!isValid(locale)) locale = 'en'

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
