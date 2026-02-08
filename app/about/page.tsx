'use client'

import { motion } from 'framer-motion'

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20 pb-24">
      {/* Hero */}
      <section className="bg-gradient-to-br from-bgc-black via-bgc-gray to-bgc-black py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-7xl font-black mb-6">
              <span className="text-white">ABOUT THE </span>
              <span className="text-bgc-red">BAD GUYS</span>
            </h1>
            <p className="text-xl text-gray-400">
              The lifestyle brand for modern guys who just want to hang with the boys
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl font-black mb-6">
            YOU&apos;RE NOT A BAD GUY
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed mb-4">
            You just have interests. Maybe you just love hanging with the boys. Like, really hanging with the boys.
            It&apos;s not a crime. It&apos;s a passion.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed">
            But somewhere along the way, society made you feel guilty about it. Like spending your Saturday
            having intense boy time instead of at brunch makes you a villain. Like wanting to wrestle
            with your homies means you&apos;re neglecting your responsibilities.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-bgc-gray p-8 border-l-4 border-bgc-red"
        >
          <p className="text-xl font-bold mb-4">
            Here&apos;s the truth: You can love the boys AND love your wife.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed">
            You can have deep, meaningful boy time and still be present at home. You can kiss the homies goodnight
            and take your partner to dinner. You can be one of the boys and have a career. These things aren&apos;t mutually exclusive.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl font-black mb-6">
            THE BAD GUYS CLUB
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed mb-4">
            We&apos;re a community of guys who refuse to apologize for their needs while also being
            present for the people who matter. We&apos;re not choosing between hanging with the boys or being a good
            husband. We&apos;re both.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mb-4">
            Bad Guys Club is for the guy who:
          </p>
          <ul className="space-y-2 text-gray-400 mb-4">
            <li className="flex items-start">
              <span className="text-bgc-red mr-2">▸</span>
              <span>Feels guilty about spending money on boy time but does it anyway</span>
            </li>
            <li className="flex items-start">
              <span className="text-bgc-red mr-2">▸</span>
              <span>Wants to be a better partner but also really needs some quality boy time right now</span>
            </li>
            <li className="flex items-start">
              <span className="text-bgc-red mr-2">▸</span>
              <span>Knows Sunday morning coffee is important but so is hanging with the boys</span>
            </li>
            <li className="flex items-start">
              <span className="text-bgc-red mr-2">▸</span>
              <span>Understands balance isn&apos;t 50/50, it&apos;s about making time for the boys</span>
            </li>
          </ul>
          <p className="text-lg text-gray-400 leading-relaxed">
            You&apos;re not a bad guy. You&apos;re just a guy with a lifestyle. Welcome to the club.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center pt-8"
        >
          <h2 className="text-3xl font-black mb-6">
            JOIN THE CLUB
          </h2>
          <p className="text-gray-400 mb-8">
            Wear it proud. You&apos;re a bad guy, and that&apos;s perfectly fine.
          </p>
          <motion.a
            href="/shop"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-bgc-red hover:bg-bgc-red-dark text-white font-bold text-lg rounded-none transition-colors"
          >
            SHOP THE COLLECTION
          </motion.a>
        </motion.div>
      </section>
    </div>
  )
}
