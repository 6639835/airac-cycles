import { useContext } from 'react'
import { AccessibilityContext, type AccessibilityContextType } from '@/components/AccessibilityProvider'

export function useAccessibility(): AccessibilityContextType {
  const context = useContext(AccessibilityContext)
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider')
  }
  return context
}
