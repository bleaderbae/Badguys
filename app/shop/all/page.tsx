'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { getAllLocalProducts, LocalProduct } from '@/lib/local-products'

function ProductDetailModal({ product, onClose }: { product: LocalProduct, onClose: () => void }) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})

  const handleAddToCart = () => {
    alert(`Added ${product.title} to cart!`)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-bgc-gray border border-gray-700 w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="w-full md:w-1/2 relative aspect-square md:aspect-auto bg-black">
           <Image
             src={product.images[0]}
             alt={product.title}
             fill
             className="object-contain p-4"
           />
        </div>

        {/* Details */}
        <div className="w-full md:w-1/2 p-8 flex flex-col bg-bgc-gray">
           <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-white">{product.title}</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
           </div>

           <p className="text-2xl font-mono text-bgc-red mb-6">${product.price}</p>

           <div className="space-y-6 flex-1">
              <p className="text-gray-400 text-sm leading-relaxed">
                 {product.description}
              </p>

              {product.variants.map(variant => (
                 <div key={variant.name}>
                    <label className="block text-xs font-bold uppercase text-gray-500 mb-2">{variant.name}</label>
                    <div className="flex flex-wrap gap-2">
                       {variant.options.map(opt => (
                          <button
                             key={opt}
                             onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.name]: opt }))}
                             className={`
                                px-3 py-1 text-sm border rounded transition-colors
                                ${selectedVariants[variant.name] === opt
                                   ? 'bg-white text-black border-white'
                                   : 'bg-transparent text-gray-400 border-gray-700 hover:border-gray-500'
                                }
                             `}
                          >
                             {opt}
                          </button>
                       ))}
                    </div>
                 </div>
              ))}
           </div>

           <button
              onClick={handleAddToCart}
              className="mt-8 w-full bg-white text-black font-bold py-4 hover:bg-gray-200 transition-colors uppercase tracking-wider"
           >
              Add to Cart
           </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ShopAllPage() {
  const products = getAllLocalProducts()
  const [filter, setFilter] = useState<'all' | 'golf' | 'samurai'>('all')
  const [selectedProduct, setSelectedProduct] = useState<LocalProduct | null>(null)

  const filteredProducts = filter === 'all'
    ? products
    : products.filter(p => p.category === filter)

  return (
    <div className="min-h-screen bg-bgc-black pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-end border-b border-gray-800 pb-8">
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-2">SHOP NETWORK</h1>
          <p className="text-gray-400 font-mono">/root/products/all</p>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mt-8 md:mt-0">
          {(['all', 'golf', 'samurai'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`
                px-4 py-2 text-sm font-bold uppercase tracking-wider border transition-all
                ${filter === f
                  ? 'bg-white text-black border-white'
                  : 'bg-black text-gray-500 border-gray-800 hover:border-gray-600 hover:text-white'
                }
              `}
            >
              {f === 'all' ? 'All Files' : f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <AnimatePresence mode='popLayout'>
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setSelectedProduct(product)}
              className="group cursor-pointer"
            >
              {/* Product Card */}
              <div className="relative aspect-square bg-bgc-gray mb-4 overflow-hidden border border-gray-800 group-hover:border-bgc-red transition-colors">
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                  <p className="text-white font-bold mb-2">View Details</p>
                  <div className="text-xs text-gray-300 font-mono bg-black/50 px-2 py-1 rounded">
                     {product.variants.length} Variants Available
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-bgc-red transition-colors truncate">
                {product.title}
              </h3>
              <div className="flex justify-between items-center mt-1">
                 <p className="text-gray-400 font-mono">${product.price}</p>
                 <span className="text-xs uppercase font-bold text-gray-600 bg-gray-900 px-2 py-1 rounded">
                    {product.category}
                 </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

       {filteredProducts.length === 0 && (
          <div className="text-center py-20 text-gray-500 font-mono">
             No files found in this directory.
          </div>
       )}

       <AnimatePresence>
          {selectedProduct && (
             <ProductDetailModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
             />
          )}
       </AnimatePresence>
    </div>
  )
}
