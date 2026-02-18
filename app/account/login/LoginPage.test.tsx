import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from './page'
import { customerAccessTokenCreate } from '@/lib/shopify'
import { useRouter } from 'next/navigation'

// Mock the modules
jest.mock('@/lib/shopify', () => ({
  customerAccessTokenCreate: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('LoginPage', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
    jest.clearAllMocks()
  })

  const fillForm = (email: string, password: string) => {
    fireEvent.change(screen.getByLabelText('EMAIL'), { target: { value: email } })
    fireEvent.change(screen.getByLabelText('PASSWORD'), { target: { value: password } })
  }

  it('renders login form', () => {
    render(<LoginPage />)
    expect(screen.getByRole('heading', { name: 'LOGIN' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'LOGIN' })).toBeInTheDocument()
    expect(screen.getByLabelText('EMAIL')).toBeInTheDocument()
    expect(screen.getByLabelText('PASSWORD')).toBeInTheDocument()
  })

  it('shows error for invalid email', async () => {
    render(<LoginPage />)
    // 'test@example' passes browser type="email" validation (which allows intranet emails)
    // but fails our stricter regex which requires a TLD
    fillForm('test@example', 'ValidPass1!')
    fireEvent.click(screen.getByRole('button', { name: 'LOGIN' }))

    // Expect validation error
    expect(await screen.findByText('Please enter a valid email address.')).toBeInTheDocument()
    expect(customerAccessTokenCreate).not.toHaveBeenCalled()
  })

  it('shows error for short password', async () => {
    render(<LoginPage />)
    fillForm('valid@example.com', 'short')
    fireEvent.click(screen.getByRole('button', { name: 'LOGIN' }))

    // Expect validation error
    expect(await screen.findByText('Password must be at least 8 characters long.')).toBeInTheDocument()
    expect(customerAccessTokenCreate).not.toHaveBeenCalled()
  })

  it('shows error for excessively long email', async () => {
    render(<LoginPage />)
    const longEmail = 'a'.repeat(255) + '@example.com'
    fillForm(longEmail, 'ValidPass1!')
    fireEvent.click(screen.getByRole('button', { name: 'LOGIN' }))

    // Expect validation error
    expect(await screen.findByText('Email is too long.')).toBeInTheDocument()
    expect(customerAccessTokenCreate).not.toHaveBeenCalled()
  })

  it('shows error for excessively long password', async () => {
    render(<LoginPage />)
    const longPassword = 'a'.repeat(101)
    fillForm('valid@example.com', longPassword)
    fireEvent.click(screen.getByRole('button', { name: 'LOGIN' }))

    // Expect validation error
    expect(await screen.findByText('Password is too long (max 100 characters).')).toBeInTheDocument()
    expect(customerAccessTokenCreate).not.toHaveBeenCalled()
  })

  it('submits form with valid credentials', async () => {
    (customerAccessTokenCreate as jest.Mock).mockResolvedValue({
      customerAccessToken: { accessToken: 'token123' },
    })

    render(<LoginPage />)
    fillForm('valid@example.com', 'ValidPass1!')
    fireEvent.click(screen.getByRole('button', { name: 'LOGIN' }))

    await waitFor(() => {
      expect(customerAccessTokenCreate).toHaveBeenCalledWith('valid@example.com', 'ValidPass1!')
      expect(mockPush).toHaveBeenCalledWith('/account')
    })
  })

  it('shows generic error on failure', async () => {
    (customerAccessTokenCreate as jest.Mock).mockResolvedValue({
      customerUserErrors: [{ message: 'Invalid credentials' }],
    })

    render(<LoginPage />)
    fillForm('valid@example.com', 'ValidPass1!')
    fireEvent.click(screen.getByRole('button', { name: 'LOGIN' }))

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password.')).toBeInTheDocument()
    })
  })
})
