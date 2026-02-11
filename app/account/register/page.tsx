'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { customerCreate } from '@/lib/shopify'

export default function RegisterPage() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const cleanFirstName = firstName.trim()
    const cleanLastName = lastName.trim()
    const cleanEmail = email.trim()

    // 1. Input Length Limits
    if (cleanFirstName.length > 50 || cleanLastName.length > 50) {
      setError('First and Last names must be 50 characters or less.')
      setLoading(false)
      return
    }
    if (cleanEmail.length > 254) {
      setError('Email is too long.')
      setLoading(false)
      return
    }
    if (password.length > 100) {
      setError('Password is too long (max 100 characters).')
      setLoading(false)
      return
    }

    // 2. Email Validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(cleanEmail)) {
      setError('Please enter a valid email address.')
      setLoading(false)
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.')
      setLoading(false)
      return
    }
    if (!/[A-Z]/.test(password)) {
      setError('Password must contain at least one uppercase letter.')
      setLoading(false)
      return
    }
    if (!/[0-9]/.test(password)) {
      setError('Password must contain at least one number.')
      setLoading(false)
      return
    }
    if (!/[!@#$%^&*]/.test(password)) {
      setError('Password must contain at least one special character (!@#$%^&*).')
      setLoading(false)
      return
    }

    try {
      const data = await customerCreate(cleanEmail, password, cleanFirstName, cleanLastName)

      if (data?.customerUserErrors?.length > 0) {
        setError(data.customerUserErrors[0].message)
      } else if (data?.customer?.id) {
        // Successful registration
        router.push('/account/login?registered=true')
      } else {
        setError('Registration failed.')
      }
    } catch (err) {
        console.error(err)
        setError('An error occurred.')
    } finally {
        setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-12 px-4 max-w-md mx-auto">
      <h1 className="text-4xl font-black mb-8 text-center">REGISTER</h1>

      <form onSubmit={handleRegister} className="space-y-6">
        {error && (
          <div className="bg-red-900/50 border border-red-500 p-4 text-red-200 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
            <div>
            <label htmlFor="firstName" className="block text-sm font-bold mb-2">FIRST NAME</label>
            <input
                id="firstName"
                type="text"
                value={firstName}
                maxLength={50}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-bgc-gray border border-bgc-gray-light p-3 focus:border-bgc-red outline-none text-white"
                required
            />
            </div>

            <div>
            <label htmlFor="lastName" className="block text-sm font-bold mb-2">LAST NAME</label>
            <input
                id="lastName"
                type="text"
                value={lastName}
                maxLength={50}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-bgc-gray border border-bgc-gray-light p-3 focus:border-bgc-red outline-none text-white"
                required
            />
            </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-bold mb-2">EMAIL</label>
          <input
            id="email"
            type="email"
            value={email}
            maxLength={254}
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
            value={password}
            maxLength={100}
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
          {loading ? 'REGISTERING...' : 'REGISTER'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-400">
        <p>
          Already have an account?{' '}
          <Link href="/account/login" className="text-bgc-red hover:text-white font-bold">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
