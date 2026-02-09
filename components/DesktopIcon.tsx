'use client'

import Link from 'next/link'

interface DesktopIconProps {
  label: string
  href: string
  icon?: React.ReactNode
  badge?: number | string
}

export default function DesktopIcon({ label, href, icon, badge }: DesktopIconProps) {
  return (
    <Link 
      href={href}
      className="flex flex-col items-center p-4 rounded hover:bg-white/10 transition-colors w-24 group cursor-pointer relative focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:bg-white/10 focus:outline-none active:scale-95 active:bg-white/20"
      aria-label={label}
    >
      <div className="w-12 h-12 bg-gray-700 mb-2 rounded border-2 border-gray-500 group-hover:border-green-400 flex items-center justify-center text-2xl relative">
        {icon || '📁'}
        {badge !== undefined && badge !== null && (
          <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border border-white">
            {badge}
          </div>
        )}
      </div>
      <span className="text-white text-shadow-sm text-center text-sm font-mono truncate w-full">{label}</span>
    </Link>
  )
}
