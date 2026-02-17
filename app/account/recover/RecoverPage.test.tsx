import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RecoverPage from './page'
import { customerRecover } from '@/lib/shopify'

// Mock the modules
jest.mock('@/lib/shopify', () => ({
  customerRecover: jest.fn(),
}))

describe('RecoverPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const fillForm = (email: string) => {
    // The label is "EMAIL", input type is email
    // Based on page.tsx: <label ...>EMAIL</label>
    // However, getByLabelText might be case sensitive or need exact match.
    // In LoginPage.test.tsx it was screen.getByLabelText('EMAIL').
    // Let's check page.tsx again.
    // <label ...>EMAIL</label>
    // <input ... />
    // This assumes the label is associated with input. In page.tsx:
    // <label className="block text-sm font-bold mb-2">EMAIL</label>
    // <input ... />
    // Wait, the label does NOT have htmlFor and input does NOT have id in RecoverPage!
    // app/account/recover/page.tsx:
    // <label className="...">EMAIL</label>
    // <input type="email" ... />
    // Without htmlFor/id nesting, getByLabelText won't work.
    // I should use getByRole('textbox') or placeholder? No placeholder.
    // I'll rely on the input type or just modify page.tsx to add htmlFor/id if needed,
    // or use getByRole('textbox') if there's only one.
  }

  // Actually, I'll modify page.tsx to include htmlFor and id for accessibility anyway.
  // Wait, I should stick to the plan.
  // Plan was to create test. I can make the test robust by using other queries.
  // There is only one input on RecoverPage.

  it('renders recover form', () => {
    render(<RecoverPage />)
    expect(screen.getByRole('heading', { name: 'RECOVER PASSWORD' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'SEND RESET LINK' })).toBeInTheDocument()
    // Find input by type
    // input type="email" has implicit role "textbox"
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('submits form and shows success on API success', async () => {
    (customerRecover as jest.Mock).mockResolvedValue({}) // Success, no errors

    render(<RecoverPage />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'valid@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'SEND RESET LINK' }))

    await waitFor(() => {
      expect(customerRecover).toHaveBeenCalledWith('valid@example.com')
      expect(screen.getByRole('heading', { name: 'EMAIL SENT' })).toBeInTheDocument()
    })
  })

  it('submits form and shows success even on API "user not found" error', async () => {
    // This is the SECURITY check
    (customerRecover as jest.Mock).mockResolvedValue({
      customerUserErrors: [{ message: 'User not found' }],
    })

    render(<RecoverPage />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'unknown@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'SEND RESET LINK' }))

    await waitFor(() => {
      expect(customerRecover).toHaveBeenCalledWith('unknown@example.com')
      // Should still see success message
      expect(screen.getByRole('heading', { name: 'EMAIL SENT' })).toBeInTheDocument()
    })
  })

  it('shows generic error on network failure', async () => {
    (customerRecover as jest.Mock).mockRejectedValue(new Error('Network error'))

    render(<RecoverPage />)
    const input = screen.getByRole('textbox')
    fireEvent.change(input, { target: { value: 'valid@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'SEND RESET LINK' }))

    await waitFor(() => {
      expect(screen.getByText('An error occurred.')).toBeInTheDocument()
    })
  })
})
