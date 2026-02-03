'use client'

import { motion } from 'framer-motion'

export default function ContactPage() {
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
              <span className="text-white">GET IN </span>
              <span className="text-bgc-red">TOUCH</span>
            </h1>
            <p className="text-xl text-gray-400">
              Questions? Feedback? Just want to talk cars?
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div>
            <label htmlFor="name" className="block font-bold mb-2">
              NAME
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-3 bg-bgc-gray-light border-2 border-bgc-gray-light focus:border-bgc-red outline-none transition-colors text-white"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-bold mb-2">
              EMAIL
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-3 bg-bgc-gray-light border-2 border-bgc-gray-light focus:border-bgc-red outline-none transition-colors text-white"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block font-bold mb-2">
              SUBJECT
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              className="w-full px-4 py-3 bg-bgc-gray-light border-2 border-bgc-gray-light focus:border-bgc-red outline-none transition-colors text-white"
              placeholder="What's this about?"
            />
          </div>

          <div>
            <label htmlFor="message" className="block font-bold mb-2">
              MESSAGE
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              className="w-full px-4 py-3 bg-bgc-gray-light border-2 border-bgc-gray-light focus:border-bgc-red outline-none transition-colors text-white resize-none"
              placeholder="Tell us what's on your mind..."
            ></textarea>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-4 bg-bgc-red hover:bg-bgc-red-dark text-white font-bold text-lg transition-colors"
          >
            SEND MESSAGE
          </motion.button>

          <p className="text-sm text-gray-500 text-center">
            We'll get back to you within 24-48 hours
          </p>
        </motion.form>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="font-bold mb-2">EMAIL</h3>
            <p className="text-gray-400">support@bgc.gg</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="font-bold mb-2">SOCIAL</h3>
            <p className="text-gray-400">@badguysclub</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="font-bold mb-2">RESPONSE TIME</h3>
            <p className="text-gray-400">24-48 hours</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
