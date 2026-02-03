'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-bgc-black via-bgc-gray to-bgc-black">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl sm:text-8xl lg:text-9xl font-black mb-6 tracking-tighter">
              <span className="bg-gradient-to-r from-white via-bgc-white to-gray-400 bg-clip-text text-transparent">
                BAD GUYS
              </span>
              <br />
              <span className="text-bgc-red">CLUB</span>
            </h1>

            <p className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto mb-4 text-balance">
              For the guy who loves MMA, fast cars, gaming, and tattoos.
            </p>

            <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-12 text-balance">
              (And also spending time with his wife and feeling guilty about all those other things.)
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/shop">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-bgc-red hover:bg-bgc-red-dark text-white font-bold text-lg rounded-none transition-colors w-64"
                >
                  SHOP NOW
                </motion.button>
              </Link>

              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-bgc-white hover:bg-white hover:text-bgc-black text-white font-bold text-lg rounded-none transition-colors w-64"
                >
                  OUR STORY
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-6 h-10 border-2 border-gray-600 rounded-full p-2"
          >
            <div className="w-1 h-3 bg-gray-600 rounded-full mx-auto"></div>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Section */}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: item * 0.1 }}
                whileHover={{ y: -5 }}
                className="group cursor-pointer"
              >
                <div className="aspect-square bg-bgc-gray-light mb-4 flex items-center justify-center overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-bgc-gray-light to-bgc-black flex items-center justify-center">
                    <span className="text-6xl font-black text-gray-800">BGC</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-bgc-red transition-colors">
                  Product Name
                </h3>
                <p className="text-gray-400">$XX.XX</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link href="/shop">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-bgc-red hover:bg-bgc-red-dark text-white font-bold text-lg rounded-none transition-colors"
              >
                VIEW ALL PRODUCTS
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story Teaser */}
      <section className="py-24 bg-bgc-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-5xl font-black mb-8">
              THE BAD GUY LIFESTYLE
            </h2>
            <p className="text-xl text-gray-400 mb-8 text-balance leading-relaxed">
              We get it. You love the adrenaline of a track day, the intensity of a sparring session,
              the focus of a late-night gaming marathon. But you also love Sunday morning coffee with
              your partner and actually want to be present for it.
            </p>
            <p className="text-lg text-gray-500 mb-12 text-balance">
              You're not a villain. You're just a guy with interests. Welcome to the club.
            </p>
            <Link href="/about">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-bgc-red hover:bg-bgc-red text-bgc-red hover:text-white font-bold text-lg rounded-none transition-colors"
              >
                READ MORE
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
