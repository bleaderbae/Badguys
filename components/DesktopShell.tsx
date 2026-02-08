'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import StartMenu from './StartMenu'

export default function DesktopShell({ children }: { children: React.ReactNode }) {
  const [startOpen, setStartOpen] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Use a ref for the start menu button and the menu itself to detect clicks outside
  const startButtonRef = useRef<HTMLButtonElement>(null)
  const startMenuRef = useRef<HTMLDivElement>(null)

  // Update clock
  useState(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  })

  // Close start menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (startOpen &&
          startButtonRef.current &&
          !startButtonRef.current.contains(event.target as Node) &&
          startMenuRef.current &&
          !startMenuRef.current.contains(event.target as Node)) {
        setStartOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [startOpen])

  return (
    <div className="min-h-screen bg-black font-sans relative isolate grid grid-rows-[1fr] grid-cols-[1fr]">
      {/* Wallpaper/Background */}
      <div className="col-start-1 row-start-1 sticky top-0 h-screen w-full -z-10 overflow-hidden">
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
      <main className="col-start-1 row-start-1 w-full relative z-0 p-4 pb-16 min-h-screen">
        {children}
      </main>

      {/* Taskbar */}
      <div className="fixed bottom-0 left-0 right-0 h-12 bg-gray-900 border-t-2 border-gray-700 flex items-center px-2 shadow-lg z-50">
        <button 
          ref={startButtonRef}
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

      {/* Position the StartMenu relative to the taskbar container but absolute to viewport effectively via bottom-12 */}
      {/* Since startMenu is rendered here, we need to pass the ref down or wrap it */}
      <div ref={startMenuRef}>
        <StartMenu isOpen={startOpen} onClose={() => setStartOpen(false)} />
      </div>
    </div>
  )
}
