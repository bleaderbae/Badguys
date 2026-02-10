'use client'

import { motion } from 'framer-motion'
import Button from '@/components/Button'

export default function CartEmptyState() {
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

            <div className="flex justify-center">
              <Button href="/shop">
                START SHOPPING
              </Button>
            </div>
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
