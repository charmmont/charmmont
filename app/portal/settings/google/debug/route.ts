import { NextResponse } from 'next/server'
import { getGoogleAuthUrl } from '@/lib/google-calendar'

export async function GET() {
  const url = getGoogleAuthUrl('debug-state')
  return NextResponse.json({
    generated_url: url,
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI,
  })
}
