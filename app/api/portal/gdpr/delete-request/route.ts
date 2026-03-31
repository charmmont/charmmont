import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name, email } = await request.json()

    await resend.emails.send({
      from: 'Deepbloom <hello@deepbloom.me>',
      to: 'hello@deepbloom.me',
      subject: `GDPR deletion request — ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#2D4A3E;">GDPR Account Deletion Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>User ID:</strong> ${user.id}</p>
          <p><strong>Requested at:</strong> ${new Date().toISOString()}</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
          <p style="color:#888;font-size:13px;">
            This client has requested deletion of their account and data under GDPR Article 17.
            Please process within 30 days. Note: invoices may be retained for financial/legal purposes.
          </p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
