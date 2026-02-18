import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RecoverPage from './page'
import { customerRecover } from '@/lib/shopify'

// Mock the modules
jest.mock('@/lib/shopify', () => ({
  customerRecover: jest.fn(),
}))

describe('RecoverPage', () => {
  it('renders recover form', () => {
    render(<RecoverPage />)
    expect(screen.getByRole('heading', { name: 'RECOVER PASSWORD' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'SEND RESET LINK' })).toBeInTheDocument()
  })

  it('shows success message on successful submission', async () => {
    (customerRecover as jest.Mock).mockResolvedValue({})

    render(<RecoverPage />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'valid@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'SEND RESET LINK' }))

    await waitFor(() => {
      expect(screen.getByText(/If an account exists for valid@example.com/)).toBeInTheDocument()
    })
  })

  it('shows success message even if user not found (security requirement)', async () => {
    (customerRecover as jest.Mock).mockResolvedValue({
      customerUserErrors: [{ message: 'Unidentified customer' }],
    })

    render(<RecoverPage />)
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'invalid@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'SEND RESET LINK' }))

    await waitFor(() => {
      // It should NOT show the error
      expect(screen.queryByText('Unidentified customer')).not.toBeInTheDocument()
      // It SHOULD show the success message
      expect(screen.getByText(/If an account exists for invalid@example.com/)).toBeInTheDocument()
    })
  })
})
