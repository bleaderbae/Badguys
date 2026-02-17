'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { memo } from 'react'
import { useCart } from './CartContext'
import { START_MENU_ITEMS } from '@/lib/constants'

interface StartMenuProps {
  onClose: () => void
}

function StartMenu({ onClose }: StartMenuProps) {
  const { cartCount } = useCart()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.15 }}
      id="start-menu"
      className="fixed bottom-12 left-2 w-64 bg-gray-800 border-2 border-gray-600 shadow-xl rounded-t-lg overflow-hidden flex flex-col z-50"
      aria-label="Start Menu"
    >
      <div className="bg-gradient-to-r from-green-700 to-green-900 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white" />
        <span className="text-white font-bold font-mono">User</span>
      </div>
      <div className="flex-1 py-2">
        {START_MENU_ITEMS.map((item, index) => {
          if (item.type === 'separator') {
            return <div key={index} className="h-px bg-gray-600 my-2" />
          }
          return (
            <MenuLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              badge={item.href === '/cart' ? cartCount : undefined}
              onClick={onClose}
            />
          )
        })}
      </div>
    </motion.div>
  )
}

/**
 * MenuLink
 *
 * Performance optimization:
 * This component is memoized to prevent unnecessary re-renders when the parent
 * StartMenu updates (e.g. when cart count changes). Since most menu items are static,
 * they don't need to re-render.
 */
const MenuLink = memo(function MenuLink({ href, label, icon, badge, onClick }: { href: string; label: string; icon?: string; badge?: number; onClick: () => void }) {
  return (
    <Link 
      href={href} 
      className="block px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-600 focus:outline-none font-mono text-sm flex items-center gap-3 transition-colors group"
      onClick={onClick}
    >
      {icon && <span aria-hidden="true" className="text-lg w-6 text-center">{icon}</span>}
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="bg-bgc-red text-white text-xs font-bold px-2 py-0.5 rounded-full ml-2 group-hover:bg-white group-hover:text-bgc-red transition-colors">
          {badge}
        </span>
      )}
    </Link>
  )
})

export default memo(StartMenu)
