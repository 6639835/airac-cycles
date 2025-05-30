import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Calendar, 
  BarChart3, 
  Clock, 
  Grid3X3, 
  List,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Keyboard,
  Filter,
  X,
  Star
} from 'lucide-react'
import { useAirac } from '@/hooks/useAirac'
import { CycleCard } from '@/components/CycleCard'
import { CurrentCycleCard } from '@/components/CurrentCycleCard'
import { StatsCard } from '@/components/StatsCard'

export function HomePage() {
  const {
    cycles,
    currentCycle,
    stats,
    availableYears,
    filters,
    pagination,
    updateFilters,
    updatePagination,
    hasResults,
    isFiltered,
    totalResults,
    goToCurrentCycle
  } = useAirac()

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [bookmarkedCycles, setBookmarkedCycles] = useState<string[]>([])
  const [showBookmarked, setShowBookmarked] = useState(false)

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('airac-bookmarks')
    if (saved) {
      setBookmarkedCycles(JSON.parse(saved))
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return // Don't trigger in input fields
      
      switch (e.key.toLowerCase()) {
        case 'c':
          goToCurrentCycle()
          break
        case 'g':
          setViewMode(prev => prev === 'grid' ? 'list' : 'grid')
          break
        case 's':
          const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement
          searchInput?.focus()
          break
        case 'r':
          setSearchTerm('')
          updateFilters({ search: '', year: 'all', status: 'all' })
          break
        case '?':
          setShowShortcuts(true)
          break
        case 'escape':
          setShowShortcuts(false)
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [goToCurrentCycle, updateFilters])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    updateFilters({ search: value })
  }

  const handleYearFilter = (year: string) => {
    updateFilters({ year: year === 'all' ? 'all' : parseInt(year) })
  }

  const handleStatusFilter = (status: string) => {
    updateFilters({ status: status as any })
  }

  const toggleBookmark = (cycleId: string) => {
    const newBookmarks = bookmarkedCycles.includes(cycleId)
      ? bookmarkedCycles.filter(id => id !== cycleId)
      : [...bookmarkedCycles, cycleId]
    
    setBookmarkedCycles(newBookmarks)
    localStorage.setItem('airac-bookmarks', JSON.stringify(newBookmarks))
  }

  const filteredBookmarkedCycles = cycles.filter(cycle => 
    showBookmarked ? bookmarkedCycles.includes(cycle.id) : true
  )

  const displayCycles = showBookmarked ? filteredBookmarkedCycles : cycles

  const quickActions = [
    {
      icon: Clock,
      label: 'Current Cycle',
      action: goToCurrentCycle,
      color: 'bg-primary-500'
    },
    {
      icon: Calendar,
      label: 'Calendar View',
      action: () => window.location.href = '/calendar',
      color: 'bg-blue-500'
    },
    {
      icon: BarChart3,
      label: 'Analytics',
      action: () => window.location.href = '/analytics',
      color: 'bg-green-500'
    },
    {
      icon: Bookmark,
      label: `Bookmarks (${bookmarkedCycles.length})`,
      action: () => setShowBookmarked(!showBookmarked),
      color: 'bg-yellow-500',
      active: showBookmarked
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
            AIRAC Cycles Explorer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Comprehensive database of aeronautical information regulation and control cycles 
            from 2025 to 2099. Modern, fast, and built for aviation professionals.
          </p>
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
            {quickActions.map((action, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                onClick={action.action}
                className={`flex flex-col items-center space-y-3 p-6 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                  action.active ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300' : 'bg-white dark:bg-gray-800'
                }`}
              >
                <div className={`p-3 rounded-lg ${action.color}`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {action.label}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Keyboard Shortcuts Hint */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            onClick={() => setShowShortcuts(true)}
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center space-x-1 mx-auto"
          >
            <Keyboard className="w-4 h-4" />
            <span>Press ? for keyboard shortcuts</span>
          </motion.button>
        </motion.div>

        {/* Current Cycle & Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            {currentCycle && <CurrentCycleCard cycle={currentCycle} />}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <StatsCard stats={stats} />
          </motion.div>
        </div>

        {/* Enhanced Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="card mb-8"
        >
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search cycles, dates, or years... (Press 's' to focus)"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="input pl-10 pr-10"
                />
                {searchTerm && (
                  <button
                    onClick={() => handleSearch('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <select
                    value={filters.year || 'all'}
                    onChange={(e) => handleYearFilter(e.target.value)}
                    className="input w-auto min-w-32"
                  >
                    <option value="all">All Years</option>
                    {availableYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>

                <select
                  value={filters.status || 'all'}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="input w-auto min-w-32"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-gray-600 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                    title="Grid view (Press 'g' to toggle)"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-gray-600 shadow-sm'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                    title="List view (Press 'g' to toggle)"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Info */}
            <div className="mt-4 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <span>
                  Showing {displayCycles.length} of {showBookmarked ? bookmarkedCycles.length : totalResults} cycles
                  {showBookmarked && <Star className="w-4 h-4 inline ml-1 text-yellow-500" />}
                </span>
                {isFiltered && (
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      updateFilters({ search: '', year: 'all', status: 'all' })
                      setShowBookmarked(false)
                    }}
                    className="text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center space-x-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Clear all filters (Press 'r')</span>
                  </button>
                )}
              </div>
              <div>
                Page {pagination.page} of {pagination.totalPages}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cycles Display */}
        {hasResults ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }
            >
              {displayCycles.map((cycle) => (
                <div key={cycle.id} className="relative group">
                  <CycleCard
                    cycle={cycle}
                    viewMode={viewMode}
                  />
                  {/* Bookmark button */}
                  <button
                    onClick={() => toggleBookmark(cycle.id)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-white dark:bg-gray-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110"
                    title={bookmarkedCycles.includes(cycle.id) ? 'Remove bookmark' : 'Add bookmark'}
                  >
                    {bookmarkedCycles.includes(cycle.id) ? (
                      <BookmarkCheck className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <Bookmark className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && !showBookmarked && (
              <div className="mt-8 flex justify-center items-center space-x-4">
                <button
                  onClick={() => updatePagination({ page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <span className="text-gray-600 dark:text-gray-400">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => updatePagination({ page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.totalPages}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 mb-4">
              {showBookmarked ? <Star className="w-16 h-16 mx-auto" /> : <Search className="w-16 h-16 mx-auto" />}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {showBookmarked ? 'No bookmarked cycles' : 'No cycles found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {showBookmarked 
                ? 'Start bookmarking cycles by clicking the bookmark icon on any cycle card'
                : 'Try adjusting your search terms or filters'
              }
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                updateFilters({ search: '', year: 'all', status: 'all' })
                setShowBookmarked(false)
              }}
              className="btn-primary"
            >
              {showBookmarked ? 'Show all cycles' : 'Clear all filters'}
            </button>
          </motion.div>
        )}

        {/* Keyboard Shortcuts Modal */}
        {showShortcuts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowShortcuts(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="card max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                    <Keyboard className="w-5 h-5" />
                    <span>Keyboard Shortcuts</span>
                  </h3>
                  <button
                    onClick={() => setShowShortcuts(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Go to current cycle</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">C</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Toggle grid/list view</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">G</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Focus search</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">S</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Reset filters</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">R</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Show shortcuts</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">?</kbd>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Close modal</span>
                    <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">ESC</kbd>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
} 