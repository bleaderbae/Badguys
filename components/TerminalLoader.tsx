'use client'

import { useState, useEffect, useRef } from 'react'

interface TerminalLoaderProps {
  onComplete: () => void
}

const BOOT_LOGS = [
  'Initializing kernel...',
  'Loading core modules...',
  'Mounting file system...',
  'Checking integrity...',
  'Loading visual interface...',
  'Starting BGC_OS v1.0...',
  'Connecting to server...',
  'Access granted.',
]

export default function TerminalLoader({ onComplete }: TerminalLoaderProps) {
  const [started, setStarted] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!started) {
      const timer = setTimeout(() => setStarted(true), 1500)
      return () => clearTimeout(timer)
    } else {
      let delay = 0
      BOOT_LOGS.forEach((log, index) => {
        delay += Math.random() * 300 + 100
        setTimeout(() => {
          setLogs(prev => [...prev, log])
          if (index === BOOT_LOGS.length - 1) {
            setTimeout(onComplete, 800)
          }
        }, delay)
      })
    }
  }, [started, onComplete])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  if (!started) {
    return (
      <div className="fixed inset-0 bg-black font-mono p-4 cursor-none">
        <div className="w-3 h-5 bg-white animate-pulse" />
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black text-green-500 font-mono p-8 overflow-hidden">
      <div className="max-w-3xl mx-auto">
        {logs.map((log, i) => (
          <div key={i} className="mb-2">
            <span className="text-gray-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
            {log}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
