'use client'

import { useState } from 'react'
import Link from 'next/link'
import { customerRecover } from '@/lib/shopify'

export default function RecoverPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const data = await customerRecover(email)

      if (data?.customerUserErrors?.length > 0) {
        setError(data.customerUserErrors[0].message)
      } else {
        setSuccess(true)
      }
    } catch (err) {
      console.error(err)
      setError('An error occurred.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen pt-32 pb-12 px-4 max-w-md mx-auto text-center">
        <h1 className="text-4xl font-black mb-8">EMAIL SENT</h1>
        <p className="text-gray-400 mb-8">
          If an account exists for {email}, you will receive an email with instructions to reset your password.
        </p>
        <Link href="/account/login" className="bg-bgc-red hover:bg-red-700 text-white font-bold py-3 px-8 transition-colors">
          RETURN TO LOGIN
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 max-w-md mx-auto">
      <h1 className="text-4xl font-black mb-8 text-center">RECOVER PASSWORD</h1>

      <form onSubmit={handleRecover} className="space-y-6">
        {error && (
          <div className="bg-red-900/50 border border-red-500 p-4 text-red-200 text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-bold mb-2">EMAIL</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-bgc-gray border border-bgc-gray-light p-3 focus:border-bgc-red outline-none text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-bgc-red hover:bg-red-700 text-white font-bold py-3 transition-colors disabled:opacity-50"
        >
          {loading ? 'SENDING...' : 'SEND RESET LINK'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-400">
        <Link href="/account/login" className="text-bgc-red hover:text-white font-bold">
          Cancel
        </Link>
      </div>
    </div>
  )
}
