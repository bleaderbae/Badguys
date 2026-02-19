import { render, screen, waitFor } from '@testing-library/react'
import ProductClient from './ProductClient'
import { getProduct } from '@/lib/shopify'
import { useCart } from '@/components/CartContext'
import { useParams } from 'next/navigation'
import { MOCK_PRODUCT_DETAILS } from '@/lib/mockData'
import userEvent from '@testing-library/user-event'
import React from 'react'

// Mock dependencies
jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { fill, priority, loading, quality, sizes, unoptimized, ...rest } = props
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...rest} />
  },
}))

jest.mock('@/lib/shopify', () => ({
  getProduct: jest.fn(),
}))

jest.mock('@/components/CartContext', () => ({
  useCart: jest.fn(),
}))

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, whileHover, whileTap, initial, animate, transition, exit, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
    button: ({ children, whileHover, whileTap, initial, animate, transition, exit, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('ProductClient', () => {
  const mockProduct = MOCK_PRODUCT_DETAILS['qa-test-product']
  const mockAddToCart = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ handle: 'qa-test-product' });
    (useCart as jest.Mock).mockReturnValue({ addToCart: mockAddToCart });
  })

  it('renders loading state initially', async () => {
    // Mock getProduct to delay execution
    (getProduct as jest.Mock).mockReturnValue(new Promise(() => {}))

    render(<ProductClient />)

    // Check for skeletons or pulse animations classes
    const skeletons = document.getElementsByClassName('animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders product not found state', async () => {
    (getProduct as jest.Mock).mockResolvedValue(null)

    render(<ProductClient />)

    await waitFor(() => {
      expect(screen.getByText('PRODUCT NOT FOUND')).toBeInTheDocument()
    })
  })

  it('renders product details correctly', async () => {
    (getProduct as jest.Mock).mockResolvedValue(mockProduct)

    render(<ProductClient />)

    await waitFor(() => {
      expect(screen.getByText(mockProduct.title)).toBeInTheDocument()
    })

    expect(screen.getByText('$10.00')).toBeInTheDocument()
    expect(screen.getByText(mockProduct.description)).toBeInTheDocument()

    // Verify variant options are rendered
    expect(screen.getByText('Color')).toBeInTheDocument()
    expect(screen.getByText('Red')).toBeInTheDocument()
    expect(screen.getByText('Blue')).toBeInTheDocument()
  })

  it('skips fetch when product is provided as prop', async () => {
    // Pass mockProduct directly as prop
    render(<ProductClient product={mockProduct} />)

    // Should render immediately
    expect(screen.getByText(mockProduct.title)).toBeInTheDocument()

    // Verify getProduct was NOT called
    expect(getProduct).not.toHaveBeenCalled()
  })

  it('updates variant selection and associated image', async () => {
    (getProduct as jest.Mock).mockResolvedValue(mockProduct)
    const user = userEvent.setup()

    render(<ProductClient />)

    await waitFor(() => {
      expect(screen.getByText(mockProduct.title)).toBeInTheDocument()
    })

    // Initial selection should be first variant (Red)
    const redButton = screen.getByRole('button', { name: 'Red' })
    const blueButton = screen.getByRole('button', { name: 'Blue' })

    // Check styling for selected (bgc-red is the class used for selected state)
    expect(redButton).toHaveClass('bg-bgc-red')
    expect(blueButton).not.toHaveClass('bg-bgc-red')

    // Initial image should be Red
    const mainImagesRed = screen.getAllByRole('img').filter(img => !img.closest('button'))
    expect(mainImagesRed[0]).toHaveAttribute('src', expect.stringContaining('QA+Red'))

    // Click Blue
    await user.click(blueButton)

    expect(blueButton).toHaveClass('bg-bgc-red')
    expect(redButton).not.toHaveClass('bg-bgc-red')

    // Image should update to Blue
    const mainImagesBlue = screen.getAllByRole('img').filter(img => !img.closest('button'))
    expect(mainImagesBlue[0]).toHaveAttribute('src', expect.stringContaining('QA+Blue'))
  })

  it('updates main image when thumbnail is clicked', async () => {
    (getProduct as jest.Mock).mockResolvedValue(mockProduct)
    const user = userEvent.setup()

    render(<ProductClient />)

    // Wait for images (both main and thumbnail might have same alt text)
    const images = await screen.findAllByAltText('QA Product Red')
    expect(images.length).toBeGreaterThan(0)

    // Find thumbnails. The thumbnails are buttons containing images.
    const thumbnails = screen.getAllByRole('button').filter(b => b.querySelector('img'))

    expect(thumbnails.length).toBeGreaterThanOrEqual(2)

    // Click second thumbnail (Blue)
    await user.click(thumbnails[1])

    // Verify main image changed to Blue
    await waitFor(() => {
         const mainImages = screen.getAllByRole('img').filter(img => !img.closest('button'))
         // There should be only one main image
         expect(mainImages[0]).toHaveAttribute('src', expect.stringContaining('QA+Blue'))
    })
  })

  it('updates quantity', async () => {
    (getProduct as jest.Mock).mockResolvedValue(mockProduct)
    const user = userEvent.setup()

    render(<ProductClient />)

    await waitFor(() => {
        expect(screen.getByText('1')).toBeInTheDocument()
    })

    const incrementBtn = screen.getByRole('button', { name: 'Increase quantity' })
    const decrementBtn = screen.getByRole('button', { name: 'Decrease quantity' })

    await user.click(incrementBtn)
    expect(screen.getByText('2')).toBeInTheDocument()

    await user.click(decrementBtn)
    expect(screen.getByText('1')).toBeInTheDocument()

    // Min is 1
    await user.click(decrementBtn)
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('adds to cart', async () => {
    (getProduct as jest.Mock).mockResolvedValue(mockProduct)
    const user = userEvent.setup()

    // Mock with delay to test loading state properly
    mockAddToCart.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

    render(<ProductClient />)

    const addToCartBtn = await screen.findByText('ADD TO CART')
    await user.click(addToCartBtn)

    expect(mockAddToCart).toHaveBeenCalledWith('gid://shopify/ProductVariant/qa-red', 1)

    // Check feedback
    expect(screen.getByText('ADDING...')).toBeInTheDocument()
    await waitFor(() => {
        expect(screen.getByText('ADDED TO CART!')).toBeInTheDocument()
    })
  })

  it('renders with accessibility attributes', async () => {
    (getProduct as jest.Mock).mockResolvedValue(mockProduct)
    render(<ProductClient />)

    // Wait for product to load
    await waitFor(() => expect(screen.getByText(mockProduct.title)).toBeInTheDocument())

    // 1. Quantity Controls
    const decreaseBtn = screen.getByLabelText('Decrease quantity')
    const increaseBtn = screen.getByLabelText('Increase quantity')
    expect(decreaseBtn).toBeInTheDocument()
    expect(increaseBtn).toBeInTheDocument()
    expect(decreaseBtn).toHaveClass('focus-visible:ring-2')
    expect(increaseBtn).toHaveClass('focus-visible:ring-2')

    // 2. Variant Buttons
    const sizeRed = screen.getByText('Red')
    const sizeBlue = screen.getByText('Blue')
    // Red is selected by default (first variant)
    expect(sizeRed).toHaveAttribute('aria-pressed', 'true')
    expect(sizeBlue).toHaveAttribute('aria-pressed', 'false')
    expect(sizeRed).toHaveClass('focus-visible:ring-2')

    // 3. Image Thumbnails
    const thumbnail1 = screen.getByLabelText('View image 1 of 2')
    const thumbnail2 = screen.getByLabelText('View image 2 of 2')

    expect(thumbnail1).toBeInTheDocument()
    expect(thumbnail1).toHaveClass('focus-visible:ring-2')
    expect(thumbnail2).toBeInTheDocument()
  })
})
