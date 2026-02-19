import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DesktopShell from './DesktopShell';
import '@testing-library/jest-dom';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/shop'), // Default to a page with a window
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt={props.alt} />,
}));

// Mock child components to isolate DesktopShell logic
jest.mock('./StartMenu', () => ({
  __esModule: true,
  default: () => <div data-testid="start-menu">Start Menu</div>,
}));

jest.mock('./DesktopIcons', () => ({
  __esModule: true,
  default: () => <div data-testid="desktop-icons">Desktop Icons</div>,
}));

jest.mock('./WindowFrame', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="window-frame">{children}</div>,
}));

jest.mock('./TaskbarClock', () => ({
  __esModule: true,
  default: () => <div data-testid="taskbar-clock">Clock</div>,
}));

describe('DesktopShell Accessibility', () => {
  it('renders the taskbar with correct role and label', () => {
    render(<DesktopShell>Content</DesktopShell>);
    // Taskbar container checks
    // We use a flexible matcher because the element might not be implemented yet
    // Wait, this is TDD, so we EXPECT it to fail if not implemented.
    const taskbar = screen.getByRole('navigation', { name: /taskbar/i });
    expect(taskbar).toBeInTheDocument();
  });

  it('renders the Start button with correct label', () => {
    render(<DesktopShell>Content</DesktopShell>);
    const startButton = screen.getByRole('button', { name: /start menu/i });
    expect(startButton).toBeInTheDocument();
  });

  it('renders the Window toggle button with correct label', () => {
    render(<DesktopShell>Content</DesktopShell>);
    // Initial state: Window is open, button should say "Minimize..."
    // Since mock pathname is /shop, title is "Shop_Network.exe"
    const windowButton = screen.getByRole('button', { name: /minimize shop_network\.exe/i });
    expect(windowButton).toBeInTheDocument();

    // Click to minimize
    fireEvent.click(windowButton);

    // Now it should say "Restore..."
    const restoreButton = screen.getByRole('button', { name: /restore shop_network\.exe/i });
    expect(restoreButton).toBeInTheDocument();
  });
});
