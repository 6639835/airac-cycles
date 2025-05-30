import { addDays, format, isAfter, isBefore, isToday, differenceInDays } from 'date-fns'
import type { AiracCycle, AiracStats } from '@/types/airac'

// AIRAC Reference Date: First cycle of 2025 starts on January 23rd, 2025
const AIRAC_REFERENCE_DATE = new Date(2025, 0, 23) // January 23, 2025
const AIRAC_CYCLE_DAYS = 28

/**
 * Generate AIRAC cycle identifier (e.g., "2501" for first cycle of 2025)
 */
export function generateCycleId(year: number, cycleNumber: number): string {
  const yearSuffix = year.toString().slice(-2)
  const cycleId = cycleNumber.toString().padStart(2, '0')
  return `${yearSuffix}${cycleId}`
}

/**
 * Calculate the start date for a given AIRAC cycle
 */
export function calculateCycleStartDate(year: number, cycleNumber: number): Date {
  const cyclesSinceReference = ((year - 2025) * 13) + (cycleNumber - 1)
  return addDays(AIRAC_REFERENCE_DATE, cyclesSinceReference * AIRAC_CYCLE_DAYS)
}

/**
 * Calculate the end date for a given AIRAC cycle
 */
export function calculateCycleEndDate(startDate: Date): Date {
  return addDays(startDate, AIRAC_CYCLE_DAYS - 1)
}

/**
 * Determine cycle status relative to current date
 */
export function getCycleStatus(startDate: Date, endDate: Date) {
  const now = new Date()
  
  if (isBefore(now, startDate)) {
    return { isActive: false, isCurrent: false, isUpcoming: true }
  }
  
  if (isAfter(now, endDate)) {
    return { isActive: false, isCurrent: false, isUpcoming: false }
  }
  
  return { isActive: true, isCurrent: true, isUpcoming: false }
}

/**
 * Calculate additional cycle metadata
 */
export function calculateCycleMetadata(startDate: Date, endDate: Date) {
  const now = new Date()
  
  return {
    daysSinceStart: differenceInDays(now, startDate),
    daysUntilEnd: differenceInDays(endDate, now),
  }
}

/**
 * Generate a single AIRAC cycle
 */
export function generateAiracCycle(year: number, cycleNumber: number): AiracCycle {
  const startDate = calculateCycleStartDate(year, cycleNumber)
  const endDate = calculateCycleEndDate(startDate)
  const status = getCycleStatus(startDate, endDate)
  const metadata = calculateCycleMetadata(startDate, endDate)
  
  return {
    id: `${year}-${cycleNumber.toString().padStart(2, '0')}`,
    cycle: generateCycleId(year, cycleNumber),
    year,
    cycleNumber,
    startDate,
    endDate,
    ...status,
    ...metadata,
  }
}

/**
 * Generate all AIRAC cycles for a given year
 */
export function generateAiracCyclesForYear(year: number): AiracCycle[] {
  const cycles: AiracCycle[] = []
  
  for (let cycleNumber = 1; cycleNumber <= 13; cycleNumber++) {
    cycles.push(generateAiracCycle(year, cycleNumber))
  }
  
  return cycles
}

/**
 * Generate all AIRAC cycles from 2025 to 2099
 */
export function generateAllAiracCycles(): AiracCycle[] {
  const cycles: AiracCycle[] = []
  
  for (let year = 2025; year <= 2099; year++) {
    cycles.push(...generateAiracCyclesForYear(year))
  }
  
  return cycles
}

/**
 * Find the current active AIRAC cycle
 */
export function findCurrentCycle(cycles: AiracCycle[]): AiracCycle | null {
  return cycles.find(cycle => cycle.isCurrent) || null
}

/**
 * Find upcoming AIRAC cycles
 */
export function findUpcomingCycles(cycles: AiracCycle[], count = 3): AiracCycle[] {
  return cycles
    .filter(cycle => cycle.isUpcoming)
    .slice(0, count)
}

/**
 * Calculate AIRAC statistics
 */
export function calculateAiracStats(cycles: AiracCycle[]): AiracStats {
  const currentCycle = findCurrentCycle(cycles)
  const upcomingCycles = findUpcomingCycles(cycles)
  
  const cyclesByYear = cycles.reduce((acc, cycle) => {
    acc[cycle.year] = (acc[cycle.year] || 0) + 1
    return acc
  }, {} as Record<number, number>)
  
  return {
    totalCycles: cycles.length,
    currentCycle,
    upcomingCycles,
    cyclesByYear,
    averageCycleDuration: AIRAC_CYCLE_DAYS,
  }
}

/**
 * Format AIRAC cycle for display
 */
export function formatCycleForDisplay(cycle: AiracCycle) {
  return {
    ...cycle,
    formattedStartDate: format(cycle.startDate, 'MMM dd, yyyy'),
    formattedEndDate: format(cycle.endDate, 'MMM dd, yyyy'),
    formattedDateRange: `${format(cycle.startDate, 'MMM dd')} - ${format(cycle.endDate, 'MMM dd, yyyy')}`,
    isToday: isToday(cycle.startDate) || isToday(cycle.endDate),
  }
}

/**
 * Search and filter AIRAC cycles
 */
export function searchAiracCycles(
  cycles: AiracCycle[],
  searchTerm: string
): AiracCycle[] {
  if (!searchTerm.trim()) return cycles
  
  const term = searchTerm.toLowerCase()
  
  return cycles.filter(cycle => 
    cycle.cycle.toLowerCase().includes(term) ||
    cycle.year.toString().includes(term) ||
    format(cycle.startDate, 'MMM dd, yyyy').toLowerCase().includes(term) ||
    format(cycle.endDate, 'MMM dd, yyyy').toLowerCase().includes(term)
  )
} 