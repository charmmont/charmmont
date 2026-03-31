import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  sendToolAssignedEmail,
  sendToolCompletedEmail,
  sendInvoiceEmail,
} from '@/lib/email'

// POST /api/portal/notify
// Body: { type: 'tool_assigned' | 'tool_completed' | 'invoice_sent', ...params }
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, ...params } = body

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    switch (type) {
      case 'tool_assigned': {
        // params: { clientEmail, clientName, toolName, note, assignmentId, clientId, toolId }
        await sendToolAssignedEmail({
          clientEmail: params.clientEmail,
          clientName:  params.clientName,
          toolName:    params.toolName,
          note:        params.note ?? null,
          assignmentId: params.assignmentId,
        })
        await supabase.from('audit_log').insert({
          practitioner_id: user.id,
          action: 'tool_assigned',
          entity_type: 'tool_assignment',
          entity_id: params.assignmentId,
          metadata: { tool_name: params.toolName, client_name: params.clientName },
        })
        break
      }

      case 'tool_completed': {
        // params: { clientName, toolName, toolType, clientId, assignmentId }
        await sendToolCompletedEmail({
          clientName: params.clientName,
          toolName:   params.toolName,
          toolType:   params.toolType,
          clientId:   params.clientId,
        })
        // No audit_log write here — this is triggered by the client, not the practitioner
        break
      }

      case 'invoice_sent': {
        // params: { clientEmail, clientName, invoiceNumber, total, dueDate, invoiceId, clientId }
        await sendInvoiceEmail({
          clientEmail:   params.clientEmail,
          clientName:    params.clientName,
          invoiceNumber: params.invoiceNumber,
          total:         params.total,
          dueDate:       params.dueDate ?? null,
          invoiceId:     params.invoiceId,
        })
        await supabase.from('audit_log').insert({
          practitioner_id: user.id,
          action: 'invoice_sent',
          entity_type: 'invoice',
          entity_id: params.invoiceId,
          metadata: { invoice_number: params.invoiceNumber, total: params.total, client_name: params.clientName },
        })
        break
      }

      default:
        return NextResponse.json({ error: 'Unknown notification type' }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('[notify]', err)
    // Return ok anyway — notifications should not break the UI
    return NextResponse.json({ ok: true, warning: err?.message })
  }
}
