'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { customerAccessTokenCreate } from '@/lib/shopify'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const cleanEmail = email.trim()

    // Validation
    if (cleanEmail.length > 254) {
      setError('Email is too long.')
      setLoading(false)
      return
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address.')
      setLoading(false)
      return
    }

    if (password.length > 100) {
      setError('Password is too long (max 100 characters).')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      setLoading(false)
      return
    }

    try {
      const data = await customerAccessTokenCreate(cleanEmail, password)

      if (data?.customerUserErrors?.length > 0) {
        console.error('Login error:', data.customerUserErrors)
        setError('Invalid email or password.')
      } else if (data?.customerAccessToken?.accessToken) {
        localStorage.setItem('bgc_customer_token', data.customerAccessToken.accessToken)
        router.push('/account')
      } else {
        setError('Invalid email or password.')
      }
    } catch (err) {
      console.error(err instanceof Error ? err.message : err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 max-w-md mx-auto">
      <h1 className="text-4xl font-black mb-8 text-center">LOGIN</h1>

      <form onSubmit={handleLogin} className="space-y-6">
        {error && (
          <div className="bg-red-900/50 border border-red-500 p-4 text-red-200 text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-bold mb-2">EMAIL</label>
          <input
            id="email"
            type="email"
            maxLength={254}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-bgc-gray border border-bgc-gray-light p-3 focus:border-bgc-red outline-none text-white"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-bold mb-2">PASSWORD</label>
          <input
            id="password"
            type="password"
            maxLength={100}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-bgc-gray border border-bgc-gray-light p-3 focus:border-bgc-red outline-none text-white"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-bgc-red hover:bg-red-700 text-white font-bold py-3 transition-colors disabled:opacity-50"
        >
          {loading ? 'LOGGING IN...' : 'LOGIN'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-400">
        <Link href="/account/recover" className="underline hover:text-white block mb-2">
          Forgot Password?
        </Link>
        <p>
          Don&apos;t have an account?{' '}
          <Link href="/account/register" className="text-bgc-red hover:text-white font-bold">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
