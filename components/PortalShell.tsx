import PortalNav from './PortalNav'
import type { UserRole } from '@/lib/types'

interface Props {
  role: UserRole
  name: string
  children: React.ReactNode
}

export default function PortalShell({ role, name, children }: Props) {
  return (
    <>
      <PortalNav role={role} name={name} />
      <div className="pt-14 min-h-screen bg-[#FAF7F2]">
        <div className="max-w-6xl mx-auto px-6 py-10">
          {children}
        </div>
      </div>
    </>
  )
}
