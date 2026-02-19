import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RecoverPage from './page'
import { customerRecover } from '@/lib/shopify'

// Mock the modules
jest.mock('@/lib/shopify', () => ({
  customerRecover: jest.fn(),
}))

describe('RecoverPage', () => {
  it('renders recovery form', () => {
    render(<RecoverPage />)
    expect(screen.getByRole('heading', { name: 'RECOVER PASSWORD' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'SEND RESET LINK' })).toBeInTheDocument()
    // Finding input by role since label association is missing in current code
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('shows success message even if user not found (SECURITY)', async () => {
    (customerRecover as jest.Mock).mockResolvedValue({
      customerUserErrors: [{ message: 'User not found' }],
    })

    render(<RecoverPage />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'test@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'SEND RESET LINK' }))

    await waitFor(() => {
      // SECURITY: Should show success message, NOT the error
      expect(screen.getByText('EMAIL SENT')).toBeInTheDocument()
      expect(screen.queryByText('User not found')).not.toBeInTheDocument()
    })
  })
})
