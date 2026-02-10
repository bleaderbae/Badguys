'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useCart } from '@/components/CartContext'
import CartEmptyState from './CartEmptyState'
import CartItem from './CartItem'
import CartSummary from './CartSummary'

export default function CartPage() {
  const { cartLines, cartCount, checkoutUrl, isLoading, removeFromCart, isInitializing } = useCart()

  if (isInitializing) {
      return (
        <div className="min-h-screen pt-20 pb-24">
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                 {/* Simple loading skeleton */}
                 <div className="animate-pulse space-y-8">
                    <div className="h-12 bg-bgc-gray w-1/3 mx-auto rounded"></div>
                    <div className="bg-bgc-gray p-8 h-96 rounded"></div>
                 </div>
            </section>
        </div>
      )
  }

  if (cartCount === 0 && !isLoading) {
    return <CartEmptyState />
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
              {cartLines.map((item) => (
                <CartItem key={item.id} item={item} onRemove={removeFromCart} />
              ))}
            </div>

            <CartSummary cartLines={cartLines} checkoutUrl={checkoutUrl} />
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
