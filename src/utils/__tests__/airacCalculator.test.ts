import { describe, it, expect, vi } from 'vitest'
import { 
  generateCycleId, 
  calculateCycleStartDate, 
  calculateCycleEndDate,
  getCycleStatus,
  generateAiracCycle,
  generateAiracCyclesForYear,
  findCurrentCycle,
  searchAiracCycles
} from '../airacCalculator'

// Mock current date for consistent testing
const MOCK_DATE = new Date('2025-02-15T12:00:00.000Z') // Middle of first cycle
vi.setSystemTime(MOCK_DATE)

describe('airacCalculator', () => {
  describe('generateCycleId', () => {
    it('should generate correct cycle ID for 2025 cycle 1', () => {
      expect(generateCycleId(2025, 1)).toBe('2501')
    })

    it('should generate correct cycle ID for 2025 cycle 13', () => {
      expect(generateCycleId(2025, 13)).toBe('2513')
    })

    it('should pad single digit cycles with zero', () => {
      expect(generateCycleId(2025, 5)).toBe('2505')
    })

    it('should handle different years correctly', () => {
      expect(generateCycleId(2026, 1)).toBe('2601')
      expect(generateCycleId(2099, 13)).toBe('9913')
    })
  })

  describe('calculateCycleStartDate', () => {
    it('should calculate correct start date for first cycle of 2025', () => {
      const startDate = calculateCycleStartDate(2025, 1)
      expect(startDate).toEqual(new Date(2025, 0, 23)) // January 23, 2025
    })

    it('should calculate correct start date for second cycle of 2025', () => {
      const startDate = calculateCycleStartDate(2025, 2)
      expect(startDate).toEqual(new Date(2025, 1, 20)) // February 20, 2025
    })

    it('should handle different years correctly', () => {
      // First cycle of 2026 should be 13 cycles (364 days) after first cycle of 2025
      const start2026 = calculateCycleStartDate(2026, 1)
      const start2025 = calculateCycleStartDate(2025, 1)
      const daysDifference = (start2026.getTime() - start2025.getTime()) / (1000 * 60 * 60 * 24)
      expect(daysDifference).toBe(364) // 13 cycles * 28 days
    })
  })

  describe('calculateCycleEndDate', () => {
    it('should calculate correct end date (27 days after start)', () => {
      const startDate = new Date(2025, 0, 23) // January 23, 2025
      const endDate = calculateCycleEndDate(startDate)
      expect(endDate).toEqual(new Date(2025, 1, 19)) // February 19, 2025
    })
  })

  describe('getCycleStatus', () => {
    it('should identify current cycle correctly', () => {
      const startDate = new Date(2025, 0, 23) // January 23, 2025
      const endDate = new Date(2025, 1, 19) // February 19, 2025
      const status = getCycleStatus(startDate, endDate)
      
      expect(status).toEqual({
        isActive: true,
        isCurrent: true,
        isUpcoming: false
      })
    })

    it('should identify upcoming cycle correctly', () => {
      const startDate = new Date(2025, 2, 20) // March 20, 2025 (future)
      const endDate = new Date(2025, 3, 16) // April 16, 2025
      const status = getCycleStatus(startDate, endDate)
      
      expect(status).toEqual({
        isActive: false,
        isCurrent: false,
        isUpcoming: true
      })
    })

    it('should identify past cycle correctly', () => {
      const startDate = new Date(2024, 11, 1) // December 1, 2024 (past)
      const endDate = new Date(2024, 11, 28) // December 28, 2024
      const status = getCycleStatus(startDate, endDate)
      
      expect(status).toEqual({
        isActive: false,
        isCurrent: false,
        isUpcoming: false
      })
    })
  })

  describe('generateAiracCycle', () => {
    it('should generate complete cycle data', () => {
      const cycle = generateAiracCycle(2025, 1)
      
      expect(cycle).toMatchObject({
        id: '2025-01',
        cycle: '2501',
        year: 2025,
        cycleNumber: 1,
        isActive: true,
        isCurrent: true,
        isUpcoming: false
      })
      
      expect(cycle.startDate).toEqual(new Date(2025, 0, 23))
      expect(cycle.endDate).toEqual(new Date(2025, 1, 19))
    })
  })

  describe('generateAiracCyclesForYear', () => {
    it('should generate 13 cycles for any year', () => {
      const cycles = generateAiracCyclesForYear(2025)
      expect(cycles).toHaveLength(13)
    })

    it('should generate cycles with correct sequence', () => {
      const cycles = generateAiracCyclesForYear(2025)
      
      expect(cycles[0]?.cycle).toBe('2501')
      expect(cycles[12]?.cycle).toBe('2513')
      
      // Check that each cycle starts when previous ends + 1 day
      for (let i = 1; i < cycles.length; i++) {
        const prevCycle = cycles[i - 1]
        const currentCycle = cycles[i]
        expect(prevCycle).toBeDefined()
        expect(currentCycle).toBeDefined()
        
        if (prevCycle && currentCycle) {
          const daysDiff = (currentCycle.startDate.getTime() - prevCycle.endDate.getTime()) / (1000 * 60 * 60 * 24)
          expect(daysDiff).toBe(1)
        }
      }
    })
  })

  describe('findCurrentCycle', () => {
    it('should find the current active cycle', () => {
      const cycles = generateAiracCyclesForYear(2025)
      const currentCycle = findCurrentCycle(cycles)
      
      expect(currentCycle).toBeTruthy()
      expect(currentCycle?.isCurrent).toBe(true)
      expect(currentCycle?.cycle).toBe('2501') // Should be first cycle based on mock date
    })

    it('should return null if no current cycle found', () => {
      const futureCycles = generateAiracCyclesForYear(2030)
      const currentCycle = findCurrentCycle(futureCycles)
      
      expect(currentCycle).toBeNull()
    })
  })

  describe('searchAiracCycles', () => {
    const testCycles = generateAiracCyclesForYear(2025)

    it('should return all cycles when search term is empty', () => {
      const results = searchAiracCycles(testCycles, '')
      expect(results).toHaveLength(13)
    })

    it('should filter by cycle identifier', () => {
      const results = searchAiracCycles(testCycles, '2501')
      expect(results).toHaveLength(1)
      expect(results[0]?.cycle).toBe('2501')
    })

    it('should filter by year', () => {
      const results = searchAiracCycles(testCycles, '2025')
      expect(results).toHaveLength(13)
      expect(results.every(cycle => cycle.year === 2025)).toBe(true)
    })

    it('should be case insensitive', () => {
      const results = searchAiracCycles(testCycles, 'JAN')
      expect(results.length).toBeGreaterThan(0)
    })

    it('should return empty array for non-matching search', () => {
      const results = searchAiracCycles(testCycles, 'invalid search term')
      expect(results).toHaveLength(0)
    })
  })
})
