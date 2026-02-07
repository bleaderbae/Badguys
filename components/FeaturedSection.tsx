'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/types'
import Button from './Button'

interface FeaturedSectionProps {
  products: Product[]
}

export default function FeaturedSection({ products }: FeaturedSectionProps) {
  return (
    <section className="py-24 bg-bgc-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-6xl font-black mb-4">LATEST DROPS</h2>
          <p className="text-gray-400 text-lg">Gear for the modern bad guy</p>
        </motion.div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.slice(0, 3).map((product, index) => {
              const image = product.node.images.edges[0]?.node
              const price = parseFloat(product.node.priceRange.minVariantPrice.amount)

              return (
                <motion.div
                  key={product.node.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Link href={`/product/${product.node.handle}`}>
                    <div className="group cursor-pointer">
                      <div className="aspect-square bg-bgc-gray-light mb-4 flex items-center justify-center overflow-hidden relative">
                        {image ? (
                          <Image
                            src={image.url}
                            alt={image.altText || product.node.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-bgc-gray-light to-bgc-black flex items-center justify-center">
                            <span className="text-6xl font-black text-gray-800">BGC</span>
                          </div>
                        )}
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-bgc-red transition-colors">
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
          <div className="text-center py-12 bg-bgc-gray-light rounded-lg">
            <p className="text-gray-400 mb-4">No products available at the moment.</p>
            <p className="text-sm text-gray-500">
              (Or maybe we just haven't connected the store yet. Check the README.)
            </p>
          </div>
        )}

        <div className="text-center mt-16">
          <Button href="/shop">
            VIEW ALL PRODUCTS
          </Button>
        </div>
      </div>
    </section>
  )
}
