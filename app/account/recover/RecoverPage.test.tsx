import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RecoverPage from './page'
import { customerRecover } from '@/lib/shopify'

// Mock the modules
jest.mock('@/lib/shopify', () => ({
  customerRecover: jest.fn(),
}))

describe('RecoverPage', () => {
  const email = 'test@example.com'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders recover form', () => {
    render(<RecoverPage />)
    expect(screen.getByRole('heading', { name: 'RECOVER PASSWORD' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'SEND RESET LINK' })).toBeInTheDocument()
  })

  it('shows success message even if user does not exist (Anti-Enumeration)', async () => {
    // Mock API returning "User not found" error
    (customerRecover as jest.Mock).mockResolvedValue({
      customerUserErrors: [{ message: 'Unidentified customer' }],
    })

    render(<RecoverPage />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: email } })
    fireEvent.click(screen.getByRole('button', { name: 'SEND RESET LINK' }))

    // Expect SUCCESS message, NOT error message
    await waitFor(() => {
      expect(screen.getByText(/If an account exists/i)).toBeInTheDocument()
      expect(screen.queryByText('Unidentified customer')).not.toBeInTheDocument()
    })
  })

  it('shows success message on valid email', async () => {
    // Mock API returning success
    (customerRecover as jest.Mock).mockResolvedValue({
      customerUserErrors: [],
    })

    render(<RecoverPage />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: email } })
    fireEvent.click(screen.getByRole('button', { name: 'SEND RESET LINK' }))

    await waitFor(() => {
      expect(screen.getByText(/If an account exists/i)).toBeInTheDocument()
    })
  })
})
