'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import StartMenu from './StartMenu'
import DesktopIcons from './DesktopIcons'
import WindowFrame from './WindowFrame'
import TaskbarClock from './TaskbarClock'

export default function DesktopShell({ children }: { children: React.ReactNode }) {
  const [startOpen, setStartOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const pathname = usePathname()

  const startButtonRef = useRef<HTMLButtonElement>(null)
  const startMenuRef = useRef<HTMLDivElement>(null)

  // Reset minimized state when navigating
  useEffect(() => {
    setIsMinimized(false)
  }, [pathname])

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

    function handleKeyDown(event: KeyboardEvent) {
      if (startOpen && event.key === 'Escape') {
        setStartOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [startOpen])

  const isHome = pathname === '/'

  // Helper to determine window title based on path
  const getWindowTitle = (path: string) => {
    if (path.startsWith('/shop/golf')) return 'Pro Shop 2K25.exe'
    if (path.startsWith('/shop/samurai')) return 'Samurai_Drop.exe'
    if (path.startsWith('/shop/all')) return 'Shop_Network.exe'
    if (path.startsWith('/shop')) return 'Shop_Network.exe'
    if (path.startsWith('/cart')) return 'Recycle Bin'
    if (path.startsWith('/about')) return 'System_Info.txt'
    if (path.startsWith('/contact')) return 'Contact_Admin.exe'
    if (path.startsWith('/product')) return 'The_Vault.exe'
    if (path.startsWith('/profile')) return 'User_Profile.dat'
    if (path.startsWith('/settings')) return 'Settings.cfg'
    return 'Application.exe'
  }

  const windowTitle = getWindowTitle(pathname)

  // Memoized handlers to prevent unnecessary re-renders of child components
  const handleStartToggle = useCallback(() => setStartOpen(prev => !prev), [])
  const handleMinimize = useCallback(() => setIsMinimized(true), [])
  const handleWindowToggle = useCallback(() => setIsMinimized(prev => !prev), [])
  const handleStartClose = useCallback(() => setStartOpen(false), [])

  return (
    <div className="min-h-screen bg-black font-sans isolate overflow-hidden grid grid-cols-[1fr] grid-rows-[1fr]">
      {/* Wallpaper/Background */}
      <div className="col-start-1 row-start-1 sticky top-0 h-screen w-full -z-20 overflow-hidden">
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

      {/* Main Content Area */}
      <main className="col-start-1 row-start-1 z-0 min-h-screen pb-12 w-full">
        {/* Desktop Icons Layer - Always render icons. If isHome, children IS the icons. */}
        <div className={`min-h-screen ${!isHome ? 'fixed inset-0' : ''}`}>
           {isHome ? children : <DesktopIcons />}
        </div>

        {/* Window Modal Layer (Only if not home) */}
        {!isHome && !isMinimized && (
          <div className="fixed inset-0 z-20 flex items-center justify-center p-0 md:p-8 pb-16 pointer-events-none">
            <WindowFrame title={windowTitle} onMinimize={handleMinimize}>
              {children}
            </WindowFrame>
          </div>
        )}
      </main>

      {/* Taskbar */}
      <div
        className="fixed bottom-0 left-0 right-0 h-12 bg-gray-900 border-t-2 border-gray-700 flex items-center px-2 shadow-lg z-50"
        role="navigation"
        aria-label="Taskbar"
      >
        <button 
          ref={startButtonRef}
          onClick={handleStartToggle}
          aria-expanded={startOpen}
          aria-haspopup="true"
          aria-controls="start-menu"
          className={`
            px-4 py-1 flex items-center gap-2 border-2 shadow-sm active:shadow-inner active:border-gray-900 transition-all focus-visible:ring-2 focus-visible:ring-green-400 focus:outline-none active:scale-95
            ${startOpen ? 'bg-gray-700 border-gray-800 border-r-gray-600 border-b-gray-600 inset-shadow' : 'bg-gray-800 border-gray-600 border-r-gray-900 border-b-gray-900'}
          `}
        >
          <div className="w-5 h-5 bg-gradient-to-br from-red-600 to-black rounded-sm border border-gray-500" />
          <span className="font-bold text-gray-200">Start</span>
        </button>

        <div className="flex-1 mx-4 flex items-center gap-2 overflow-x-auto">
            {!isHome && (
                <button
                    onClick={handleWindowToggle}
                    className={`
                        px-4 py-1 flex items-center gap-2 border-2 shadow-sm transition-all min-w-[150px] max-w-[200px] truncate focus-visible:ring-2 focus-visible:ring-green-400 focus:outline-none active:scale-95
                        ${!isMinimized
                            ? 'bg-gray-700 border-gray-800 border-r-gray-600 border-b-gray-600 inset-shadow'
                            : 'bg-gray-800 border-gray-600 border-r-gray-900 border-b-gray-900 hover:bg-gray-700'
                        }
                    `}
                >
                   <span className="font-mono text-xs text-gray-200 truncate">{windowTitle}</span>
                </button>
            )}
        </div>

        <TaskbarClock />
      </div>

      {/* StartMenu */}
      <div ref={startMenuRef}>
        <AnimatePresence>
          {startOpen && <StartMenu onClose={handleStartClose} />}
        </AnimatePresence>
      </div>
    </div>
  )
}
