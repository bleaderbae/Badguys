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

  const dateString = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const timeString = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  return (
    <div
      className="bg-gray-800 border-2 border-gray-600 border-b-gray-900 border-r-gray-900 px-4 py-1 shadow-inner text-sm font-mono text-gray-300 cursor-default select-none"
      title={dateString}
      aria-label={`Current time: ${timeString}, Date: ${dateString}`}
      role="timer"
    >
      {timeString}
    </div>
  )
}

export default memo(TaskbarClock)
