'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useCart } from '@/components/CartContext'

export default function CartPage() {
  const { cartLines, cartCount, checkoutUrl, isLoading } = useCart()

  if (cartCount === 0 && !isLoading) {
    return (
      <div className="min-h-screen pt-20 pb-24">
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-7xl font-black mb-6">
              <span className="text-white">YOUR </span>
              <span className="text-bgc-red">CART</span>
            </h1>

            <div className="bg-bgc-gray p-12 mb-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-24 h-24 mx-auto mb-6 text-gray-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>

              <h2 className="text-2xl font-black mb-4">CART IS EMPTY</h2>
              <p className="text-gray-400 mb-8">
                When you add products to your cart, they&apos;ll appear here.
              </p>

              <Link href="/shop">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-bgc-red hover:bg-bgc-red-dark text-white font-bold text-lg rounded-none transition-colors"
                >
                  START SHOPPING
                </motion.button>
              </Link>
            </div>
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                {/* ... existing features ... */}
            </div>
          </motion.div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-24">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl sm:text-7xl font-black mb-6 text-center">
            <span className="text-white">YOUR </span>
            <span className="text-bgc-red">CART</span>
          </h1>

          <div className="bg-bgc-gray p-8 mb-8">
            <div className="space-y-8">
              {cartLines.map((item: any) => (
                <div key={item.id} className="flex gap-4 items-start border-b border-gray-700 pb-6 last:border-0 last:pb-0">
                  <div className="relative w-24 h-24 bg-gray-800 flex-shrink-0">
                    {item.variant?.image && (
                      <Image
                        src={item.variant.image.url}
                        alt={item.variant.image.altText || item.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">{item.variant?.product?.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{item.variant?.title}</p>
                    <div className="flex justify-between items-center">
                       <p className="font-mono text-bgc-red font-bold">
                         Quantity: {item.quantity}
                       </p>
                       <p className="text-lg font-bold">
                         ${(parseFloat(item.variant?.price.amount || '0') * item.quantity).toFixed(2)}
                       </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-600">
               <div className="flex justify-between items-center mb-8">
                  <span className="text-xl font-bold">TOTAL</span>
                  <span className="text-2xl font-black text-bgc-red">
                    ${cartLines.reduce((acc, item) => acc + (parseFloat(item.variant?.price.amount || '0') * item.quantity), 0).toFixed(2)}
                  </span>
               </div>

               {checkoutUrl ? (
                 <a href={checkoutUrl} className="block w-full">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-bgc-red hover:bg-bgc-red-dark text-white font-bold text-lg transition-colors flex items-center justify-center gap-2"
                    >
                      PROCEED TO CHECKOUT
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </motion.button>
                 </a>
               ) : (
                 <div className="text-center text-red-500 font-bold">
                   Error creating checkout. Please try adding items again.
                 </div>
               )}
            </div>
          </div>

          <div className="text-center">
            <Link href="/shop" className="text-gray-400 hover:text-white underline decoration-bgc-red decoration-2 underline-offset-4 font-bold">
              CONTINUE SHOPPING
            </Link>
          </div>

        </motion.div>
      </section>
    </div>
  )
}
