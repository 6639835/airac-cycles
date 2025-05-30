import { format as dateFnsFormat } from 'date-fns'
import type { AiracCycle } from '@/types/airac'

// Local Storage Utilities
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error(`Error reading from localStorage for key ${key}:`, error)
      return defaultValue
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing to localStorage for key ${key}:`, error)
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing from localStorage for key ${key}:`, error)
    }
  },

  clear: (): void => {
    try {
      localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }
}

// Theme Management
export const theme = {
  get: (): 'light' | 'dark' | 'system' => {
    return storage.get('theme', 'system')
  },

  set: (theme: 'light' | 'dark' | 'system'): void => {
    storage.set('theme', theme)
    document.documentElement.classList.toggle('dark', 
      theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    )
  },

  toggle: (): 'light' | 'dark' => {
    const current = theme.get()
    const next = current === 'dark' ? 'light' : 'dark'
    theme.set(next)
    return next
  }
}

// User Preferences
export interface UserPreferences {
  viewMode: 'grid' | 'list'
  itemsPerPage: number
  bookmarkedCycles: string[]
  recentlyViewed: string[]
  notifications: boolean
  autoRefresh: boolean
}

export const preferences = {
  get: (): UserPreferences => {
    return storage.get('userPreferences', {
      viewMode: 'grid',
      itemsPerPage: 12,
      bookmarkedCycles: [],
      recentlyViewed: [],
      notifications: true,
      autoRefresh: false
    })
  },

  set: (prefs: Partial<UserPreferences>): void => {
    const current = preferences.get()
    storage.set('userPreferences', { ...current, ...prefs })
  },

  reset: (): void => {
    storage.remove('userPreferences')
  }
}

// Bookmarks Management
export const bookmarks = {
  get: (): string[] => {
    return storage.get('airac-bookmarks', [])
  },

  add: (cycleId: string): void => {
    const current = bookmarks.get()
    if (!current.includes(cycleId)) {
      storage.set('airac-bookmarks', [...current, cycleId])
    }
  },

  remove: (cycleId: string): void => {
    const current = bookmarks.get()
    storage.set('airac-bookmarks', current.filter(id => id !== cycleId))
  },

  toggle: (cycleId: string): boolean => {
    const current = bookmarks.get()
    if (current.includes(cycleId)) {
      bookmarks.remove(cycleId)
      return false
    } else {
      bookmarks.add(cycleId)
      return true
    }
  },

  clear: (): void => {
    storage.set('airac-bookmarks', [])
  }
}

// Recently Viewed Management
export const recentlyViewed = {
  get: (): string[] => {
    return storage.get('recently-viewed', [])
  },

  add: (cycleId: string): void => {
    const current = recentlyViewed.get()
    const filtered = current.filter(id => id !== cycleId)
    const updated = [cycleId, ...filtered].slice(0, 10) // Keep only last 10
    storage.set('recently-viewed', updated)
  },

  clear: (): void => {
    storage.set('recently-viewed', [])
  }
}

// Data Export Utilities
export const exportUtils = {
  // Generate CSV content from data
  generateCSV: (data: any[], headers: string[]): string => {
    const csvHeaders = headers.join(',')
    const csvRows = data.map(row => 
      headers.map(header => {
        const value = row[header] || ''
        // Escape commas and quotes in CSV
        return typeof value === 'string' && value.includes(',') 
          ? `"${value.replace(/"/g, '""')}"` 
          : value
      }).join(',')
    )
    return [csvHeaders, ...csvRows].join('\n')
  },

  // Generate iCal content for cycles
  generateICAL: (cycles: AiracCycle[], title?: string): string => {
    const header = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AIRAC Explorer//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:${title || 'AIRAC Cycles'}
X-WR-TIMEZONE:UTC
X-WR-CALDESC:AIRAC cycle dates and information`

    const events = cycles.map(cycle => {
      const startDate = dateFnsFormat(cycle.startDate, 'yyyyMMdd')
      const endDate = dateFnsFormat(cycle.endDate, 'yyyyMMdd')
      
      return `BEGIN:VEVENT
UID:airac-${cycle.cycle}@airac-explorer.com
DTSTART;VALUE=DATE:${startDate}
DTEND;VALUE=DATE:${endDate}
SUMMARY:AIRAC Cycle ${cycle.cycle}
DESCRIPTION:AIRAC Cycle ${cycle.cycle} - Cycle ${cycle.cycleNumber} of ${cycle.year}\\nStatus: ${cycle.isCurrent ? 'Current' : cycle.isUpcoming ? 'Upcoming' : 'Past'}\\nDuration: 28 days
CATEGORIES:AIRAC,Aviation
TRANSP:TRANSPARENT
END:VEVENT`
    }).join('\n')

    return `${header}\n${events}\nEND:VCALENDAR`
  },

  // Download file utility
  downloadFile: (content: string, filename: string, mimeType: string): void => {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  },

  // Export cycles in various formats
  exportCycles: (cycles: AiracCycle[], format: 'csv' | 'json' | 'ical', filename?: string): void => {
    const timestamp = dateFnsFormat(new Date(), 'yyyy-MM-dd')
    const baseFilename = filename || `airac-cycles-${timestamp}`

    switch (format) {
      case 'csv':
        const csvData = cycles.map(cycle => ({
          cycle: cycle.cycle,
          year: cycle.year,
          cycleNumber: cycle.cycleNumber,
          startDate: dateFnsFormat(cycle.startDate, 'yyyy-MM-dd'),
          endDate: dateFnsFormat(cycle.endDate, 'yyyy-MM-dd'),
          status: cycle.isCurrent ? 'current' : cycle.isUpcoming ? 'upcoming' : 'past',
          daysSinceStart: cycle.daysSinceStart || '',
          daysUntilEnd: cycle.daysUntilEnd || ''
        }))
        const csvContent = exportUtils.generateCSV(csvData, Object.keys(csvData[0] || {}))
        exportUtils.downloadFile(csvContent, `${baseFilename}.csv`, 'text/csv')
        break

      case 'json':
        const jsonData = {
          exportDate: new Date().toISOString(),
          totalCycles: cycles.length,
          cycles: cycles.map(cycle => ({
            id: cycle.id,
            cycle: cycle.cycle,
            year: cycle.year,
            cycleNumber: cycle.cycleNumber,
            startDate: cycle.startDate.toISOString(),
            endDate: cycle.endDate.toISOString(),
            isCurrent: cycle.isCurrent,
            isUpcoming: cycle.isUpcoming,
            daysSinceStart: cycle.daysSinceStart,
            daysUntilEnd: cycle.daysUntilEnd
          }))
        }
        exportUtils.downloadFile(JSON.stringify(jsonData, null, 2), `${baseFilename}.json`, 'application/json')
        break

      case 'ical':
        const icalContent = exportUtils.generateICAL(cycles, `AIRAC Cycles Export - ${timestamp}`)
        exportUtils.downloadFile(icalContent, `${baseFilename}.ics`, 'text/calendar')
        break
    }
  }
}

// URL Management
export const urlUtils = {
  // Get current page URL
  getCurrentUrl: (): string => {
    return window.location.href
  },

  // Build URL with parameters
  buildUrl: (base: string, params: Record<string, any>): string => {
    const url = new URL(base, window.location.origin)
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value))
      }
    })
    return url.toString()
  },

  // Copy URL to clipboard
  copyToClipboard: async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      return false
    }
  },

  // Share URL using Web Share API or fallback
  shareUrl: async (data: { title: string; text: string; url: string }): Promise<boolean> => {
    if (navigator.share) {
      try {
        await navigator.share(data)
        return true
      } catch (error) {
        console.error('Error sharing:', error)
        return false
      }
    } else {
      // Fallback to copying to clipboard
      const shareText = `${data.title}\n${data.text}\n${data.url}`
      return await urlUtils.copyToClipboard(shareText)
    }
  }
}

// Date Formatting Utilities
export const dateUtils = {
  // Format date for display
  formatDisplay: (date: Date, formatStr = 'MMM dd, yyyy'): string => {
    return dateFnsFormat(date, formatStr)
  },

  // Format date for input fields
  formatInput: (date: Date): string => {
    return dateFnsFormat(date, 'yyyy-MM-dd')
  },

  // Format relative time
  formatRelative: (date: Date): string => {
    const now = new Date()
    const diffInDays = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Tomorrow'
    if (diffInDays === -1) return 'Yesterday'
    if (diffInDays > 0 && diffInDays <= 7) return `In ${diffInDays} days`
    if (diffInDays < 0 && diffInDays >= -7) return `${Math.abs(diffInDays)} days ago`
    
    return dateUtils.formatDisplay(date)
  },

  // Check if date is today
  isToday: (date: Date): boolean => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  },

  // Get date range string
  getDateRange: (startDate: Date, endDate: Date): string => {
    const start = dateUtils.formatDisplay(startDate, 'MMM dd')
    const end = dateUtils.formatDisplay(endDate, 'MMM dd, yyyy')
    return `${start} - ${end}`
  }
}

// Search and Filter Utilities
export const searchUtils = {
  // Highlight search terms in text
  highlightText: (text: string, searchTerm: string): string => {
    if (!searchTerm) return text
    
    const regex = new RegExp(`(${searchTerm})`, 'gi')
    return text.replace(regex, '<mark>$1</mark>')
  },

  // Normalize search query
  normalizeQuery: (query: string): string => {
    return query.toLowerCase().trim()
  },

  // Check if text matches search query
  matchesQuery: (text: string, query: string): boolean => {
    if (!query) return true
    
    const normalizedText = text.toLowerCase()
    const normalizedQuery = searchUtils.normalizeQuery(query)
    
    return normalizedText.includes(normalizedQuery)
  },

  // Extract search keywords
  extractKeywords: (query: string): string[] => {
    return query
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word.length > 2)
      .map(word => word.trim())
  }
}

// Performance Utilities
export const performanceUtils = {
  // Debounce function
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: ReturnType<typeof setTimeout>
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  },

  // Throttle function
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  },

  // Measure execution time
  measureTime: <T>(name: string, fn: () => T): T => {
    console.time(name)
    const result = fn()
    console.timeEnd(name)
    return result
  }
}

// Validation Utilities
export const validation = {
  // Validate email format
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Validate required fields
  isRequired: (value: any): boolean => {
    return value !== null && value !== undefined && value !== ''
  },

  // Validate string length
  isValidLength: (value: string, min: number, max?: number): boolean => {
    if (value.length < min) return false
    if (max && value.length > max) return false
    return true
  },

  // Validate number range
  isInRange: (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max
  }
}

// Accessibility Utilities
export const a11y = {
  // Manage focus
  focusElement: (selector: string): void => {
    const element = document.querySelector(selector) as HTMLElement
    if (element) {
      element.focus()
    }
  },

  // Trap focus within element
  trapFocus: (element: HTMLElement): void => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus()
            e.preventDefault()
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus()
            e.preventDefault()
          }
        }
      }
    })
  },

  // Announce to screen readers
  announce: (message: string): void => {
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = message

    document.body.appendChild(announcement)
    setTimeout(() => document.body.removeChild(announcement), 1000)
  }
}

// Analytics and Tracking (placeholder for future implementation)
export const analytics = {
  // Track page view
  trackPageView: (page: string): void => {
    console.log(`Page view: ${page}`)
  },

  // Track event
  trackEvent: (event: string, data?: any): void => {
    console.log(`Event: ${event}`, data)
  },

  // Track cycle view
  trackCycleView: (cycleId: string): void => {
    analytics.trackEvent('cycle_view', { cycleId })
    recentlyViewed.add(cycleId)
  },

  // Track export action
  trackExport: (format: string, count: number): void => {
    analytics.trackEvent('export', { format, count })
  }
}

// Error Handling Utilities
export const errorUtils = {
  // Handle and log errors
  handleError: (error: Error, context?: string): void => {
    console.error(`Error${context ? ` in ${context}` : ''}:`, error)
    
    // In production, you might want to send errors to a logging service
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      // Send to error tracking service in production
    }
  },

  // Create user-friendly error messages
  getUserMessage: (error: Error): string => {
    // Map technical errors to user-friendly messages
    const errorMessages: Record<string, string> = {
      'NetworkError': 'Network connection error. Please check your internet connection.',
      'TypeError': 'Something went wrong. Please refresh the page and try again.',
      'SyntaxError': 'Data format error. Please try again or contact support.'
    }

    return errorMessages[error.name] || 'An unexpected error occurred. Please try again.'
  },

  // Retry function with exponential backoff
  retry: async <T>(
    fn: () => Promise<T>,
    maxRetries = 3,
    baseDelay = 1000
  ): Promise<T> => {
    let lastError: Error

    for (let i = 0; i <= maxRetries; i++) {
      try {
        return await fn()
      } catch (error) {
        lastError = error as Error
        
        if (i === maxRetries) {
          throw lastError
        }

        const delay = baseDelay * Math.pow(2, i)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }

    throw lastError!
  }
} 