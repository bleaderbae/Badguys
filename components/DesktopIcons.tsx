import DesktopIcon from '@/components/DesktopIcon'
import CartDesktopIcon from '@/components/CartDesktopIcon'

export default function DesktopIcons() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 md:gap-8 md:p-8 items-start justify-items-center animate-fade-in">
      <DesktopIcon label="My Computer" href="/about" icon="💻" />
      <DesktopIcon label="Shop_Network.exe" href="/shop/all" icon="🌐" />
      <CartDesktopIcon label="Recycle Bin" href="/cart" />
      <DesktopIcon label="The_Vault.exe" href="/product" icon="⚰️" />
      <DesktopIcon label="Samurai_Drop.exe" href="/shop/samurai" icon="⚔️" />
      <DesktopIcon label="Golf_Drop.exe" href="/shop/golf" icon="⛳" />
      <DesktopIcon label="Contact_Admin.exe" href="/contact" icon="📧" />
      <DesktopIcon label="System_Logs.txt" href="/about" icon="📄" />
    </div>
  )
}
