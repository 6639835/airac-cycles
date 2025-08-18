import { useState, useMemo, useCallback } from 'react'
import type { AiracFilters, PaginationOptions, SortOption } from '@/types/airac'
import { 
  generateAllAiracCycles, 
  findCurrentCycle, 
  calculateAiracStats,
  searchAiracCycles 
} from '@/utils/airacCalculator'
import { log } from '@/utils/logger'


export function useAirac() {
  // Generate all cycles with error handling
  const allCycles = useMemo(() => {
    try {
      return generateAllAiracCycles()
    } catch (error) {
      log.error('Error generating AIRAC cycles', error, 'useAirac')
      throw new Error('Critical: Failed to generate AIRAC cycles')
    }
  }, [])
  
  // State for filters and pagination
  const [filters, setFilters] = useState<AiracFilters>({
    year: 'all',
    search: '',
    status: 'all'
  })
  
  const [sortBy, setSortBy] = useState<SortOption>('date-asc')
  const [pagination, setPagination] = useState<PaginationOptions>({
    page: 1,
    itemsPerPage: 24,
    totalItems: 0,
    totalPages: 0
  })

  // Filter cycles based on current filters
  const filteredCycles = useMemo(() => {
    let cycles = allCycles

    // Apply search filter
    if (filters.search) {
      cycles = searchAiracCycles(cycles, filters.search)
    }

    // Apply year filter
    if (filters.year !== 'all') {
      cycles = cycles.filter(cycle => cycle.year === filters.year)
    }

    // Apply status filter
    if (filters.status !== 'all') {
      cycles = cycles.filter(cycle => {
        switch (filters.status) {
          case 'active':
            return cycle.isCurrent
          case 'upcoming':
            return cycle.isUpcoming
          case 'past':
            return !cycle.isCurrent && !cycle.isUpcoming
          default:
            return true
        }
      })
    }

    // Apply sorting
    return cycles.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return a.startDate.getTime() - b.startDate.getTime()
        case 'date-desc':
          return b.startDate.getTime() - a.startDate.getTime()
        case 'cycle-asc':
          return a.cycle.localeCompare(b.cycle)
        case 'cycle-desc':
          return b.cycle.localeCompare(a.cycle)
        default:
          return 0
      }
    })
  }, [allCycles, filters, sortBy])

  // Calculate pagination
  const paginatedCycles = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.itemsPerPage
    const endIndex = startIndex + pagination.itemsPerPage
    
    const totalPages = Math.ceil(filteredCycles.length / pagination.itemsPerPage)
    
    // Update pagination state if needed
    if (pagination.totalItems !== filteredCycles.length || pagination.totalPages !== totalPages) {
      setPagination(prev => ({
        ...prev,
        totalItems: filteredCycles.length,
        totalPages
      }))
    }
    
    return filteredCycles.slice(startIndex, endIndex)
  }, [filteredCycles, pagination.page, pagination.itemsPerPage, pagination.totalItems, pagination.totalPages])

  // Get current cycle and stats
  const currentCycle = useMemo(() => findCurrentCycle(allCycles), [allCycles])
  const stats = useMemo(() => calculateAiracStats(allCycles), [allCycles])

  // Available years for filtering
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(allCycles.map(cycle => cycle.year)))
    return years.sort((a, b) => a - b)
  }, [allCycles])

  // Action handlers
  const updateFilters = useCallback((newFilters: Partial<AiracFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page
  }, [])

  const updatePagination = useCallback((newPagination: Partial<PaginationOptions>) => {
    setPagination(prev => ({ ...prev, ...newPagination }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      year: 'all',
      search: '',
      status: 'all'
    })
    setPagination(prev => ({ ...prev, page: 1 }))
  }, [])

  const goToCurrentCycle = useCallback(() => {
    if (!currentCycle) return
    
    resetFilters()
    
    // Find the page containing the current cycle
    const currentIndex = allCycles.findIndex(cycle => cycle.id === currentCycle.id)
    const targetPage = Math.ceil((currentIndex + 1) / pagination.itemsPerPage)
    
    setPagination(prev => ({ ...prev, page: targetPage }))
  }, [currentCycle, allCycles, pagination.itemsPerPage, resetFilters])

  return {
    // Data
    cycles: paginatedCycles,
    allCycles: filteredCycles,
    currentCycle,
    stats,
    availableYears,
    
    // State
    filters,
    sortBy,
    pagination,
    
    // Actions
    updateFilters,
    updatePagination,
    setSortBy,
    resetFilters,
    goToCurrentCycle,
    
    // Computed
    hasResults: filteredCycles.length > 0,
    isFiltered: filters.search !== '' || filters.year !== 'all' || filters.status !== 'all',
    totalResults: filteredCycles.length,
  }
} 