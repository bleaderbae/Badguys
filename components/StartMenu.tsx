'use client'

import Link from 'next/link'
import { memo } from 'react'
import { useCart } from './CartContext'

interface StartMenuProps {
  isOpen: boolean
  onClose: () => void
}

function StartMenu({ isOpen, onClose }: StartMenuProps) {
  const { cartCount } = useCart()

  if (!isOpen) return null

  return (
    <div
      id="start-menu"
      className="fixed bottom-12 left-2 w-64 bg-gray-800 border-2 border-gray-600 shadow-xl rounded-t-lg overflow-hidden flex flex-col z-50"
    >
      <div className="bg-gradient-to-r from-green-700 to-green-900 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white" />
        <span className="text-white font-bold font-mono">User</span>
      </div>
      <div className="flex-1 py-2">
        <MenuLink href="/profile" label="My Account" icon="👤" onClick={onClose} />
        <MenuLink href="/cart" label="Cart" icon="🛒" badge={cartCount} onClick={onClose} />
        <MenuLink href="/settings" label="Settings" icon="⚙️" onClick={onClose} />
        <div className="h-px bg-gray-600 my-2" />
        <MenuLink href="/shop/golf" label="Golf Drop" icon="⛳" onClick={onClose} />
        <MenuLink href="/shop/samurai" label="Samurai Drop" icon="⚔️" onClick={onClose} />
        <MenuLink href="/shop/all" label="Shop Network" icon="🌐" onClick={onClose} />
        <MenuLink href="/product" label="The Vault" icon="⚰️" onClick={onClose} />
        <div className="h-px bg-gray-600 my-2" />
        <MenuLink href="/about" label="About System" icon="💻" onClick={onClose} />
        <MenuLink href="/contact" label="Contact Admin" icon="📧" onClick={onClose} />
        <div className="h-px bg-gray-600 my-2" />
      </div>
    </div>
  )
}

function MenuLink({ href, label, icon, badge, onClick }: { href: string; label: string; icon?: string; badge?: number; onClick: () => void }) {
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
}

export default memo(StartMenu)
