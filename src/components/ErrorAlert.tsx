import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, RefreshCw, WifiOff, AlertCircle } from 'lucide-react'

interface ErrorAlertProps {
  error: Error | null
  onDismiss?: () => void
  onRetry?: () => void
  retryable?: boolean
  className?: string
}

export function ErrorAlert({ 
  error, 
  onDismiss, 
  onRetry, 
  retryable = false,
  className = '' 
}: ErrorAlertProps) {
  if (!error) return null

  const isNetworkError = error.name === 'NetworkError' || 
                        error.message.includes('fetch') ||
                        error.message.includes('network')

  const isChunkError = error.name === 'ChunkLoadError' ||
                      error.message.includes('Loading chunk') ||
                      error.message.includes('Loading CSS chunk')

  const getErrorIcon = () => {
    if (isNetworkError) return WifiOff
    if (isChunkError) return RefreshCw
    return AlertTriangle
  }

  const getErrorTitle = () => {
    if (isNetworkError) return 'Connection Error'
    if (isChunkError) return 'Loading Error'
    return 'Error'
  }

  const getErrorMessage = () => {
    if (isNetworkError) {
      return 'Unable to connect to the server. Please check your internet connection.'
    }
    if (isChunkError) {
      return 'Failed to load application resources. Please refresh the page.'
    }
    return error.message || 'An unexpected error occurred'
  }

  const ErrorIcon = getErrorIcon()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-start">
          <ErrorIcon className="w-5 h-5 text-red-500 dark:text-red-400 mt-0.5 flex-shrink-0" />
          
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              {getErrorTitle()}
            </h3>
            
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {getErrorMessage()}
            </p>
            
            {(retryable || onRetry) && (
              <div className="mt-3">
                <button
                  onClick={onRetry}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-800 dark:text-red-200 bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors"
                >
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Try Again
                </button>
              </div>
            )}
          </div>
          
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="ml-3 text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// Toast-style error notification
export function ErrorToast({ 
  error, 
  onDismiss, 
  duration = 5000 
}: { 
  error: Error | null
  onDismiss?: () => void
  duration?: number
}) {
  React.useEffect(() => {
    if (error && duration > 0) {
      const timer = setTimeout(() => {
        onDismiss?.()
      }, duration)
      
      return () => clearTimeout(timer)
    }
    return undefined
  }, [error, duration, onDismiss])

  if (!error) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed top-4 right-4 z-50 max-w-sm w-full"
    >
      <div className="bg-white dark:bg-dark-100 border border-red-200 dark:border-red-800 rounded-lg shadow-lg dark:shadow-dark-medium p-4">
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0 mt-0.5" />
          
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              Error
            </p>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
              {error.message}
            </p>
          </div>
          
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="ml-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
