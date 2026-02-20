
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import DesktopShell from './DesktopShell'
import { usePathname } from 'next/navigation'

// Mock usePathname
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: ({ fill, priority, ...props }: any) => <img {...props} data-fill={fill} data-priority={priority} />,
}))

// Mock child components
jest.mock('./StartMenu', () => {
  const MockStartMenu = () => <div data-testid="start-menu">Start Menu</div>;
  MockStartMenu.displayName = 'StartMenu';
  return MockStartMenu;
});

jest.mock('./DesktopIcons', () => {
  const MockDesktopIcons = () => <div data-testid="desktop-icons">Desktop Icons</div>;
  MockDesktopIcons.displayName = 'DesktopIcons';
  return MockDesktopIcons;
});

jest.mock('./WindowFrame', () => {
  const MockWindowFrame = ({ children, title }: { children: any; title: string }) => <div data-testid="window-frame" title={title}>{children}</div>;
  MockWindowFrame.displayName = 'WindowFrame';
  return MockWindowFrame;
});

jest.mock('./TaskbarClock', () => {
  const MockTaskbarClock = () => <div data-testid="taskbar-clock">12:00 PM</div>;
  MockTaskbarClock.displayName = 'TaskbarClock';
  return MockTaskbarClock;
});

describe('DesktopShell', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/shop/all')
  })

  it('renders the window toggle button with correct title and aria-label', () => {
    render(
      <DesktopShell>
        <div>Content</div>
      </DesktopShell>
    )

    // The window title for /shop/all is 'Shop_Network.exe'
    const windowTitle = 'Shop_Network.exe'

    // Find the button by text content first to verify it exists
    const windowButton = screen.getByText(windowTitle).closest('button')
    expect(windowButton).toBeInTheDocument()

    // Assert that the button has the correct aria-label for "Minimize" state (default)
    expect(windowButton).toHaveAttribute('aria-label', `Minimize ${windowTitle}`)

    // Assert that the button has a title attribute
    expect(windowButton).toHaveAttribute('title', `Minimize ${windowTitle}`)
  })

  it('toggles minimization state and updates aria-label', () => {
    render(
      <DesktopShell>
        <div>Content</div>
      </DesktopShell>
    )

    const windowTitle = 'Shop_Network.exe'
    const windowButton = screen.getByText(windowTitle).closest('button')!

    // Click to minimize
    fireEvent.click(windowButton)

    // Check if the window frame is gone (minimized)
    expect(screen.queryByTestId('window-frame')).not.toBeInTheDocument()

    // Check updated aria-label
    expect(windowButton).toHaveAttribute('aria-label', `Restore ${windowTitle}`)
    expect(windowButton).toHaveAttribute('title', `Restore ${windowTitle}`)

    // Click to restore
    fireEvent.click(windowButton)

    // Check if window frame is back
    expect(screen.getByTestId('window-frame')).toBeInTheDocument()

    // Check aria-label reverted
    expect(windowButton).toHaveAttribute('aria-label', `Minimize ${windowTitle}`)
  })
})
