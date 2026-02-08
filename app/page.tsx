import DesktopIcon from '@/components/DesktopIcon'

export default function Home() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4 md:gap-8 md:p-8 items-start justify-items-center animate-fade-in">
      <DesktopIcon label="My Computer" href="/about" icon="💻" />
      <DesktopIcon label="Shop Network" href="/shop" icon="🌐" />
      <DesktopIcon label="Recycle Bin" href="/cart" icon="🗑️" />
      <DesktopIcon label="BadGuys_OS.exe" href="/product" icon="💿" />
      <DesktopIcon label="Contact_Admin" href="/contact" icon="📧" />
      <DesktopIcon label="System_Logs.txt" href="/about" icon="📄" />
    </div>
  )
}
