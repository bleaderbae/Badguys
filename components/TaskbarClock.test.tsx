import { render, screen, act } from '@testing-library/react'
import TaskbarClock from './TaskbarClock'

describe('TaskbarClock', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2023-10-23T10:30:00'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('renders the current time', () => {
    render(<TaskbarClock />)

    act(() => {
      jest.advanceTimersByTime(100)
    })

    const timeElement = screen.getByText(/10:30/i)
    expect(timeElement).toBeInTheDocument()
  })

  it('has accessible attributes and title', () => {
    render(<TaskbarClock />)

    act(() => {
      jest.advanceTimersByTime(100)
    })

    const clockElement = screen.getByRole('timer')
    expect(clockElement).toBeInTheDocument()

    // Check for title attribute (tooltip) with full date
    expect(clockElement).toHaveAttribute('title', 'Monday, October 23, 2023')

    // Check for aria-label with time and date
    expect(clockElement).toHaveAttribute('aria-label', expect.stringContaining('10:30'))
    expect(clockElement).toHaveAttribute('aria-label', expect.stringContaining('Monday, October 23, 2023'))
  })

  it('updates time every second', () => {
    render(<TaskbarClock />)

    act(() => {
      jest.advanceTimersByTime(100)
    })

    expect(screen.getByText(/10:30/i)).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(60000) // Advance 1 minute
    })

    expect(screen.getByText(/10:31/i)).toBeInTheDocument()
  })
})
