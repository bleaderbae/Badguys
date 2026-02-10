import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RegisterPage from './page'
import { customerCreate } from '@/lib/shopify'
import { useRouter } from 'next/navigation'

// Mock the modules
jest.mock('@/lib/shopify', () => ({
  customerCreate: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('RegisterPage', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
    jest.clearAllMocks()
  })

  const fillForm = (password: string) => {
    fireEvent.change(screen.getByLabelText('FIRST NAME'), { target: { value: 'John' } })
    fireEvent.change(screen.getByLabelText('LAST NAME'), { target: { value: 'Doe' } })
    fireEvent.change(screen.getByLabelText('EMAIL'), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText('PASSWORD'), { target: { value: password } })
  }

  it('renders registration form', () => {
    render(<RegisterPage />)
    expect(screen.getByRole('heading', { name: 'REGISTER' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'REGISTER' })).toBeInTheDocument()
    expect(screen.getByLabelText('EMAIL')).toBeInTheDocument()
    expect(screen.getByLabelText('PASSWORD')).toBeInTheDocument()
  })

  it('shows error for short password', async () => {
    render(<RegisterPage />)
    fillForm('short')
    fireEvent.click(screen.getByRole('button', { name: 'REGISTER' }))

    expect(await screen.findByText('Password must be at least 8 characters long.')).toBeInTheDocument()
    expect(customerCreate).not.toHaveBeenCalled()
  })

  it('shows error for missing uppercase', async () => {
    render(<RegisterPage />)
    fillForm('password123!')
    fireEvent.click(screen.getByRole('button', { name: 'REGISTER' }))

    expect(await screen.findByText('Password must contain at least one uppercase letter.')).toBeInTheDocument()
    expect(customerCreate).not.toHaveBeenCalled()
  })

  it('shows error for missing number', async () => {
    render(<RegisterPage />)
    fillForm('Password!')
    fireEvent.click(screen.getByRole('button', { name: 'REGISTER' }))

    expect(await screen.findByText('Password must contain at least one number.')).toBeInTheDocument()
    expect(customerCreate).not.toHaveBeenCalled()
  })

  it('shows error for missing special character', async () => {
    render(<RegisterPage />)
    fillForm('Password123')
    fireEvent.click(screen.getByRole('button', { name: 'REGISTER' }))

    expect(await screen.findByText('Password must contain at least one special character (!@#$%^&*).')).toBeInTheDocument()
    expect(customerCreate).not.toHaveBeenCalled()
  })

  it('submits form with valid password', async () => {
    (customerCreate as jest.Mock).mockResolvedValue({
      customer: { id: '123' },
    })

    render(<RegisterPage />)
    fillForm('Password123!')
    fireEvent.click(screen.getByRole('button', { name: 'REGISTER' }))

    await waitFor(() => {
      expect(customerCreate).toHaveBeenCalledWith('john@example.com', 'Password123!', 'John', 'Doe')
      expect(mockPush).toHaveBeenCalledWith('/account/login?registered=true')
    })
  })
})
