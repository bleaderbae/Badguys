'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { getCardProducts } from '@/lib/shopify'
import { Product } from '@/lib/types'

export default function CardsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const cardProducts = await getCardProducts()
        setProducts(cardProducts)
      } catch (error) {
        console.error('Error fetching card products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-stone-900 font-serif relative overflow-hidden">
      {/* Background Texture/Gradient */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-black via-stone-900 to-black pointer-events-none" />

      {/* Ornate Border (Top) */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-red-900/20 to-transparent pointer-events-none border-b border-red-900/30" />

      <div className="relative z-10 pt-20 pb-24">
        {/* Hero */}
        <section className="py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-6xl sm:text-8xl font-black mb-6 tracking-widest text-red-700 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] font-serif uppercase">
              The Vault
            </h1>
            <div className="h-1 w-32 bg-red-800 mx-auto mb-6 shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
            <p className="text-xl text-stone-400 max-w-2xl mx-auto italic font-serif">
              &quot;What is a man? A miserable little pile of secrets.&quot;
            </p>
          </motion.div>
        </section>

        {/* Products Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse bg-stone-800/50 border border-stone-700 h-96 rounded-sm"></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
              {products.map((product, index) => {
                const image = product.node.images.edges[0]?.node
                const price = parseFloat(product.node.priceRange.minVariantPrice.amount)

                return (
                  <motion.div
                    key={product.node.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, type: "spring" }}
                  >
                    <Link href={`/product/${product.node.handle}`}>
                      <div className="group cursor-pointer relative bg-stone-950 border-4 border-stone-800 hover:border-red-900 transition-colors duration-300 shadow-2xl overflow-hidden">
                        {/* Card Frame Decoration */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow-700 z-20" />
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-yellow-700 z-20" />
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-yellow-700 z-20" />
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-yellow-700 z-20" />

                        {/* Image Container */}
                        <div className="aspect-[3/4] bg-black relative overflow-hidden border-b-4 border-stone-800">
                          {image ? (
                            <Image
                              src={image.url}
                              alt={image.altText || product.node.title}
                              fill
                              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                              className="object-cover group-hover:scale-110 group-hover:sepia-[.3] transition-all duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-800 to-black">
                              <span className="text-4xl font-serif text-stone-600">VOID</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                        </div>

                        {/* Text Content */}
                        <div className="p-4 text-center relative bg-stone-900">
                          <h3 className="text-lg font-bold mb-1 text-stone-200 font-serif tracking-wide group-hover:text-red-500 transition-colors">
                            {product.node.title}
                          </h3>
                          <p className="text-yellow-600 font-mono text-sm border-t border-stone-700 pt-2 mt-2 inline-block px-4">
                            {product.node.handle === 'qa-test-product' ? 'QA ITEM' : 'RARE'} {'//'} LVL {Math.floor(price / 10)}
                          </p>
                          <p className="text-stone-400 font-bold mt-2">
                            ${price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-stone-700 rounded-lg bg-stone-900/50">
              <h2 className="text-3xl font-serif text-stone-500 mb-4">THE VAULT IS EMPTY</h2>
              <p className="text-stone-600 italic">No artifacts found in this timeline.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
