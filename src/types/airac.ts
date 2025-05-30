export interface AiracCycle {
  id: string
  cycle: string
  year: number
  cycleNumber: number
  startDate: Date
  endDate: Date
  isActive: boolean
  isCurrent: boolean
  isUpcoming: boolean
  daysSinceStart?: number
  daysUntilEnd?: number
}

export interface AiracFilters {
  year?: number | 'all'
  search?: string
  status?: 'all' | 'active' | 'upcoming' | 'past'
}

export interface AiracStats {
  totalCycles: number
  currentCycle: AiracCycle | null
  upcomingCycles: AiracCycle[]
  cyclesByYear: Record<number, number>
  averageCycleDuration: number
}

export interface PaginationOptions {
  page: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
}

export type ViewMode = 'grid' | 'list' | 'timeline' | 'calendar'

export type SortOption = 'date-asc' | 'date-desc' | 'cycle-asc' | 'cycle-desc'

export interface ViewPreferences {
  mode: ViewMode
  itemsPerPage: number
  sortBy: SortOption
  showActiveOnly: boolean
  darkMode: boolean
} 