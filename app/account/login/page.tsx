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

    try {
      const data = await customerAccessTokenCreate(email, password)

      if (data?.customerUserErrors?.length > 0) {
        setError(data.customerUserErrors[0].message)
      } else if (data?.customerAccessToken?.accessToken) {
        localStorage.setItem('bgc_customer_token', data.customerAccessToken.accessToken)
        router.push('/account')
      } else {
        setError('Login failed. Please check your credentials.')
      }
    } catch (err) {
      console.error(err)
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
          <label className="block text-sm font-bold mb-2">EMAIL</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-bgc-gray border border-bgc-gray-light p-3 focus:border-bgc-red outline-none text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">PASSWORD</label>
          <input
            type="password"
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
