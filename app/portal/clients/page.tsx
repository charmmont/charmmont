import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PortalShell from '@/components/PortalShell'
import InviteClientForm from './InviteClientForm'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Clients' }

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/portal/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  if (profile?.role !== 'practitioner') redirect('/portal/my-space')

  const { data: clients } = await supabase
    .from('clients')
    .select('id, programme, start_date, status, created_at, profiles(full_name, email)')
    .order('created_at', { ascending: false })

  return (
    <PortalShell role="practitioner" name={profile?.full_name ?? user.email ?? ''}>
      <div className="flex items-center justify-between mb-8">
        <h1
          className="text-2xl font-semibold text-[#1C1C1A]"
          style={{ fontFamily: 'var(--font-playfair), Georgia, serif' }}
        >
          Clients
        </h1>
        <InviteClientForm />
      </div>

      <div className="bg-white rounded-2xl overflow-hidden">
        {clients && clients.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2D4A3E]/10">
                  <th className="text-left px-6 py-4 text-xs font-medium text-[#6B6B65] uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-[#6B6B65] uppercase tracking-wider hidden md:table-cell">Programme</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-[#6B6B65] uppercase tracking-wider hidden md:table-cell">Start date</th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-[#6B6B65] uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D4A3E]/10">
                {clients.map((c: any) => (
                  <tr key={c.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#1C1C1A]">{c.profiles?.full_name ?? '—'}</p>
                      <p className="text-xs text-[#6B6B65]">{c.profiles?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-[#6B6B65] hidden md:table-cell">{c.programme ?? '—'}</td>
                    <td className="px-6 py-4 text-[#6B6B65] hidden md:table-cell">
                      {c.start_date ? new Date(c.start_date).toLocaleDateString('en-GB') : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        c.status === 'active'
                          ? 'bg-[#2D4A3E]/10 text-[#2D4A3E]'
                          : c.status === 'completed'
                          ? 'bg-[#7A9E8E]/20 text-[#7A9E8E]'
                          : 'bg-[#6B6B65]/10 text-[#6B6B65]'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/portal/clients/${c.id}`}
                        className="text-xs text-[#2D4A3E] hover:text-[#7A9E8E] transition-colors"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center">
            <p className="text-[#6B6B65] text-sm italic mb-6">No clients yet.</p>
            <InviteClientForm />
          </div>
        )}
      </div>
    </PortalShell>
  )
}
