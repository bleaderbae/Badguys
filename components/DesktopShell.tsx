'use client'

import { useState } from 'react'
import Image from 'next/image'
import StartMenu from './StartMenu'

export default function DesktopShell({ children }: { children: React.ReactNode }) {
  const [startOpen, setStartOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update clock
  useState(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  })

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans relative">
      {/* Wallpaper/Background */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/wallpaper.jpg"
          alt="Bad Guys Club Wallpaper"
          fill
          className="object-cover opacity-80"
          quality={100}
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Main Content Area (Desktop Surface or Window) */}
      <main className="flex-1 relative z-0 p-4 pb-16">
        {children}
      </main>

      {/* Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-gray-900 border-t-2 border-gray-700 flex items-center px-2 shadow-lg z-50">
        <button 
          onClick={() => setStartOpen(!startOpen)}
          aria-expanded={startOpen}
          aria-haspopup="true"
          aria-controls="start-menu"
          className={`
            px-4 py-1 flex items-center gap-2 border-2 shadow-sm active:shadow-inner active:border-gray-900 transition-all
            ${startOpen ? 'bg-gray-700 border-gray-800 border-r-gray-600 border-b-gray-600 inset-shadow' : 'bg-gray-800 border-gray-600 border-r-gray-900 border-b-gray-900'}
          `}
        >
          <div className="w-5 h-5 bg-gradient-to-br from-red-600 to-black rounded-sm border border-gray-500" />
          <span className="font-bold text-gray-200">Start</span>
        </button>

        <div className="flex-1 mx-4" />

        <div className="bg-gray-800 border-2 border-gray-600 border-b-gray-900 border-r-gray-900 px-4 py-1 shadow-inner text-sm font-mono text-gray-300">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <StartMenu isOpen={startOpen} onClose={() => setStartOpen(false)} />
    </div>
  )
}
