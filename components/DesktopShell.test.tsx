/* eslint-disable @next/next/no-img-element */
import { render, screen, fireEvent } from '@testing-library/react';
import DesktopShell from './DesktopShell';
import { usePathname } from 'next/navigation';

// Mock child components
jest.mock('./StartMenu', () => {
  const MockStartMenu = () => <div data-testid="start-menu">Start Menu</div>;
  MockStartMenu.displayName = 'MockStartMenu';
  return MockStartMenu;
});
jest.mock('./DesktopIcons', () => {
  const MockDesktopIcons = () => <div data-testid="desktop-icons">Desktop Icons</div>;
  MockDesktopIcons.displayName = 'MockDesktopIcons';
  return MockDesktopIcons;
});
jest.mock('./WindowFrame', () => {
  const MockWindowFrame = ({ children, title, onMinimize }: any) => (
    <div data-testid="window-frame">
      <h1>{title}</h1>
      <button onClick={onMinimize} data-testid="minimize-btn">Minimize</button>
      {children}
    </div>
  );
  MockWindowFrame.displayName = 'MockWindowFrame';
  return MockWindowFrame;
});
jest.mock('./TaskbarClock', () => {
  const MockTaskbarClock = () => <div data-testid="taskbar-clock">Clock</div>;
  MockTaskbarClock.displayName = 'MockTaskbarClock';
  return MockTaskbarClock;
});

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ fill, priority, alt, ...props }: any) => <img alt={alt || ''} {...props} />,
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('DesktopShell', () => {
  it('renders window toggle button with accessible attributes and updates on toggle', () => {
    (usePathname as jest.Mock).mockReturnValue('/shop'); // Simulate a non-home page

    render(
      <DesktopShell>
        <div>Content</div>
      </DesktopShell>
    );

    // Find the window toggle button in the taskbar by its accessible name
    // Since we added aria-label, the accessible name is now the label value
    const toggleButton = screen.getByRole('button', { name: 'Minimize Shop_Network.exe' });

    expect(toggleButton).toBeInTheDocument();

    // Expect initial accessible attributes (Window is OPEN)
    expect(toggleButton).toHaveAttribute('aria-label', 'Minimize Shop_Network.exe');
    expect(toggleButton).toHaveAttribute('title', 'Minimize Shop_Network.exe');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'true');

    // Toggle window (Minimize)
    fireEvent.click(toggleButton);

    // Expect updated accessible attributes (Window is MINIMIZED)
    expect(toggleButton).toHaveAttribute('aria-label', 'Restore Shop_Network.exe');
    expect(toggleButton).toHaveAttribute('title', 'Restore Shop_Network.exe');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false');

    // Toggle window back (Restore)
    fireEvent.click(toggleButton);

    // Expect attributes to return to initial state
    expect(toggleButton).toHaveAttribute('aria-label', 'Minimize Shop_Network.exe');
    expect(toggleButton).toHaveAttribute('title', 'Minimize Shop_Network.exe');
    expect(toggleButton).toHaveAttribute('aria-pressed', 'true');
  });
});
