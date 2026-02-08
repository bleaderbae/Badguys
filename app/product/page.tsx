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
    <div className="min-h-screen pt-20 pb-24">
      {/* Hero */}
      <section className="bg-gradient-to-br from-bgc-black via-bgc-gray to-bgc-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-7xl font-black mb-6">
              <span className="text-white">THE </span>
              <span className="text-bgc-red">VAULT</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Rare cards and collectibles for the discerning gentleman.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-bgc-gray-light mb-4"></div>
                <div className="h-6 bg-bgc-gray-light mb-2 w-3/4"></div>
                <div className="h-4 bg-bgc-gray-light w-1/4"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => {
              const image = product.node.images.edges[0]?.node
              const price = parseFloat(product.node.priceRange.minVariantPrice.amount)

              return (
                <motion.div
                  key={product.node.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/product/${product.node.handle}`}>
                    <div className="group cursor-pointer">
                      <div className="aspect-square bg-bgc-gray-light mb-4 overflow-hidden relative">
                        {image ? (
                          <Image
                            src={image.url}
                            alt={image.altText || product.node.title}
                            fill
                            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-bgc-gray-light to-bgc-black">
                            <span className="text-6xl font-black text-gray-800">TCG</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-lg font-bold mb-2 group-hover:text-bgc-red transition-colors">
                        {product.node.title}
                      </h3>
                      <p className="text-gray-400">${price.toFixed(2)}</p>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-3xl font-black mb-4">NO CARDS FOUND</h2>
            <p className="text-gray-400">The vault is currently empty.</p>
          </div>
        )}
      </section>
    </div>
  )
}
