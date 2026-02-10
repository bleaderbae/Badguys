import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ProductClient from './ProductClient';
import { getProduct } from '@/lib/shopify';
import { useCart } from '@/components/CartContext';

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

const mockProduct = {
  id: 'gid://shopify/Product/1',
  title: 'Test Product',
  description: 'Test Description',
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

describe('ProductClient Accessibility', () => {
  beforeEach(() => {
    (getProduct as jest.Mock).mockResolvedValue(mockProduct);
    (useCart as jest.Mock).mockReturnValue({ addToCart: jest.fn() });
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
    // The thumbnails are buttons that contain images.
    // We expect 2 thumbnails because mockProduct has 2 images.
    // Note: The main image is NOT a button, only the thumbnails list below it.
    // But verify the thumbnails exist first.
    // The implementation maps images to buttons:
    // {images.map((image, index) => ( <button ...><Image ... /></button> ))}

    // We can select them by class or structure, but better by what we expect to add: aria-label.
    // Since they don't have aria-label yet, we might need to find them another way to assert they *don't* have it (or just assert expectation failure).

    // For this test, we are asserting PRESENCE. So we expect this to fail.
    const thumbnail1 = screen.getByLabelText('View image 1 of 2');
    const thumbnail2 = screen.getByLabelText('View image 2 of 2');

    expect(thumbnail1).toBeInTheDocument();
    expect(thumbnail1).toHaveClass('focus-visible:ring-2');
    expect(thumbnail2).toBeInTheDocument();
  });
});
