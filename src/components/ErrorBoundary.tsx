import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home, ChevronDown } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  showDetails: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    }
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // In production, you might want to log this to an error reporting service
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      // Send to error tracking service
      this.logErrorToService(error, errorInfo)
    }
  }

  private logErrorToService(error: Error, errorInfo: ErrorInfo) {
    // Placeholder for error logging service integration
    // Example: Sentry, LogRocket, etc.
    console.log('Would send to error service:', { error, errorInfo })
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  private toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }))
  }

  override render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-neutral-50 dark:bg-dark-200 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full">
            <div className="bg-white dark:bg-dark-100 rounded-xl shadow-medium dark:shadow-dark-medium p-8 border border-neutral-100 dark:border-dark-accent">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-500 dark:text-red-400" />
                </div>
                
                <h1 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
                  Something went wrong
                </h1>
                
                <p className="text-neutral-600 dark:text-neutral-300 mb-6">
                  We encountered an unexpected error. This has been logged and we'll look into it.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <button
                  onClick={this.handleReload}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Reload Page
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="w-full bg-neutral-100 hover:bg-neutral-200 dark:bg-dark-accent dark:hover:bg-dark-accent/70 text-neutral-700 dark:text-neutral-300 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Go to Home
                </button>
              </div>

              {process.env['NODE_ENV'] === 'development' && this.state.error && (
                <div className="border-t border-neutral-200 dark:border-dark-accent pt-6">
                  <button
                    onClick={this.toggleDetails}
                    className="flex items-center justify-between w-full text-left text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    <span>Error Details (Development)</span>
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform ${
                        this.state.showDetails ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {this.state.showDetails && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-2">
                          Error Message:
                        </h3>
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                          <code className="text-sm text-red-700 dark:text-red-300 break-words">
                            {this.state.error.message}
                          </code>
                        </div>
                      </div>
                      
                      {this.state.error.stack && (
                        <div>
                          <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-2">
                            Stack Trace:
                          </h3>
                          <div className="bg-neutral-50 dark:bg-dark-accent border border-neutral-200 dark:border-dark-accent rounded-lg p-3 max-h-64 overflow-auto">
                            <pre className="text-xs text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                              {this.state.error.stack}
                            </pre>
                          </div>
                        </div>
                      )}
                      
                      {this.state.errorInfo?.componentStack && (
                        <div>
                          <h3 className="text-sm font-medium text-neutral-900 dark:text-white mb-2">
                            Component Stack:
                          </h3>
                          <div className="bg-neutral-50 dark:bg-dark-accent border border-neutral-200 dark:border-dark-accent rounded-lg p-3 max-h-64 overflow-auto">
                            <pre className="text-xs text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">
                              {this.state.errorInfo.componentStack}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Higher-order component for easy wrapping
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}

// Hook for functional components to handle errors
export function useErrorHandler() {
  const handleError = React.useCallback((error: Error, errorInfo?: string) => {
    console.error('Error caught by useErrorHandler:', error)
    
    // In production, send to error tracking service
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      // Send to error tracking service
      console.log('Would send to error service:', { error, errorInfo })
    }
  }, [])

  return handleError
}
