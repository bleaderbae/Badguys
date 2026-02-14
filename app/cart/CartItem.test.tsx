import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CartItem from './CartItem';
import { LineItem } from '@/lib/types';

// Mock next/image to prevent React DOM warnings by filtering out library-specific props
jest.mock('next/image', () => {
  const MockImage = ({ fill, priority, sizes, unoptimized, ...rest }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...rest} />;
  };
  MockImage.displayName = 'Image';
  return MockImage;
});

const mockItem: LineItem = {
  id: 'line-item-1',
  title: 'Test Product',
  quantity: 2,
  variant: {
    id: 'variant-1',
    title: 'Default Variant',
    price: {
      amount: '19.99',
      currencyCode: 'USD',
    },
    product: {
      handle: 'test-product',
      title: 'Test Product Title',
    },
    image: {
      url: 'https://example.com/image.jpg',
      altText: 'Test Image Alt',
    },
  },
};

describe('CartItem', () => {
  const mockOnRemove = jest.fn();

  beforeEach(() => {
    mockOnRemove.mockClear();
  });

  it('renders product details correctly', () => {
    render(<CartItem item={mockItem} onRemove={mockOnRemove} />);

    // Product Title (should use variant.product.title if available)
    expect(screen.getByText('Test Product Title')).toBeInTheDocument();

    // Variant Title
    expect(screen.getByText('Default Variant')).toBeInTheDocument();

    // Quantity
    expect(screen.getByText(/Quantity: 2/i)).toBeInTheDocument();

    // Price (19.99 * 2 = 39.98)
    expect(screen.getByText('$39.98')).toBeInTheDocument();
  });

  it('renders the REMOVE button and calls onRemove when clicked', () => {
    render(<CartItem item={mockItem} onRemove={mockOnRemove} />);

    const removeButton = screen.getByRole('button', { name: /Remove Test Product Title from cart/i });
    expect(removeButton).toBeInTheDocument();
    expect(removeButton).toHaveTextContent('REMOVE');

    fireEvent.click(removeButton);

    expect(mockOnRemove).toHaveBeenCalledTimes(1);
    expect(mockOnRemove).toHaveBeenCalledWith('line-item-1');
  });

  it('renders the image when provided', () => {
    render(<CartItem item={mockItem} onRemove={mockOnRemove} />);

    const image = screen.getByAltText('Test Image Alt');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
  });

  it('renders fallback "No Image" when image is not provided', () => {
    const itemWithoutImage = {
      ...mockItem,
      variant: {
        ...mockItem.variant!,
        image: undefined,
      },
    };

    render(<CartItem item={itemWithoutImage} onRemove={mockOnRemove} />);

    expect(screen.getByText('No Image')).toBeInTheDocument();
    expect(screen.queryByAltText('Test Image Alt')).not.toBeInTheDocument();
  });

  it('uses item title as fallback for product title', () => {
    const itemWithoutProductTitle = {
        ...mockItem,
        variant: {
            ...mockItem.variant!,
            product: undefined
        }
    };

    render(<CartItem item={itemWithoutProductTitle} onRemove={mockOnRemove} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });
});
