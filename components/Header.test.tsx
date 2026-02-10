import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';

// Mock next/link to behave like a normal anchor tag
jest.mock('next/link', () => {
  return ({ children, href, ...rest }: { children: React.ReactNode; href: string; [key: string]: any }) => {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  };
});

// Mock framer-motion to avoid animation issues and prop warnings
jest.mock('framer-motion', () => {
  const filterMotionProps = (props: any) => {
    const {
      initial, animate, exit, whileHover, whileTap, transition, variants,
      ...validProps
    } = props;
    return validProps;
  };

  return {
    motion: {
      div: ({ children, ...props }: any) => <div {...filterMotionProps(props)}>{children}</div>,
      button: ({ children, ...props }: any) => <button {...filterMotionProps(props)}>{children}</button>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  };
});

describe('Header Component', () => {
  it('renders the logo correctly', () => {
    render(<Header />);
    const logo = screen.getByText(/BAD GUYS/i);
    const club = screen.getByText(/CLUB/i);
    expect(logo).toBeInTheDocument();
    expect(club).toBeInTheDocument();
  });

  it('renders desktop navigation links', () => {
    render(<Header />);
    const links = ['HOME', 'SHOP', 'ABOUT', 'CONTACT'];

    links.forEach(linkText => {
      const link = screen.getByText(linkText);
      expect(link).toBeInTheDocument();
      expect(link.closest('a')).toHaveAttribute('href', linkText === 'HOME' ? '/' : `/${linkText.toLowerCase()}`);
    });
  });

  it('renders the cart icon with correct count', () => {
    render(<Header />);
    // Check for aria-label
    const cartLink = screen.getByLabelText(/View cart, 0 items/i);
    expect(cartLink).toBeInTheDocument();
    expect(cartLink).toHaveAttribute('href', '/cart');

    // Check for the count badge
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders mobile menu button on mobile view', () => {
    render(<Header />);
    const menuButton = screen.getByLabelText('Open menu');
    expect(menuButton).toBeInTheDocument();
  });

  it('toggles mobile menu when button is clicked', () => {
    render(<Header />);
    const menuButton = screen.getByLabelText('Open menu');

    // Initial state: Mobile menu should not be visible
    expect(screen.queryByText('CART (0)')).not.toBeInTheDocument();

    // Open menu
    fireEvent.click(menuButton);

    // Now mobile menu items should be visible
    expect(screen.getByText('CART (0)')).toBeInTheDocument();

    // Close menu
    const closeButton = screen.getByLabelText('Close menu');
    fireEvent.click(closeButton);

    // Should be closed again
    expect(screen.queryByText('CART (0)')).not.toBeInTheDocument();
  });

  it('closes mobile menu when a link is clicked', () => {
    render(<Header />);
    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);

    const mobileCartLink = screen.getByText('CART (0)');
    fireEvent.click(mobileCartLink);

    // Menu should close
    expect(screen.queryByText('CART (0)')).not.toBeInTheDocument();
  });
});
