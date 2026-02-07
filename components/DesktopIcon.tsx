'use client'

import Link from 'next/link'

interface DesktopIconProps {
  label: string
  href: string
  icon?: React.ReactNode
}

export default function DesktopIcon({ label, href, icon }: DesktopIconProps) {
  return (
    <Link 
      href={href}
      className="flex flex-col items-center p-4 rounded hover:bg-white/10 transition-colors w-24 group cursor-pointer"
    >
      <div className="w-12 h-12 bg-gray-700 mb-2 rounded border-2 border-gray-500 group-hover:border-green-400 flex items-center justify-center text-2xl">
        {icon || '📁'}
      </div>
      <span className="text-white text-shadow-sm text-center text-sm font-mono truncate w-full">{label}</span>
    </Link>
  )
}
