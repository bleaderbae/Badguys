'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { getSamuraiProducts, LocalProduct } from '@/lib/local-products'

function FighterCustomizer({ product, onClose }: { product: LocalProduct, onClose: () => void }) {
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
    const desc = Object.entries(selections).map(([k, v]) => `${k}: ${v}`).join(', ')
    alert(`FIGHTER READY: ${product.title} (${desc}) Added to Cart! (Demo Mode)`)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-0 md:p-8"
    >
       {/* Background Elements */}
       <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-red-900/50 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-red-900/50 to-transparent" />
       </div>

      <div className="w-full h-full max-w-7xl flex flex-col md:flex-row relative">
        <button
           onClick={onClose}
           className="absolute top-4 right-4 z-20 text-red-500 font-black text-2xl hover:text-white hover:scale-110 transition-transform uppercase italic tracking-widest drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]"
        >
           X CLOSE
        </button>

        {/* Left: Fighter Preview (Large) */}
        <div className="flex-1 relative flex items-center justify-center">
            {/* Name Background */}
            <div className="absolute text-[6rem] md:text-[10rem] lg:text-[15rem] font-black text-white/5 italic whitespace-nowrap select-none overflow-hidden rotate-[-10deg]">
               {product.title.split(' ')[0].toUpperCase()}
            </div>

            <motion.div
               initial={{ x: -100, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ type: "spring", stiffness: 100, damping: 20 }}
               className="relative w-full h-full p-8"
            >
               <Image
                 src={product.images[0]}
                 alt={product.title}
                 fill
                 className="object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.2)]"
               />
            </motion.div>
        </div>

        {/* Right: Stats & Customization */}
        <div className="w-full md:w-[400px] bg-black/80 backdrop-blur-md border-l-2 border-red-600 p-8 flex flex-col relative">
           {/* Diagonal slash decoration */}
           <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-red-600 rounded-tr-3xl" />
           <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-red-600 rounded-bl-3xl" />

           <h2 className="text-4xl font-black text-white italic uppercase mb-2 tracking-tighter drop-shadow-[2px_2px_0_#dc2626]">
              {product.title}
           </h2>
           <div className="h-1 w-full bg-gradient-to-r from-red-600 to-transparent mb-8" />

           <div className="space-y-8 flex-1 overflow-y-auto">
              {product.variants.map((variant) => (
                 <div key={variant.name} className="space-y-2 group">
                    <label className="text-red-500 text-sm font-bold uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                       {'///'} {variant.name}
                    </label>
                    <div className="flex items-center justify-between">
                       <button
                          onClick={() => handlePrev(variant.name, selections[variant.name], variant.options)}
                          className="text-gray-500 hover:text-white text-2xl font-black transition-colors"
                       >
                          &lt;
                       </button>
                       <span className="text-2xl font-black text-white uppercase italic tracking-wider">
                          {selections[variant.name] || variant.options[0]}
                       </span>
                       <button
                          onClick={() => handleNext(variant.name, selections[variant.name], variant.options)}
                          className="text-gray-500 hover:text-white text-2xl font-black transition-colors"
                       >
                          &gt;
                       </button>
                    </div>
                    {/* Progress Bar Style Indicator */}
                    <div className="flex gap-1 h-1">
                       {variant.options.map((opt, i) => (
                          <div
                             key={opt}
                             className={`flex-1 transition-colors ${
                                opt === (selections[variant.name] || variant.options[0])
                                   ? 'bg-red-600 shadow-[0_0_10px_#dc2626]'
                                   : 'bg-gray-800'
                             }`}
                          />
                       ))}
                    </div>
                 </div>
              ))}

              <div className="pt-4 border-t border-gray-800">
                  <p className="text-gray-400 text-xs font-mono leading-relaxed opacity-80">
                     {product.description}
                  </p>
              </div>
           </div>

           <div className="mt-8 pt-4">
              <div className="flex justify-between items-baseline mb-4">
                 <span className="text-gray-500 font-mono text-sm">PRICE</span>
                 <span className="text-4xl font-black text-white italic tracking-tighter">${product.price}</span>
              </div>
              <button
                 onClick={handleAddToCart}
                 className="w-full bg-red-600 hover:bg-red-500 text-white font-black text-2xl py-6 uppercase italic tracking-widest transition-all hover:shadow-[0_0_30px_#ef4444] active:scale-95 skew-x-[-10deg]"
              >
                 <span className="inline-block skew-x-[10deg]">SELECT FIGHTER</span>
              </button>
           </div>
        </div>
      </div>
    </motion.div>
  )
}

export default function SamuraiShopPage() {
  const products = getSamuraiProducts()
  const [selectedProduct, setSelectedProduct] = useState<LocalProduct | null>(null)
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-black text-white font-sans p-4 pb-24 md:p-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black -z-10" />

      {/* Header */}
      <header className="flex flex-col items-center mb-16 relative z-10">
         <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)] uppercase skew-x-[-5deg]">
            Samurai Drop
         </h1>
         <div className="w-full max-w-2xl h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent mt-4" />
         <p className="text-red-500 font-mono tracking-[0.5em] text-sm mt-2 uppercase animate-pulse">
            Choose Your Fighter
         </p>
      </header>

      {/* Character Select Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 px-4">
        {products.map((product) => (
          <motion.div
            key={product.id}
            layoutId={product.id}
            onClick={() => setSelectedProduct(product)}
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
            className={`
               relative aspect-[3/4] cursor-pointer overflow-hidden border-4 transition-all duration-200 group
               ${hoveredProduct === product.id ? 'border-red-500 scale-105 z-10 shadow-[0_0_30px_rgba(220,38,38,0.5)]' : 'border-gray-800 grayscale hover:grayscale-0'}
            `}
          >
             {/* Character Portrait */}
             <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black" />
             <Image
               src={product.images[0]}
               alt={product.title}
               fill
               className="object-cover transition-transform duration-500 group-hover:scale-110"
             />

             {/* P1 Cursor Indicator */}
             {hoveredProduct === product.id && (
                <div className="absolute top-4 left-4 bg-red-600 text-white font-black text-xs px-2 py-1 skew-x-[-10deg] animate-bounce shadow-lg border border-white z-20">
                   <span className="inline-block skew-x-[10deg]">P1</span>
                </div>
             )}

             {/* Name Plate */}
             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 pt-12">
                <h3 className={`text-2xl font-black italic uppercase tracking-tighter leading-none transition-colors ${hoveredProduct === product.id ? 'text-white' : 'text-gray-500'}`}>
                   {product.title}
                </h3>
             </div>
          </motion.div>
        ))}

        {/* Empty Slots for effect */}
        {[...Array(Math.max(0, 3 - products.length))].map((_, i) => (
           <div key={`empty-${i}`} className="aspect-[3/4] border-4 border-gray-900 bg-black/50 flex items-center justify-center opacity-30">
              <span className="text-gray-700 font-black text-4xl">?</span>
           </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedProduct && (
          <FighterCustomizer
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
