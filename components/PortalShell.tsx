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
      <main style={{ flex: 1, minWidth: 0, padding: '74px 34px 30px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
