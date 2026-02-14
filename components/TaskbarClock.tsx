'use client'

import { useState, useEffect, memo } from 'react'

/**
 * TaskbarClock
 *
 * Performance optimization:
 * This component isolates the clock state (which updates every second)
 * to prevent the entire DesktopShell layout from re-rendering unnecessarily.
 */
function TaskbarClock() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)

  useEffect(() => {
    // Set initial time on mount to avoid hydration mismatch
    setCurrentTime(new Date())

    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (!currentTime) {
    // Render a placeholder or nothing during hydration
    return (
        <div className="bg-gray-800 border-2 border-gray-600 border-b-gray-900 border-r-gray-900 px-4 py-1 shadow-inner text-sm font-mono text-gray-300 min-w-[80px] h-[32px]">
        </div>
    )
  }

  return (
    <div className="bg-gray-800 border-2 border-gray-600 border-b-gray-900 border-r-gray-900 px-4 py-1 shadow-inner text-sm font-mono text-gray-300">
      {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </div>
  )
}

export default memo(TaskbarClock)
