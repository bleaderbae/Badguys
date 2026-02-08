'use client'

import { useState, useEffect, useRef } from 'react'
import { APP_VERSION } from '@/lib/version'

interface TerminalLoaderProps {
  onComplete: () => void
}

const BOOT_LOGS = [
  'Initializing kernel...',
  'Loading core modules...',
  'Mounting file system...',
  'Checking integrity...',
  'Loading visual interface...',
  `Starting BGC_OS v${APP_VERSION}...`,
  'Connecting to server...',
  'Access granted.',
]

interface LogEntry {
  text: string
  time: string
}

export default function TerminalLoader({ onComplete }: TerminalLoaderProps) {
  const [started, setStarted] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)
  const hasRunRef = useRef(false)

  useEffect(() => {
    // Initial delay before showing logs
    if (!started) {
      const timer = setTimeout(() => {
        setStarted(true)
      }, 500)
      return () => clearTimeout(timer)
    }

    // Start showing logs sequence
    if (started && !hasRunRef.current) {
      hasRunRef.current = true

      let delay = 0
      BOOT_LOGS.forEach((logText, index) => {
        delay += Math.random() * 100 + 50
        setTimeout(() => {
          const entry: LogEntry = {
            text: logText,
            time: new Date().toLocaleTimeString()
          }
          setLogs(prev => [...prev, entry])

          // Check if this is the last log
          if (index === BOOT_LOGS.length - 1) {
            setTimeout(onComplete, 400)
          }
        }, delay)
      })
    }
  }, [started, onComplete])

  // Auto-scroll to bottom when logs update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  if (!started) {
    return (
      <div className="fixed inset-0 bg-black font-mono p-4 cursor-none z-50 flex items-start justify-start">
        <div className="w-3 h-5 bg-white" />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black text-green-500 font-mono p-8 overflow-hidden z-50 flex flex-col">
      <div className="max-w-3xl mx-auto w-full">
        {logs.map((log, i) => (
          <div key={i} className="mb-2 break-words">
            <span className="text-gray-500 mr-2">[{log.time}]</span>
            {log.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
