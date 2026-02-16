import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StartMenu from './StartMenu';
import '@testing-library/jest-dom';

// Mock next/link to behave like a normal anchor tag
jest.mock('next/link', () => {
  const MockLink = ({ children, href, onClick, ...rest }: { children: React.ReactNode; href: string; onClick?: () => void; [key: string]: any }) => {
    return (
      <a href={href} onClick={onClick} {...rest}>
        {children}
      </a>
    );
  };
  MockLink.displayName = 'Link';
  return MockLink;
});

// Mock framer-motion to avoid animation issues
jest.mock('framer-motion', () => {
  const MockMotionDiv = ({ children, ...props }: any) => <div {...props}>{children}</div>;
  MockMotionDiv.displayName = 'motion.div';
  return {
    motion: {
      div: MockMotionDiv,
    },
  };
});

// Mock CartContext
jest.mock('./CartContext', () => ({
  useCart: () => ({
    cartCount: 5
  })
}));

describe('StartMenu Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders correctly', () => {
    render(<StartMenu onClose={mockOnClose} />);

    // Check for user section
    expect(screen.getByText('User')).toBeInTheDocument();

    // Check for menu links
    expect(screen.getByText('My Account')).toBeInTheDocument();
    expect(screen.getByText('Cart')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Golf Drop')).toBeInTheDocument();
    expect(screen.getByText('Samurai Drop')).toBeInTheDocument();
    expect(screen.getByText('Shop Network')).toBeInTheDocument();
    expect(screen.getByText('The Vault')).toBeInTheDocument();
    expect(screen.getByText('About System')).toBeInTheDocument();
    expect(screen.getByText('Contact Admin')).toBeInTheDocument();
  });

  it('renders the cart badge with correct count', () => {
    render(<StartMenu onClose={mockOnClose} />);
    const badge = screen.getByText('5');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass('bg-bgc-red');
  });

  it('calls onClose when a link is clicked', () => {
    render(<StartMenu onClose={mockOnClose} />);

    const accountLink = screen.getByText('My Account');
    fireEvent.click(accountLink);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
