import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ProductClient from './ProductClient';
import { getProduct } from '@/lib/shopify';
import { useCart } from '@/components/CartContext';
import { ProductDetail } from '@/lib/types';

// Mock dependencies
jest.mock('next/navigation', () => ({
  useParams: () => ({ handle: 'test-product' }),
}));

jest.mock('@/lib/shopify', () => ({
  getProduct: jest.fn(),
}));

jest.mock('@/components/CartContext', () => ({
  useCart: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

// Mock framer-motion (simplified)
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const mockProduct: ProductDetail = {
  id: 'gid://shopify/Product/1',
  handle: 'test-product',
  title: 'Test Product',
  description: 'Test Description',
  priceRange: {
    minVariantPrice: { amount: '10.00', currencyCode: 'USD' }
  },
  options: [
    { id: 'opt1', name: 'Size', values: ['S', 'M'] },
  ],
  variants: {
    edges: [
      {
        node: {
          id: 'gid://shopify/ProductVariant/1',
          title: 'S',
          selectedOptions: [
            { name: 'Size', value: 'S' },
          ],
          price: { amount: '10.00', currencyCode: 'USD' },
          availableForSale: true,
          image: { url: 'http://test.com/red.jpg', altText: 'Red Variant' }
        }
      },
      {
        node: {
          id: 'gid://shopify/ProductVariant/2',
          title: 'M',
          selectedOptions: [
            { name: 'Size', value: 'M' },
          ],
          price: { amount: '10.00', currencyCode: 'USD' },
          availableForSale: true,
          image: { url: 'http://test.com/red.jpg', altText: 'Red Variant' }
        }
      }
    ]
  },
  images: {
    edges: [
      { node: { url: 'http://test.com/red.jpg', altText: 'Red Image' } },
      { node: { url: 'http://test.com/blue.jpg', altText: 'Blue Image' } }
    ]
  }
};

describe('ProductClient', () => {
  beforeEach(() => {
    (getProduct as jest.Mock).mockClear();
    (getProduct as jest.Mock).mockResolvedValue(mockProduct);
    (useCart as jest.Mock).mockReturnValue({ addToCart: jest.fn() });
  });

  it('fetches product when not provided as prop', async () => {
    render(<ProductClient />);

    // Wait for product to load
    await waitFor(() => expect(screen.getByText('Test Product')).toBeInTheDocument());

    // Verify it fetched
    expect(getProduct).toHaveBeenCalledWith('test-product');
  });

  it('skips fetch when product is provided as prop', async () => {
    // Pass mockProduct directly as prop
    render(<ProductClient product={mockProduct} />);

    // Should render immediately
    expect(screen.getByText('Test Product')).toBeInTheDocument();

    // Verify getProduct was NOT called
    expect(getProduct).not.toHaveBeenCalled();
  });

  it('renders with accessibility attributes', async () => {
    render(<ProductClient />);

    // Wait for product to load
    await waitFor(() => expect(screen.getByText('Test Product')).toBeInTheDocument());

    // 1. Quantity Controls
    const decreaseBtn = screen.getByText('-');
    const increaseBtn = screen.getByText('+');
    expect(decreaseBtn).toHaveAttribute('aria-label', 'Decrease quantity');
    expect(increaseBtn).toHaveAttribute('aria-label', 'Increase quantity');
    expect(decreaseBtn).toHaveClass('focus-visible:ring-2');
    expect(increaseBtn).toHaveClass('focus-visible:ring-2');

    // 2. Variant Buttons
    const sizeS = screen.getByText('S');
    const sizeM = screen.getByText('M');
    // S is selected by default (first variant)
    expect(sizeS).toHaveAttribute('aria-pressed', 'true');
    expect(sizeM).toHaveAttribute('aria-pressed', 'false');
    expect(sizeS).toHaveClass('focus-visible:ring-2');

    // 3. Image Thumbnails
    const thumbnail1 = screen.getByLabelText('View image 1 of 2');
    const thumbnail2 = screen.getByLabelText('View image 2 of 2');

    expect(thumbnail1).toBeInTheDocument();
    expect(thumbnail1).toHaveClass('focus-visible:ring-2');
    expect(thumbnail2).toBeInTheDocument();
  });
});
