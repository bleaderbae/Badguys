'use client'

import { motion } from 'framer-motion'
import { LineItem } from '@/lib/types'

interface CartSummaryProps {
  cartLines: LineItem[]
  checkoutUrl: string | null
}

export default function CartSummary({ cartLines, checkoutUrl }: CartSummaryProps) {
  const total = cartLines.reduce((acc, item) => acc + (parseFloat(item.variant?.price.amount || '0') * item.quantity), 0)

  return (
    <div className="mt-8 pt-8 border-t border-gray-600">
        <div className="flex justify-between items-center mb-8">
        <span className="text-xl font-bold">TOTAL</span>
        <span className="text-2xl font-black text-bgc-red">
            ${total.toFixed(2)}
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
  )
}
