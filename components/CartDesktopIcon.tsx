'use client'

import DesktopIcon from './DesktopIcon'
import { useCart } from './CartContext'
import { TrashIcon, FullTrashIcon } from './Icons'

interface CartDesktopIconProps {
  label?: string
  href?: string
}

export default function CartDesktopIcon({ label = "Recycle Bin", href = "/cart" }: CartDesktopIconProps) {
  const { cartCount } = useCart()

  // Use the SVG icons instead of emojis
  const icon = cartCount > 0 ? (
    <FullTrashIcon className="w-8 h-8 text-white" />
  ) : (
    <TrashIcon className="w-8 h-8 text-white" />
  )

  const displayLabel = cartCount > 0 ? `${label} (${cartCount})` : label
  const badge = cartCount > 0 ? cartCount : undefined

  return (
    <DesktopIcon
      label={displayLabel}
      href={href}
      icon={icon}
      badge={badge}
    />
  )
}
