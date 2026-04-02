'use client'

import { useEffect, useState } from 'react'
import PortalNav from './PortalNav'
import type { UserRole } from '@/lib/types'

interface Props {
  role: UserRole
  name: string
  children: React.ReactNode
}

export default function PortalShell({ role, name, children }: Props) {
  const [paddingTop, setPaddingTop] = useState(30)

  useEffect(() => {
    const update = () => setPaddingTop(window.innerWidth < 768 ? 84 : 30)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      <PortalNav role={role} name={name} />
      <main style={{
        flex: 1,
        minWidth: 0,
        paddingTop,
        paddingBottom: 30,
        paddingLeft: 34,
        paddingRight: 34,
        overflowY: 'auto',
      }}>
        {children}
      </main>
    </div>
  )
}
