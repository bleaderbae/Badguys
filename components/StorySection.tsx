'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function StorySection() {
  return (
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
  )
}
