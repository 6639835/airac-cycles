import { useCallback, useState } from 'react'

/**
 * Custom hook for handling async errors in functional components
 * This allows throwing errors that can be caught by ErrorBoundary
 */
export function useAsyncError() {
  const [, setError] = useState()
  
  return useCallback((error: Error) => {
    setError(() => {
      throw error
    })
  }, [])
}

/**
 * Custom hook for safe async operations with error handling
 */
export function useSafeAsync<T>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<T | null>(null)
  const throwError = useAsyncError()

  const execute = useCallback(async (asyncFunction: () => Promise<T>) => {
    try {
      setLoading(true)
      setError(null)
      const result = await asyncFunction()
      setData(result)
      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred')
      setError(error)
      
      // If it's a critical error, throw it to be caught by ErrorBoundary
      if (error.message.includes('Critical') || error.name === 'ChunkLoadError') {
        throwError(error)
      }
      
      throw error
    } finally {
      setLoading(false)
    }
  }, [throwError])

  const reset = useCallback(() => {
    setLoading(false)
    setError(null)
    setData(null)
  }, [])

  return {
    loading,
    error,
    data,
    execute,
    reset
  }
}

/**
 * Hook for handling network errors with retry logic
 */
export function useNetworkError() {
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3
  
  const shouldRetry = useCallback((error: Error) => {
    return (
      retryCount < maxRetries &&
      (error.name === 'NetworkError' || 
       error.message.includes('fetch') ||
       error.message.includes('network'))
    )
  }, [retryCount, maxRetries])

  const retry = useCallback(() => {
    setRetryCount(prev => prev + 1)
  }, [])

  const reset = useCallback(() => {
    setRetryCount(0)
  }, [])

  return {
    shouldRetry,
    retry,
    reset,
    retryCount,
    maxRetries
  }
}
