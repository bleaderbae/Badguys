import { render, screen, fireEvent } from '@testing-library/react';
import DesktopShell from './DesktopShell';
import { usePathname } from 'next/navigation';

// Mock child components
jest.mock('./StartMenu', () => {
  const MockStartMenu = ({ onClose }: { onClose: () => void }) => (
    <div data-testid="start-menu">
      <button onClick={onClose} data-testid="close-start-menu">Close Menu</button>
    </div>
  );
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
      <button onClick={onMinimize} data-testid="minimize-window-btn">Minimize</button>
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

// Mock framer-motion AnimatePresence
jest.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: any) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  }
}));

describe('DesktopShell Interactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('toggles Start Menu on button click', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    render(<DesktopShell><div>Content</div></DesktopShell>);

    const startButton = screen.getByText('Start');

    // Initially closed
    expect(screen.queryByTestId('start-menu')).not.toBeInTheDocument();
    expect(startButton.closest('button')).toHaveAttribute('aria-expanded', 'false');

    // Click to open
    fireEvent.click(startButton);
    expect(screen.getByTestId('start-menu')).toBeInTheDocument();
    expect(startButton.closest('button')).toHaveAttribute('aria-expanded', 'true');

    // Click to close
    fireEvent.click(startButton);
    expect(screen.queryByTestId('start-menu')).not.toBeInTheDocument();
    expect(startButton.closest('button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes Start Menu when clicking outside', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    render(<DesktopShell><div>Content</div></DesktopShell>);

    const startButton = screen.getByText('Start');
    fireEvent.click(startButton);
    expect(screen.getByTestId('start-menu')).toBeInTheDocument();

    // Click outside (e.g., on the desktop background/icons)
    fireEvent.mouseDown(document.body);
    expect(screen.queryByTestId('start-menu')).not.toBeInTheDocument();
  });

  it('closes Start Menu on Escape key', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    render(<DesktopShell><div>Content</div></DesktopShell>);

    const startButton = screen.getByText('Start');
    fireEvent.click(startButton);
    expect(screen.getByTestId('start-menu')).toBeInTheDocument();

    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByTestId('start-menu')).not.toBeInTheDocument();
  });

  it('handles window minimization and restoration', () => {
    (usePathname as jest.Mock).mockReturnValue('/shop'); // Non-home page to show window
    render(<DesktopShell><div>Window Content</div></DesktopShell>);

    // Window should be visible initially
    expect(screen.getByTestId('window-frame')).toBeInTheDocument();

    // Minimize via WindowFrame button (internal minimize button)
    const minimizeBtn = screen.getByTestId('minimize-window-btn');
    fireEvent.click(minimizeBtn);

    // Window should be hidden
    expect(screen.queryByTestId('window-frame')).not.toBeInTheDocument();

    // Taskbar button should show 'Restore ...'
    // The window title for /shop is 'Shop_Network.exe'
    const taskbarBtn = screen.getByRole('button', { name: /Restore Shop_Network.exe/i });
    expect(taskbarBtn).toBeInTheDocument();

    // Restore via taskbar button
    fireEvent.click(taskbarBtn);
    expect(screen.getByTestId('window-frame')).toBeInTheDocument();
  });

    it('handles window toggle via taskbar button', () => {
    (usePathname as jest.Mock).mockReturnValue('/shop');
    render(<DesktopShell><div>Window Content</div></DesktopShell>);

    const taskbarBtn = screen.getByRole('button', { name: /Minimize Shop_Network.exe/i });

    // Toggle Minimize
    fireEvent.click(taskbarBtn);
    expect(screen.queryByTestId('window-frame')).not.toBeInTheDocument();

    // Toggle Restore
    fireEvent.click(taskbarBtn);
    expect(screen.getByTestId('window-frame')).toBeInTheDocument();
  });
});
