import type { Metadata } from 'next'
import { Inter, VT323 } from 'next/font/google'
import { headers } from 'next/headers'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'
import { CartProvider } from '@/components/CartContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const vt323 = VT323({ weight: '400', subsets: ['latin'], variable: '--font-vt323' })

export const metadata: Metadata = {
  title: 'Bad Guys Club | BGC_OS',
  description: '1v1 me - kisses only',
  keywords: ['clothing', 'lifestyle', 'mma', 'streetwear', 'bad guys club'],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const nonce = (await headers()).get('x-nonce') || undefined

  return (
    <html lang="en" className={`${inter.variable} ${vt323.variable}`}>
      <body className="min-h-screen bg-black text-green-500" nonce={nonce}>
        <CartProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </CartProvider>
      </body>
    </html>
  )
}
