'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { getGolfProducts, LocalProduct } from '@/lib/local-products'

function CharacterCreator({ product, onClose }: { product: LocalProduct, onClose: () => void }) {
  const [selections, setSelections] = useState<Record<string, string>>({})

  useEffect(() => {
    const initial: Record<string, string> = {}
    product.variants.forEach(v => initial[v.name] = v.options[0])
    setSelections(initial)
  }, [product])

  const handleNext = (variantName: string, current: string | undefined, options: string[]) => {
     if (!current) current = options[0]
     const idx = options.indexOf(current)
     const nextIdx = (idx + 1) % options.length
     setSelections(prev => ({ ...prev, [variantName]: options[nextIdx] }))
  }

  const handlePrev = (variantName: string, current: string | undefined, options: string[]) => {
     if (!current) current = options[0]
     const idx = options.indexOf(current)
     const prevIdx = (idx - 1 + options.length) % options.length
     setSelections(prev => ({ ...prev, [variantName]: options[prevIdx] }))
  }

  const handleAddToCart = () => {
    // Mock Add to Cart
    const desc = Object.entries(selections).map(([k, v]) => `${k}: ${v}`).join(', ')
    alert(`Added ${product.title} (${desc}) to Cart! (Demo Mode)`)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-6xl h-[90vh] md:h-[80vh] bg-green-900 border-4 border-yellow-400 flex flex-col md:flex-row rounded-lg overflow-hidden relative shadow-[0_0_50px_rgba(0,255,0,0.3)]">
        <button
           onClick={onClose}
           className="absolute top-4 right-4 z-20 bg-red-600 text-white font-bold px-4 py-2 border-2 border-white hover:bg-red-700 uppercase tracking-widest shadow-lg"
        >
           Exit
        </button>

        {/* Left: Preview */}
        <div className="h-64 md:h-auto md:flex-1 shrink-0 relative bg-gradient-to-b from-sky-400 to-green-600 flex items-center justify-center overflow-hidden">
           {/* Retro grid floor */}
           <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.2)_100%),repeating-linear-gradient(90deg,transparent_0,transparent_49px,rgba(255,255,255,0.1)_50px),repeating-linear-gradient(0deg,transparent_0,transparent_49px,rgba(255,255,255,0.1)_50px)] [perspective:1000px] [transform:rotateX(60deg)] origin-bottom" />

           <div className="relative w-full h-full p-8 md:p-16 flex items-center justify-center">
             <Image
               src={product.images[0]}
               alt={product.title}
               fill
               className="object-contain drop-shadow-2xl"
             />
           </div>

           <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-green-900/90 to-transparent">
              <h2 className="text-2xl md:text-5xl font-black text-white italic drop-shadow-[4px_4px_0_rgba(0,0,0,0.5)] text-center md:text-left">
                 {product.title}
              </h2>
           </div>
        </div>

        {/* Right: Controls */}
        <div className="w-full md:w-96 flex-1 md:flex-none bg-gray-900 flex flex-col border-l-4 border-yellow-400 shadow-2xl overflow-hidden">
           <div className="bg-green-800 p-4 border-b border-green-700">
             <h3 className="text-2xl font-black text-yellow-400 italic tracking-tighter uppercase text-center">
                PLAYER SETUP
             </h3>
           </div>

           <div className="p-6 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
              {product.variants.map((variant) => (
                 <div key={variant.name} className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <label className="text-green-400 text-sm font-bold uppercase tracking-widest">{variant.name}</label>
                      <span className="text-xs text-gray-500 font-mono">[{variant.options.indexOf(selections[variant.name] || variant.options[0]) + 1}/{variant.options.length}]</span>
                    </div>

                    <div className="flex items-center bg-black border-2 border-green-700 h-12 relative group">
                       <button
                          onClick={() => handlePrev(variant.name, selections[variant.name], variant.options)}
                          className="h-full px-3 text-yellow-400 hover:bg-green-800 hover:text-white transition-colors border-r border-green-800"
                       >
                          ◀
                       </button>
                       <div className="flex-1 text-center font-bold text-white uppercase tracking-wider truncate px-2">
                          {selections[variant.name] || variant.options[0]}
                       </div>
                       <button
                          onClick={() => handleNext(variant.name, selections[variant.name], variant.options)}
                          className="h-full px-3 text-yellow-400 hover:bg-green-800 hover:text-white transition-colors border-l border-green-800"
                       >
                          ▶
                       </button>
                    </div>
                 </div>
              ))}

              <div className="space-y-2 pt-4 border-t border-gray-800">
                 <label className="text-green-400 text-sm font-bold uppercase tracking-widest">Profile</label>
                 <div className="bg-black/50 p-3 border border-green-800/50 rounded text-gray-300 text-xs leading-relaxed font-mono">
                    {product.description}
                 </div>
              </div>
           </div>

           <div className="p-6 bg-gray-900 border-t border-green-800 mt-auto">
              <div className="flex justify-between items-end mb-4 font-mono">
                 <span className="text-gray-400 text-sm uppercase">Cost</span>
                 <span className="text-3xl font-bold text-white">${product.price}</span>
              </div>
              <button
                 onClick={handleAddToCart}
                 className="w-full bg-yellow-400 text-black font-black text-xl py-4 hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-wider shadow-[0_4px_0_rgb(180,130,0)] hover:shadow-[0_2px_0_rgb(180,130,0)] translate-y-0 hover:translate-y-[2px]"
              >
                 Create Player
              </button>
           </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function GolfShopPage() {
  const products = getGolfProducts()
  const [selectedProduct, setSelectedProduct] = useState<LocalProduct | null>(null)

  return (
    <div className="min-h-screen bg-green-950 text-white font-sans p-4 pb-24 md:p-8 relative">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-12 border-b-4 border-yellow-400 pb-6">
         <div className="text-center md:text-left mb-4 md:mb-0">
           <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">
              PRO SHOP 2K25
           </h1>
           <p className="text-green-400 font-mono tracking-widest text-sm mt-2">BAD GUYS CLUB OFFICIAL TOUR</p>
         </div>
         <div className="bg-black/50 px-6 py-3 rounded-full border border-green-800 backdrop-blur-sm">
            <p className="text-sm font-mono text-green-200">
               <span className="text-gray-500 mr-2">CREDITS:</span>
               <span className="text-yellow-400">∞</span>
            </p>
         </div>
      </header>

      {/* Main Grid: Select Golfer */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-black text-white italic mb-8 uppercase tracking-wider flex items-center gap-4">
           <span className="w-8 h-8 bg-yellow-400 text-black flex items-center justify-center rounded-full text-sm">1</span>
           Select Gear
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {products.map((product) => (
            <motion.div
              key={product.id}
              layoutId={product.id}
              onClick={() => setSelectedProduct(product)}
              className="group relative bg-green-900 border-4 border-green-800 hover:border-yellow-400 transition-all duration-300 cursor-pointer overflow-hidden shadow-xl hover:shadow-[0_0_30px_rgba(250,204,21,0.3)] hover:-translate-y-2"
              whileHover={{ scale: 1.02 }}
            >
              <div className="aspect-[4/5] relative bg-gradient-to-b from-sky-300 to-green-600">
                 {/* Shine effect */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 z-10" />

                 <Image
                   src={product.images[0]}
                   alt={product.title}
                   fill
                   className="object-cover p-4 group-hover:scale-110 transition-transform duration-500"
                 />

                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                 <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <h3 className="text-2xl font-black text-yellow-400 italic leading-none mb-1 drop-shadow-md">
                       {product.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                       <span className="bg-green-800 text-white px-2 py-1 text-xs font-bold uppercase tracking-wider rounded border border-green-600">
                          {product.category}
                       </span>
                       <span className="text-xl font-bold text-white drop-shadow-md">
                          ${product.price}
                       </span>
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <CharacterCreator
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
