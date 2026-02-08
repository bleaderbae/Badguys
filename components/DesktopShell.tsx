'use client'

import { useState } from 'react'
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
    <div className="min-h-screen bg-[#008080] flex flex-col font-sans relative">
      {/* Wallpaper/Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20"
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
      />

      {/* Main Content Area (Desktop Surface or Window) */}
      <main className="flex-1 relative z-0 p-4 pb-16">
        {children}
      </main>

      {/* Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-gray-300 border-t-2 border-white flex items-center px-2 shadow-md z-50">
        <button 
          onClick={() => setStartOpen(!startOpen)}
          aria-expanded={startOpen}
          aria-haspopup="true"
          aria-controls="start-menu"
          className={`
            px-4 py-1 flex items-center gap-2 border-2 shadow-sm active:shadow-inner active:border-gray-600 transition-all
            ${startOpen ? 'bg-gray-400 border-gray-600 border-r-white border-b-white inset-shadow' : 'bg-gray-300 border-white border-r-gray-600 border-b-gray-600'}
          `}
        >
          <div className="w-5 h-5 bg-gradient-to-br from-green-400 to-blue-600 rounded-sm" />
          <span className="font-bold text-black">Start</span>
        </button>

        <div className="flex-1 mx-4" />

        <div className="bg-gray-200 border-2 border-gray-500 border-b-white border-r-white px-4 py-1 shadow-inner text-sm font-mono">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      <StartMenu isOpen={startOpen} onClose={() => setStartOpen(false)} />
    </div>
  )
}
