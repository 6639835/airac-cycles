import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ErrorBoundary } from '../ErrorBoundary'

// Component that throws an error for testing
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error message')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )

    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('should render error UI when child component throws', () => {
    // Suppress console.error for this test
    vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText(/We encountered an unexpected error/)).toBeInTheDocument()
  })

  it('should render custom fallback when provided', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    const customFallback = <div>Custom error fallback</div>

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText('Custom error fallback')).toBeInTheDocument()
  })

  it('should have reload and go home buttons', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByRole('button', { name: /reload page/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /go to home/i })).toBeInTheDocument()
  })

  it('should show error details in development', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Mock development environment
    const originalEnv = process.env['NODE_ENV']
    process.env['NODE_ENV'] = 'development'

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    expect(screen.getByText(/Error Details \(Development\)/)).toBeInTheDocument()

    // Restore environment
    process.env['NODE_ENV'] = originalEnv
  })

  it('should toggle error details when clicked', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Mock development environment
    const originalEnv = process.env['NODE_ENV']
    process.env['NODE_ENV'] = 'development'

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )

    const detailsButton = screen.getByText(/Error Details \(Development\)/)
    
    // Details should be hidden initially
    expect(screen.queryByText('Test error message')).not.toBeInTheDocument()

    // Click to show details
    await userEvent.click(detailsButton)
    expect(screen.getByText('Test error message')).toBeInTheDocument()

    // Restore environment
    process.env['NODE_ENV'] = originalEnv
  })
})
