
import { motion } from 'framer-motion'
import { Loader2, Plane } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'aviation' | 'dots'
  text?: string
  className?: string
  fullScreen?: boolean
}

export function LoadingSpinner({ 
  size = 'md', 
  variant = 'default', 
  text, 
  className = '',
  fullScreen = false
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white/80 dark:bg-dark-200/80 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex items-center justify-center'

  const renderSpinner = () => {
    switch (variant) {
      case 'aviation':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className={`${sizeClasses[size]} text-primary-500 dark:text-primary-400`}
          >
            <Plane className="w-full h-full" />
          </motion.div>
        )

      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-2 h-2 bg-primary-500 dark:bg-primary-400 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.5, 1] 
                }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.2 
                }}
              />
            ))}
          </div>
        )

      default:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={`${sizeClasses[size]} text-primary-500 dark:text-primary-400`}
          >
            <Loader2 className="w-full h-full" />
          </motion.div>
        )
    }
  }

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center space-y-3">
        {renderSpinner()}
        
        {text && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`${textSizeClasses[size]} text-neutral-600 dark:text-neutral-300 font-medium`}
          >
            {text}
          </motion.p>
        )}
      </div>
    </div>
  )
}

// Specialized loading components for different use cases
export function PageLoader({ text = "Loading AIRAC data..." }: { text?: string }) {
  return (
    <LoadingSpinner
      size="xl"
      variant="aviation"
      text={text}
      fullScreen
    />
  )
}

export function ComponentLoader({ text }: { text?: string }) {
  return (
    <div className="py-12">
      <LoadingSpinner
        size="lg"
        variant="default"
        {...(text && { text })}
      />
    </div>
  )
}

export function ButtonLoader({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  return (
    <LoadingSpinner
      size={size}
      variant="default"
      className="mr-2"
    />
  )
}
