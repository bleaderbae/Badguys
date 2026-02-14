'use client'

import Link from 'next/link'
import { memo } from 'react'

interface WindowFrameProps {
  children: React.ReactNode
  title?: string
  onMinimize?: () => void
}

function WindowFrame({ children, title = "Application", onMinimize }: WindowFrameProps) {
  return (
    <div className="w-full md:max-w-6xl h-full md:h-[85vh] bg-gray-900 border-0 md:border-2 border-gray-600 shadow-2xl md:rounded-lg overflow-hidden flex flex-col md:animate-scale-in relative z-50 pointer-events-auto">
      {/* Title Bar */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-2 border-b-2 border-gray-600 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2 px-2">
          {/* Removed OSX traffic lights, kept title */}
          <span className="text-white font-mono font-bold text-sm tracking-wide uppercase">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          {onMinimize && (
            <button
              onClick={onMinimize}
              className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white font-bold text-xs rounded border border-gray-800 transition-colors"
              aria-label="Minimize Window"
            >
              _
            </button>
          )}
          <Link
            href="/"
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded border border-red-800 transition-colors"
            aria-label="Close Window"
          >
            X
          </Link>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-black/95 p-0 relative">
        {children}
      </div>
    </div>
  )
}

export default memo(WindowFrame)
