import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import ToolResponder from './ToolResponder'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'My Tools' }

export default async function MyToolsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role === 'practitioner') redirect('/portal/dashboard')

  const { data: clientRecord } = await supabase
    .from('clients').select('id').eq('profile_id', user.id).single()

  const { data: assignments } = await supabase
    .from('tool_assignments')
    .select('*, tools(id, name, description, type, questions)')
    .eq('client_id', clientRecord?.id)
    .order('assigned_at', { ascending: false })

  return (
    <PortalShell role="client" name={profile?.full_name ?? user.email ?? ''}>
      <Link
        href="/portal/my-space"
        className="text-sm text-[#6B6B65] hover:text-[#2D4A3E] transition-colors inline-flex items-center gap-2 mb-8"
      >
        ← My Space
      </Link>

      <h1
        className="text-2xl font-semibold text-[#1C1C1A] mb-8"
        style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
      >
        My Tools
      </h1>

      {assignments && assignments.length > 0 ? (
        <div className="space-y-4">
          {assignments.map((a: any) => (
            <ToolResponder
              key={a.id}
              assignment={a}
              clientId={clientRecord?.id ?? ''}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-16 text-center text-[#6B6B65] text-sm italic">
          No tools assigned yet. Your practitioner will send tools for you to complete between sessions.
        </div>
      )}
    </PortalShell>
  )
}
