/**
 * Centralized logging utility for the application
 * Provides structured logging with different levels and formatting
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: unknown
  component?: string
}

class Logger {
  private isDevelopment = import.meta.env.DEV
  private logHistory: LogEntry[] = []
  private maxHistorySize = 100

  /**
   * Create a formatted log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: unknown,
    component?: string
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    }
    
    if (component) {
      entry.component = component
    }
    
    return entry
  }

  /**
   * Add log entry to history
   */
  private addToHistory(entry: LogEntry) {
    this.logHistory.push(entry)
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift()
    }
  }

  /**
   * Format log message for console output
   */
  private formatConsoleMessage(entry: LogEntry): string {
    const timestamp = new Date(entry.timestamp).toLocaleTimeString()
    const component = entry.component ? `[${entry.component}]` : ''
    return `${timestamp} ${component} ${entry.message}`
  }

  /**
   * Log debug message (development only)
   */
  debug(message: string, data?: unknown, component?: string) {
    if (!this.isDevelopment) return

    const entry = this.createLogEntry('debug', message, data, component)
    this.addToHistory(entry)
    
    // eslint-disable-next-line no-console
    console.debug(this.formatConsoleMessage(entry), data || '')
  }

  /**
   * Log info message
   */
  info(message: string, data?: unknown, component?: string) {
    const entry = this.createLogEntry('info', message, data, component)
    this.addToHistory(entry)
    
    if (this.isDevelopment) {
      // eslint-disable-next-line no-console
      console.info(this.formatConsoleMessage(entry), data || '')
    }
  }

  /**
   * Log warning message
   */
  warn(message: string, data?: unknown, component?: string) {
    const entry = this.createLogEntry('warn', message, data, component)
    this.addToHistory(entry)
    
    // eslint-disable-next-line no-console
    console.warn(this.formatConsoleMessage(entry), data || '')
  }

  /**
   * Log error message
   */
  error(message: string, error?: unknown, component?: string) {
    const entry = this.createLogEntry('error', message, error, component)
    this.addToHistory(entry)
    
    // eslint-disable-next-line no-console
    console.error(this.formatConsoleMessage(entry), error || '')
    
    // In production, you might want to send errors to a monitoring service
    if (!this.isDevelopment) {
      this.sendErrorToMonitoring(entry)
    }
  }

  /**
   * Send error to monitoring service (placeholder for future implementation)
   */
  private sendErrorToMonitoring(_entry: LogEntry) {
    // TODO: Implement error monitoring service integration
    // e.g., Sentry, LogRocket, or custom analytics
  }

  /**
   * Get log history for debugging
   */
  getHistory(): LogEntry[] {
    return [...this.logHistory]
  }

  /**
   * Clear log history
   */
  clearHistory() {
    this.logHistory = []
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logHistory.filter(entry => entry.level === level)
  }

  /**
   * Export logs as JSON (useful for debugging)
   */
  exportLogs(): string {
    return JSON.stringify(this.logHistory, null, 2)
  }
}

// Create singleton logger instance
export const logger = new Logger()

// Convenience functions for different log levels
export const log = {
  debug: (message: string, data?: unknown, component?: string) => 
    logger.debug(message, data, component),
  
  info: (message: string, data?: unknown, component?: string) => 
    logger.info(message, data, component),
  
  warn: (message: string, data?: unknown, component?: string) => 
    logger.warn(message, data, component),
  
  error: (message: string, error?: unknown, component?: string) => 
    logger.error(message, error, component),
}

export default logger
