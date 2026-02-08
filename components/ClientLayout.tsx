'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import TerminalLoader from './TerminalLoader'
import DesktopShell from './DesktopShell'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // null = checking, false = booting, true = booted
  const [booted, setBooted] = useState<boolean | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const sessionBooted = sessionStorage.getItem('bgc_os_booted')

    // Logic:
    // 1. If already booted in session -> Skip
    // 2. If NOT at root ('/') -> Skip (and mark as booted for future)
    if (sessionBooted) {
      setBooted(true)
    } else if (pathname !== '/') {
      setBooted(true)
      sessionStorage.setItem('bgc_os_booted', 'true')
    } else {
      setBooted(false)
    }
  }, [pathname])

  const handleBootComplete = () => {
    setBooted(true)
    sessionStorage.setItem('bgc_os_booted', 'true')
  }

  if (booted === null) {
    return <div className="fixed inset-0 bg-black z-50" />
  }

  if (booted === false) {
    return <TerminalLoader onComplete={handleBootComplete} />
  }

  return (
    <DesktopShell>
      {children}
    </DesktopShell>
  )
}
