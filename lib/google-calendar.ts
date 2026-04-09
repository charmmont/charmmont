/**
 * Google Calendar integration for Deepbloom.
 * Uses per-practitioner OAuth tokens stored in profiles.google_refresh_token.
 */

const CLIENT_ID     = process.env.GOOGLE_CLIENT_ID!.trim()
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!.trim()
const REDIRECT_URI  = process.env.GOOGLE_REDIRECT_URI!.trim()
const SCOPES        = ['https://www.googleapis.com/auth/calendar']

// ── OAuth helpers ─────────────────────────────────────────────────────────────

export function getGoogleAuthUrl(state?: string): string {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: SCOPES.join(' '),
    access_type: 'offline',
    prompt: 'consent',
    ...(state ? { state } : {}),
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

export async function exchangeGoogleCode(code: string): Promise<{
  access_token: string
  refresh_token: string
  expires_in: number
}> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    }),
  })
  if (!res.ok) throw new Error(`Token exchange failed: ${await res.text()}`)
  return res.json()
}

async function getAccessToken(refreshToken: string): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token',
    }),
  })
  if (!res.ok) throw new Error(`Token refresh failed: ${await res.text()}`)
  const data = await res.json()
  return data.access_token
}

// ── Calendar event types ──────────────────────────────────────────────────────

export interface CalendarEventInput {
  summary: string
  description?: string
  startDateTime: string  // ISO 8601
  endDateTime: string    // ISO 8601
  timeZone?: string
}

// ── Calendar API calls ────────────────────────────────────────────────────────

export async function createCalendarEvent(
  refreshToken: string,
  calendarId: string = 'primary',
  event: CalendarEventInput,
): Promise<string> {
  const accessToken = await getAccessToken(refreshToken)
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: event.summary,
        description: event.description,
        start: { dateTime: event.startDateTime, timeZone: event.timeZone ?? 'Europe/London' },
        end:   { dateTime: event.endDateTime,   timeZone: event.timeZone ?? 'Europe/London' },
      }),
    }
  )
  if (!res.ok) throw new Error(`Create event failed: ${await res.text()}`)
  const data = await res.json()
  return data.id as string
}

export async function updateCalendarEvent(
  refreshToken: string,
  calendarId: string = 'primary',
  eventId: string,
  event: CalendarEventInput,
): Promise<void> {
  const accessToken = await getAccessToken(refreshToken)
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: event.summary,
        description: event.description,
        start: { dateTime: event.startDateTime, timeZone: event.timeZone ?? 'Europe/London' },
        end:   { dateTime: event.endDateTime,   timeZone: event.timeZone ?? 'Europe/London' },
      }),
    }
  )
  if (!res.ok) throw new Error(`Update event failed: ${await res.text()}`)
}

export async function deleteCalendarEvent(
  refreshToken: string,
  calendarId: string = 'primary',
  eventId: string,
): Promise<void> {
  const accessToken = await getAccessToken(refreshToken)
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${eventId}`,
    { method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` } }
  )
  // 404 means already deleted — not an error
  if (!res.ok && res.status !== 404) throw new Error(`Delete event failed: ${await res.text()}`)
}
