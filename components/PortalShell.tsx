import PortalNav from './PortalNav'
import type { UserRole } from '@/lib/types'

interface Props {
  role: UserRole
  name: string
  children: React.ReactNode
}

export default function PortalShell({ role, name, children }: Props) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <PortalNav role={role} name={name} />
      <main style={{ flex: 1, minWidth: 0, padding: '30px 34px', overflowY: 'auto' }}>
        {/* On mobile: push content below the fixed 54px top bar. No inline paddingTop on this div so the CSS class wins cleanly. */}
        <div className="portal-content-offset">
          {children}
        </div>
      </main>
    </div>
  )
}
