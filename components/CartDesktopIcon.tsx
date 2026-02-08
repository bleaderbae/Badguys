'use client'

import DesktopIcon from './DesktopIcon'
import { useCart } from './CartContext'

interface CartDesktopIconProps {
  label?: string
  href?: string
}

export default function CartDesktopIcon({ label = "Recycle Bin", href = "/cart" }: CartDesktopIconProps) {
  const { cartCount } = useCart()

  const icon = cartCount > 0 ? "🗑️" : "🗑️" // Could switch icon if needed, e.g. full trash can
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
