import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Deepbloom Portal',
    template: '%s | Deepbloom Portal',
  },
}

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {children}
    </div>
  )
}
