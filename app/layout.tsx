import type { Metadata } from 'next'
import { Inter, VT323 } from 'next/font/google'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'
import { CartProvider } from '@/components/CartContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const vt323 = VT323({ weight: '400', subsets: ['latin'], variable: '--font-vt323' })

export const metadata: Metadata = {
  title: 'Bad Guys Club | BGC_OS',
  description: 'Lifestyle brand for guys who love MMA, fast cars, gaming, and their wives.',
  keywords: ['clothing', 'lifestyle', 'mma', 'streetwear', 'bad guys club'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${vt323.variable}`}>
      <body className="min-h-screen bg-black text-green-500">
        <CartProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </CartProvider>
      </body>
    </html>
  )
}
