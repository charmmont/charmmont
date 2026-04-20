import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM = 'Deepbloom <hello@deepbloom.me>'
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://deepbloom.me'

// ── Shared styles ─────────────────────────────────────────────────────────────
const emailWrap = (body: string) => `
  <div style="font-family:Georgia,serif;max-width:600px;margin:0 auto;background:#FAF7F2;padding:40px 24px;">
    <div style="margin-bottom:32px;">
      <span style="font-size:22px;font-weight:600;color:#2D4A3E;">Deepbloom</span>
    </div>
    ${body}
    <div style="margin-top:48px;padding-top:24px;border-top:1px solid #2D4A3E20;text-align:center;">
      <p style="color:#6B6B65;font-size:12px;margin:0;">deepbloom.me</p>
    </div>
  </div>
`

const btn = (href: string, label: string) =>
  `<a href="${href}" style="display:inline-block;background:#2D4A3E;color:#fff;text-decoration:none;padding:12px 28px;border-radius:100px;font-size:14px;margin-top:24px;">${label}</a>`

const note = (text: string) =>
  `<div style="background:#2D4A3E15;border-radius:12px;padding:16px 20px;margin:16px 0;font-size:14px;color:#2D4A3E;font-style:italic;">"${text}"</div>`

// ── 1. Tool assigned → client ─────────────────────────────────────────────────
export async function sendToolAssignedEmail(params: {
  clientEmail: string
  clientName: string
  toolName: string
  note?: string | null
  assignmentId: string
}) {
  await resend.emails.send({
    from: FROM,
    to: params.clientEmail,
    subject: `New tool for you: ${params.toolName}`,
    html: emailWrap(`
      <h2 style="font-size:20px;color:#1C1C1A;margin-bottom:8px;">Hi ${params.clientName},</h2>
      <p style="color:#6B6B65;font-size:15px;line-height:1.6;margin-bottom:0;">
        Ayelen has shared a new tool with you.
      </p>
      <p style="font-size:16px;font-weight:600;color:#1C1C1A;margin:16px 0 4px;">${params.toolName}</p>
      ${params.note ? note(params.note) : ''}
      <p style="color:#6B6B65;font-size:14px;line-height:1.6;">
        Log in to your portal to complete it at your own pace.
      </p>
      ${btn(`${SITE}/portal/my-space/tools/${params.assignmentId}`, 'Open tool →')}
    `),
  })
}

// ── 2. Tool completed → practitioner ─────────────────────────────────────────
export async function sendToolCompletedEmail(params: {
  clientName: string
  toolName: string
  toolType: string
  clientId: string
}) {
  const typeLabels: Record<string, string> = {
    onboarding_questionnaire:    'Onboarding Questionnaire',
    self_discovery_questionnaire: 'Self-Discovery Questionnaire',
    values_exercise:             'Values Exercise',
    wheel_of_life:               'Wheel of Life',
    belief_mapping:              'Belief Mapping',
    mood_tracker:                'Mood & Pattern Tracker',
    reflection_journal:          'Reflection Journal',
    gamified_challenge:          'Gamified Challenge',
  }
  const label = typeLabels[params.toolType] ?? params.toolType

  await resend.emails.send({
    from: FROM,
    to: 'hello@deepbloom.me',
    subject: `${params.clientName} completed ${params.toolName}`,
    html: emailWrap(`
      <h2 style="font-size:20px;color:#1C1C1A;margin-bottom:8px;">Tool completed</h2>
      <p style="color:#6B6B65;font-size:15px;line-height:1.6;">
        <strong style="color:#1C1C1A;">${params.clientName}</strong> has completed
        <strong style="color:#1C1C1A;">${params.toolName}</strong>
        <span style="color:#6B6B65;"> (${label})</span>.
      </p>
      <p style="color:#6B6B65;font-size:14px;">View their response in the client profile.</p>
      ${btn(`${SITE}/portal/clients/${params.clientId}`, 'View client profile →')}
    `),
  })
}

// ── 3. Session rescheduled → client ──────────────────────────────────────────
export async function sendSessionRescheduledEmail(params: {
  clientEmail: string
  clientName: string
  newDate: string      // formatted display string e.g. "23 April 2026"
  newTime: string | null  // formatted display string e.g. "21:00" or null
  sessionType: string | null
}) {
  const timeLine = params.newTime
    ? `<p style="color:#6B6B65;font-size:15px;margin:4px 0;">Time: <strong style="color:#1C1C1A;">${params.newTime}</strong></p>`
    : ''
  const typeLine = params.sessionType
    ? `<p style="color:#6B6B65;font-size:14px;margin:4px 0;">${params.sessionType}</p>`
    : ''

  await resend.emails.send({
    from: FROM,
    to: params.clientEmail,
    subject: 'Your session has been rescheduled',
    html: emailWrap(`
      <h2 style="font-size:20px;color:#1C1C1A;margin-bottom:8px;">Hi ${params.clientName},</h2>
      <p style="color:#6B6B65;font-size:15px;line-height:1.6;margin-bottom:16px;">
        Your coaching session has been rescheduled to:
      </p>
      <div style="background:#fff;border-radius:16px;padding:24px;border:1px solid #2D4A3E20;">
        <p style="font-size:15px;font-weight:600;color:#1C1C1A;margin:0 0 4px;">
          ${params.newDate}
        </p>
        ${timeLine}
        ${typeLine}
      </div>
      <p style="color:#6B6B65;font-size:14px;margin-top:16px;line-height:1.6;">
        If you have any questions, please reply to this email or contact hello@deepbloom.me
      </p>
      ${btn(`${SITE}/portal/my-space/sessions`, 'View my sessions →')}
    `),
  })
}

// ── 4. Invoice sent → client ──────────────────────────────────────────────────
export async function sendInvoiceEmail(params: {
  clientEmail: string
  clientName: string
  invoiceNumber: string
  total: number
  dueDate: string | null
  invoiceId: string
}) {
  const dueLine = params.dueDate
    ? `<p style="color:#6B6B65;font-size:14px;margin:4px 0;">Due by ${new Date(params.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>`
    : ''

  await resend.emails.send({
    from: FROM,
    to: params.clientEmail,
    subject: `Invoice ${params.invoiceNumber} from Deepbloom`,
    html: emailWrap(`
      <h2 style="font-size:20px;color:#1C1C1A;margin-bottom:8px;">Hi ${params.clientName},</h2>
      <p style="color:#6B6B65;font-size:15px;line-height:1.6;margin-bottom:16px;">
        Please find your invoice below.
      </p>
      <div style="background:#fff;border-radius:16px;padding:24px;border:1px solid #2D4A3E20;">
        <p style="font-size:13px;color:#6B6B65;margin:0 0 4px;">Invoice</p>
        <p style="font-size:18px;font-weight:700;color:#1C1C1A;font-family:monospace;margin:0 0 8px;">${params.invoiceNumber}</p>
        <p style="font-size:24px;font-weight:700;color:#2D4A3E;margin:0 0 4px;">£${params.total.toFixed(2)}</p>
        ${dueLine}
      </div>
      <p style="color:#6B6B65;font-size:14px;margin-top:16px;">
        You can view and download your invoice as a PDF from your portal.
      </p>
      ${btn(`${SITE}/portal/my-space/invoices/${params.invoiceId}`, 'View invoice →')}
      <p style="color:#6B6B65;font-size:12px;margin-top:24px;">
        Questions? Reply to this email or contact hello@deepbloom.me
      </p>
    `),
  })
}
