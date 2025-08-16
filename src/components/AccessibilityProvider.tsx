import React, { createContext, useContext, useState, useCallback } from 'react'

interface AccessibilityContextType {
  announceToScreenReader: (message: string) => void
  highContrast: boolean
  toggleHighContrast: () => void
  reducedMotion: boolean
  toggleReducedMotion: () => void
  fontSize: 'small' | 'medium' | 'large'
  setFontSize: (size: 'small' | 'medium' | 'large') => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [highContrast, setHighContrast] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('airac-high-contrast') === 'true'
    }
    return false
  })

  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('airac-reduced-motion')
      if (stored) return stored === 'true'
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }
    return false
  })

  const [fontSize, setFontSizeState] = useState<'small' | 'medium' | 'large'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('airac-font-size') as 'small' | 'medium' | 'large'
      return stored || 'medium'
    }
    return 'medium'
  })

  const announceToScreenReader = useCallback((message: string) => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.style.position = 'absolute'
    announcement.style.left = '-10000px'
    announcement.style.width = '1px'
    announcement.style.height = '1px'
    announcement.style.overflow = 'hidden'
    
    document.body.appendChild(announcement)
    announcement.textContent = message
    
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }, [])

  const toggleHighContrast = useCallback(() => {
    const newValue = !highContrast
    setHighContrast(newValue)
    localStorage.setItem('airac-high-contrast', newValue.toString())
    
    // Apply high contrast class to body
    document.body.classList.toggle('high-contrast', newValue)
    
    announceToScreenReader(
      newValue ? 'High contrast mode enabled' : 'High contrast mode disabled'
    )
  }, [highContrast, announceToScreenReader])

  const toggleReducedMotion = useCallback(() => {
    const newValue = !reducedMotion
    setReducedMotion(newValue)
    localStorage.setItem('airac-reduced-motion', newValue.toString())
    
    // Apply reduced motion class to body
    document.body.classList.toggle('reduced-motion', newValue)
    
    announceToScreenReader(
      newValue ? 'Reduced motion enabled' : 'Reduced motion disabled'
    )
  }, [reducedMotion, announceToScreenReader])

  const setFontSize = useCallback((size: 'small' | 'medium' | 'large') => {
    setFontSizeState(size)
    localStorage.setItem('airac-font-size', size)
    
    // Apply font size class to body
    document.body.classList.remove('font-small', 'font-medium', 'font-large')
    document.body.classList.add(`font-${size}`)
    
    announceToScreenReader(`Font size changed to ${size}`)
  }, [announceToScreenReader])

  // Apply initial settings on mount
  React.useEffect(() => {
    document.body.classList.toggle('high-contrast', highContrast)
    document.body.classList.toggle('reduced-motion', reducedMotion)
    document.body.classList.remove('font-small', 'font-medium', 'font-large')
    document.body.classList.add(`font-${fontSize}`)
  }, [])

  const value: AccessibilityContextType = {
    announceToScreenReader,
    highContrast,
    toggleHighContrast,
    reducedMotion,
    toggleReducedMotion,
    fontSize,
    setFontSize,
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}

// Accessibility utility components
export function SkipLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-500 text-white px-4 py-2 rounded-md z-50 transition-all duration-200"
    >
      {children}
    </a>
  )
}

export function LiveRegion({ 
  children, 
  priority = 'polite' 
}: { 
  children: React.ReactNode
  priority?: 'polite' | 'assertive'
}) {
  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {children}
    </div>
  )
}
