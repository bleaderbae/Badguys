'use client'

import { useState, useEffect } from 'react'
import TerminalLoader from './TerminalLoader'
import DesktopShell from './DesktopShell'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [booted, setBooted] = useState(false)

  // Check if already booted in this session
  useEffect(() => {
    const sessionBooted = sessionStorage.getItem('bgc_os_booted')
    if (sessionBooted) {
      setBooted(true)
    }
  }, [])

  const handleBootComplete = () => {
    setBooted(true)
    sessionStorage.setItem('bgc_os_booted', 'true')
  }

  if (!booted) {
    return <TerminalLoader onComplete={handleBootComplete} />
  }

  return (
    <DesktopShell>
      {children}
    </DesktopShell>
  )
}
