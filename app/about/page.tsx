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
              The lifestyle brand for modern guys who do what they love
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
            You just have interests. Maybe you love the rush of a fast car, the technical precision of MMA,
            the strategy of video games, or the artistry of tattoos. These aren&apos;t crimes. They&apos;re passions.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed">
            But somewhere along the way, society made you feel guilty about them. Like spending your Saturday
            at the track instead of at brunch makes you a villain. Like wanting to hit the gym or fire up
            the console means you&apos;re neglecting your responsibilities.
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
            Here&apos;s the truth: You can love cars AND love your wife.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed">
            You can train MMA and still be present at home. You can game with the boys and take your partner
            to dinner. You can have tattoos and a career. These things aren&apos;t mutually exclusive.
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
            We&apos;re a community of guys who refuse to apologize for their interests while also being
            present for the people who matter. We&apos;re not choosing between being a car guy or a good
            husband. We&apos;re both.
          </p>
          <p className="text-lg text-gray-400 leading-relaxed mb-4">
            Bad Guys Club is for the guy who:
          </p>
          <ul className="space-y-2 text-gray-400 mb-4">
            <li className="flex items-start">
              <span className="text-bgc-red mr-2">▸</span>
              <span>Feels guilty about spending money on his hobbies but does it anyway</span>
            </li>
            <li className="flex items-start">
              <span className="text-bgc-red mr-2">▸</span>
              <span>Wants to be a better partner but also wants to finish this race/fight/game</span>
            </li>
            <li className="flex items-start">
              <span className="text-bgc-red mr-2">▸</span>
              <span>Knows Sunday morning coffee is important but so is that track day</span>
            </li>
            <li className="flex items-start">
              <span className="text-bgc-red mr-2">▸</span>
              <span>Understands balance isn&apos;t 50/50, it&apos;s being all-in when you&apos;re there</span>
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
