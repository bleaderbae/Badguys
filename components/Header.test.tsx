import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Header from './Header';

// Mock next/link to behave like a normal anchor tag
jest.mock('next/link', () => {
  const MockLink = ({ children, href, ...rest }: { children: React.ReactNode; href: string; [key: string]: any }) => {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  };
  MockLink.displayName = 'Link';
  return MockLink;
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

  const MockMotionDiv = ({ children, ...props }: any) => <div {...filterMotionProps(props)}>{children}</div>;
  MockMotionDiv.displayName = 'motion.div';

  const MockMotionButton = ({ children, ...props }: any) => <button {...filterMotionProps(props)}>{children}</button>;
  MockMotionButton.displayName = 'motion.button';

  const MockAnimatePresence = ({ children }: any) => <>{children}</>;
  MockAnimatePresence.displayName = 'AnimatePresence';

  return {
    motion: {
      div: MockMotionDiv,
      button: MockMotionButton,
    },
    AnimatePresence: MockAnimatePresence,
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
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    // Open menu
    fireEvent.click(menuButton);

    // Now mobile menu items should be visible
    expect(screen.getByText('CART (0)')).toBeInTheDocument();

    // Check updated aria attributes
    const closeButton = screen.getByLabelText('Close menu');
    expect(closeButton).toHaveAttribute('aria-expanded', 'true');

    // Close menu
    fireEvent.click(closeButton);

    // Should be closed again
    expect(screen.queryByText('CART (0)')).not.toBeInTheDocument();
    const menuButtonAgain = screen.getByLabelText('Open menu');
    expect(menuButtonAgain).toHaveAttribute('aria-expanded', 'false');
  });

  it('renders all navigation links in mobile menu', () => {
    render(<Header />);
    const menuButton = screen.getByLabelText('Open menu');
    fireEvent.click(menuButton);

    const links = ['HOME', 'SHOP', 'ABOUT', 'CONTACT'];

    links.forEach(linkText => {
      // Should find 2 elements: one desktop (hidden), one mobile (visible)
      const foundLinks = screen.getAllByText(linkText);
      expect(foundLinks).toHaveLength(2);
    });

    // Check specific mobile cart link
    expect(screen.getByText('CART (0)')).toBeInTheDocument();
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
