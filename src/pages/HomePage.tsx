import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
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
  X,
  ArrowRight,
  AlertCircle,
  PlaneTakeoff,
  PlaneLanding,
  Globe,
  History,
  Shield,
  LucideIcon
} from 'lucide-react'
import { useAirac } from '@/hooks/useAirac'
import { CycleCard } from '@/components/CycleCard'
import { CurrentCycleCard } from '@/components/CurrentCycleCard'
import { useTheme } from '@/contexts/ThemeContext'

interface FeatureItem {
  title: string;
  description: string;
  icon: LucideIcon;
  items: string[];
}

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
  
  const { isDark } = useTheme()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [bookmarkedCycles, setBookmarkedCycles] = useState<string[]>([])
  const [showBookmarked, setShowBookmarked] = useState(false)
  const [activeFeaturesTab, setActiveFeaturesTab] = useState(0)

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
        case 's': {
          const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement
          searchInput?.focus()
          break
        }
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
    updateFilters({ status: status as 'all' | 'active' | 'upcoming' | 'past' })
  }

  const filteredBookmarkedCycles = cycles.filter(cycle => 
    showBookmarked ? bookmarkedCycles.includes(cycle.id) : true
  )

  const displayCycles = showBookmarked ? filteredBookmarkedCycles : cycles

  const features: FeatureItem[] = [
    {
      title: "Comprehensive Coverage",
      description: "Complete AIRAC cycle database from 2025 to 2099, providing essential planning tools for aviation professionals.",
      icon: Globe,
      items: [
        "Complete 28-day cycle calendar",
        "Detailed cycle information",
        "Historical and future cycles"
      ]
    },
    {
      title: "Real-time Tracking",
      description: "Stay informed about current and upcoming AIRAC cycles with our accurate tracking system.",
      icon: Clock,
      items: [
        "Current cycle indicators",
        "Remaining days countdown",
        "Upcoming cycle alerts"
      ]
    },
    {
      title: "Advanced Analytics",
      description: "Visualize and analyze AIRAC cycle patterns with our intuitive analytics tools.",
      icon: BarChart3,
      items: [
        "Cycle distribution analysis",
        "Year-by-year comparisons",
        "Customizable data views"
      ]
    }
  ]

  // Helper function to render the active feature icon
  const renderFeatureIcon = (index: number) => {
    const IconComponent = features[index]?.icon || Clock;
    return <IconComponent className="w-8 h-8" />;
  };

  return (
    <>
      {/* Hero Section */}
      <section className={`relative overflow-hidden pb-16 pt-24 sm:pb-24 sm:pt-32 ${isDark ? 'bg-dark-gradient' : 'bg-gradient-to-br from-neutral-50 to-neutral-100'}`}>
        <div className="subtle-noise" aria-hidden="true"></div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className={`absolute left-1/4 -top-20 h-[500px] w-[500px] rounded-full ${isDark ? 'bg-primary-900/10' : 'bg-primary-100/40'} blur-3xl`}></div>
          <div className={`absolute right-1/4 bottom-0 h-[400px] w-[400px] rounded-full ${isDark ? 'bg-secondary-900/10' : 'bg-secondary-100/30'} blur-3xl`}></div>
        </div>
        
        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className={`inline-block px-4 py-1.5 mb-6 rounded-full text-xs font-medium tracking-wide ${
                  isDark ? 'bg-dark-accent text-primary-400' : 'bg-primary-50 text-primary-500'
                }`}>
                  Premium AIRAC Solution
                </span>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-6 tracking-tight">
                  <span className="text-neutral-800 dark:text-white">Aviation </span>
                  <span className="text-gradient">AIRAC Cycles</span>
                  <span className="text-neutral-800 dark:text-white"> Explorer</span>
                </h1>
                
                <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                  The premium platform for aviation professionals to navigate AIRAC cycles with precision, 
                  clarity, and confidence.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button 
                    onClick={goToCurrentCycle}
                    className={`btn-primary text-base px-6 py-3 ${isDark ? 'shadow-glow' : ''}`}
                  >
                    <Clock className="w-5 h-5 mr-2" />
                    <span>Current Cycle</span>
                  </button>
                  
                  <Link 
                    to="/calendar" 
                    className="btn-secondary text-base px-6 py-3"
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    <span>View Calendar</span>
                  </Link>
                </div>
                
                {/* Key metrics */}
                <div className="grid grid-cols-3 gap-4 mt-12 max-w-2xl mx-auto lg:mx-0">
                  <div className={`text-center py-4 rounded-lg ${
                    isDark ? 'bg-dark-accent/30' : 'bg-white/80'
                  }`}>
                    <div className="text-3xl font-medium text-primary-500 dark:text-primary-400">
                      {stats.totalCycles}
                    </div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      Total Cycles
                    </div>
                  </div>
                  
                  <div className={`text-center py-4 rounded-lg ${
                    isDark ? 'bg-dark-accent/30' : 'bg-white/80'
                  }`}>
                    <div className="text-3xl font-medium text-primary-500 dark:text-primary-400">
                      28
                    </div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      Day Cycle
                    </div>
                  </div>
                  
                  <div className={`text-center py-4 rounded-lg ${
                    isDark ? 'bg-dark-accent/30' : 'bg-white/80'
                  }`}>
                    <div className="text-3xl font-medium text-primary-500 dark:text-primary-400">
                      {Object.keys(stats.cyclesByYear).length}
                    </div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      Years Coverage
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Hero image/Current cycle */}
            <div className="lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                {currentCycle && 
                  <div className={`${isDark ? 'shadow-dark-medium' : 'shadow-medium'} rounded-xl`}>
                    <CurrentCycleCard cycle={currentCycle} />
                  </div>
                }
                
                {/* Decorative elements */}
                <div className="absolute -right-12 -bottom-12 w-24 h-24 text-primary-500/10 dark:text-primary-400/10">
                  <PlaneTakeoff className="w-full h-full" />
                </div>
                <div className="absolute -left-10 -top-10 w-20 h-20 text-secondary-500/10 dark:text-secondary-400/10 rotate-45">
                  <PlaneLanding className="w-full h-full" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className={`py-24 ${isDark ? 'bg-dark-200' : 'bg-white'}`}>
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-neutral-800 dark:text-white">
                Everything You Need to Track <span className="text-gradient">AIRAC Cycles</span>
              </h2>
              <p className="text-xl text-neutral-600 dark:text-neutral-300">
                A comprehensive suite of tools for aviation professionals to navigate AIRAC cycles with precision.
              </p>
            </motion.div>
          </div>
          
          {/* Feature tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <motion.button
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => setActiveFeaturesTab(index)}
                    className={`w-full text-left p-6 rounded-xl transition-all duration-200 ${
                      activeFeaturesTab === index 
                        ? isDark
                          ? 'bg-dark-accent text-white shadow-dark-medium'
                          : 'bg-primary-50 text-primary-500 shadow-medium'
                        : isDark
                          ? 'bg-dark-100 text-neutral-300 hover:bg-dark-accent/50'
                          : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-start">
                      <div className={`p-2 rounded-lg mr-4 ${
                        activeFeaturesTab === index
                          ? isDark
                            ? 'bg-primary-500/20 text-primary-400' 
                            : 'bg-primary-500/10 text-primary-500'
                          : isDark
                            ? 'bg-dark-accent text-neutral-400'
                            : 'bg-white text-neutral-500'
                      }`}>
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className={`font-medium text-lg ${
                          activeFeaturesTab === index
                            ? isDark ? 'text-white' : 'text-primary-500'
                            : 'text-neutral-800 dark:text-neutral-200'
                        }`}>
                          {feature.title}
                        </h3>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-8">
              <motion.div
                key={activeFeaturesTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`rounded-xl p-8 h-full ${
                  isDark ? 'bg-dark-100 border border-dark-accent' : 'bg-white border border-neutral-100 shadow-medium'
                }`}
              >
                <div className="flex items-center mb-6">
                  <div className={`p-3 rounded-lg mr-4 ${
                    isDark ? 'bg-dark-accent text-primary-400' : 'bg-primary-50 text-primary-500'
                  }`}>
                    {renderFeatureIcon(activeFeaturesTab)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-medium text-neutral-800 dark:text-white">
                      {features[activeFeaturesTab]?.title || "Feature"}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                      {features[activeFeaturesTab]?.description || "Description"}
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  {features[activeFeaturesTab]?.items?.map((item, i) => (
                    <div 
                      key={i}
                      className={`p-4 rounded-lg ${
                        isDark ? 'bg-dark-accent/50' : 'bg-neutral-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mr-3 ${
                          isDark ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-500/10 text-primary-500'
                        }`}>
                          <Shield className="w-4 h-4" />
                        </div>
                        <p className="text-neutral-800 dark:text-neutral-200 font-medium">
                          {item}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-dark-accent">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4 sm:mb-0">
                      Experience the most comprehensive AIRAC cycle tracking available.
                    </p>
                    <Link 
                      to={activeFeaturesTab === 0 ? '/calendar' : activeFeaturesTab === 1 ? (currentCycle ? `/cycle/${currentCycle.id}` : '/') : '/analytics'} 
                      className={`inline-flex items-center text-primary-500 dark:text-primary-400 font-medium ${
                        isDark ? 'hover:text-primary-300' : 'hover:text-primary-600'
                      }`}
                    >
                      <span>Explore {features[activeFeaturesTab]?.title || "Feature"}</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Search & Explore Section */}
      <section className={`py-24 ${isDark ? 'bg-dark-gradient' : 'bg-neutral-50'}`}>
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-neutral-800 dark:text-white">
                Search & Explore <span className="text-gradient">AIRAC Cycles</span>
              </h2>
              <p className="text-xl text-neutral-600 dark:text-neutral-300">
                Easily find and navigate through the comprehensive database of AIRAC cycles.
              </p>
            </motion.div>
          </div>
          
          <div className="max-w-4xl mx-auto mb-12">
            <div className={`p-8 rounded-xl ${
              isDark ? 'bg-dark-100 border border-dark-accent shadow-dark-medium' : 'bg-white shadow-medium'
            }`}>
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search cycles, dates, or years... (Press 's' to focus)"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="input pl-12 w-full"
                />
                {searchTerm && (
                  <button
                    onClick={() => handleSearch('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">
                    Filter by Year
                  </label>
                  <select
                    value={typeof filters.year === 'number' ? filters.year.toString() : 'all'}
                    onChange={(e) => handleYearFilter(e.target.value)}
                    className="input"
                  >
                    <option value="all">All Years</option>
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">
                    Filter by Status
                  </label>
                  <select
                    value={filters.status || 'all'}
                    onChange={(e) => handleStatusFilter(e.target.value)}
                    className="input"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="past">Past</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-600 dark:text-neutral-300 mb-2">
                    View Mode
                  </label>
                  <div className="flex h-[44px]">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`flex-1 flex items-center justify-center rounded-l-lg border ${
                        viewMode === 'grid'
                          ? isDark
                            ? 'bg-primary-500 text-white border-primary-500'
                            : 'bg-primary-500 text-white border-primary-500'
                          : isDark
                            ? 'bg-dark-accent text-neutral-400 border-dark-accent'
                            : 'bg-white text-neutral-600 border-neutral-200'
                      }`}
                    >
                      <Grid3X3 className="w-4 h-4 mr-2" />
                      <span>Grid</span>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex-1 flex items-center justify-center rounded-r-lg border ${
                        viewMode === 'list'
                          ? isDark
                            ? 'bg-primary-500 text-white border-primary-500'
                            : 'bg-primary-500 text-white border-primary-500'
                          : isDark
                            ? 'bg-dark-accent text-neutral-400 border-dark-accent'
                            : 'bg-white text-neutral-600 border-neutral-200'
                      }`}
                    >
                      <List className="w-4 h-4 mr-2" />
                      <span>List</span>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-neutral-100 dark:border-dark-accent">
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  {isFiltered ? `${totalResults} results found` : `Showing all ${totalResults} cycles`}
                </div>
                
                <div className="flex items-center">
                  <button
                    onClick={() => setShowBookmarked(!showBookmarked)}
                    className={`inline-flex items-center px-3 py-1 text-sm rounded-lg ${
                      showBookmarked
                        ? isDark
                          ? 'bg-primary-500/20 text-primary-400'
                          : 'bg-primary-50 text-primary-500'
                        : isDark
                          ? 'bg-dark-accent text-neutral-400 hover:bg-dark-accent/70'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {showBookmarked ? <BookmarkCheck className="w-4 h-4 mr-2" /> : <Bookmark className="w-4 h-4 mr-2" />}
                    <span>Bookmarks ({bookmarkedCycles.length})</span>
                  </button>
                  
                  <button
                    onClick={() => updateFilters({ search: '', year: 'all', status: 'all' })}
                    className={`ml-3 inline-flex items-center px-3 py-1 text-sm rounded-lg ${
                      isDark
                        ? 'bg-dark-accent text-neutral-400 hover:bg-dark-accent/70'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                    disabled={!isFiltered}
                  >
                    <History className="w-4 h-4 mr-2" />
                    <span>Reset Filters</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Cycles Grid/List */}
          {hasResults ? (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {displayCycles.map(cycle => (
                <CycleCard 
                  key={cycle.id} 
                  cycle={cycle} 
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className={`text-center p-12 rounded-xl ${
              isDark ? 'bg-dark-100 border border-dark-accent' : 'bg-white border border-neutral-100'
            }`}>
              <AlertCircle className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-neutral-800 dark:text-white mb-2">No Cycles Found</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                No AIRAC cycles match your current search and filter criteria.
              </p>
              <button
                onClick={() => updateFilters({ search: '', year: 'all', status: 'all' })}
                className="btn-primary"
              >
                Reset Filters
              </button>
            </div>
          )}
          
          {/* Pagination */}
          {hasResults && pagination.totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updatePagination({ page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                  className={`p-2 rounded-lg ${
                    pagination.page === 1
                      ? 'text-neutral-400 cursor-not-allowed'
                      : isDark
                        ? 'text-neutral-300 hover:bg-dark-accent'
                        : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <span className="text-neutral-600 dark:text-neutral-300">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => updatePagination({ page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.totalPages}
                  className={`p-2 rounded-lg ${
                    pagination.page === pagination.totalPages
                      ? 'text-neutral-400 cursor-not-allowed'
                      : isDark
                        ? 'text-neutral-300 hover:bg-dark-accent'
                        : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`max-w-md w-full mx-4 p-6 rounded-xl ${
              isDark ? 'bg-dark-100 border border-dark-accent' : 'bg-white'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-medium text-neutral-800 dark:text-white">
                Keyboard Shortcuts
              </h3>
              <button
                onClick={() => setShowShortcuts(false)}
                className="p-1 rounded-lg text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${isDark ? 'bg-dark-accent/50' : 'bg-neutral-50'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-700 dark:text-neutral-300">Go to current cycle</span>
                  <span className={`px-2.5 py-1 rounded text-xs font-medium ${
                    isDark ? 'bg-dark-accent text-neutral-300' : 'bg-neutral-200 text-neutral-700'
                  }`}>c</span>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${isDark ? 'bg-dark-accent/50' : 'bg-neutral-50'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-700 dark:text-neutral-300">Toggle grid/list view</span>
                  <span className={`px-2.5 py-1 rounded text-xs font-medium ${
                    isDark ? 'bg-dark-accent text-neutral-300' : 'bg-neutral-200 text-neutral-700'
                  }`}>g</span>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${isDark ? 'bg-dark-accent/50' : 'bg-neutral-50'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-700 dark:text-neutral-300">Focus search</span>
                  <span className={`px-2.5 py-1 rounded text-xs font-medium ${
                    isDark ? 'bg-dark-accent text-neutral-300' : 'bg-neutral-200 text-neutral-700'
                  }`}>s</span>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${isDark ? 'bg-dark-accent/50' : 'bg-neutral-50'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-700 dark:text-neutral-300">Reset filters</span>
                  <span className={`px-2.5 py-1 rounded text-xs font-medium ${
                    isDark ? 'bg-dark-accent text-neutral-300' : 'bg-neutral-200 text-neutral-700'
                  }`}>r</span>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${isDark ? 'bg-dark-accent/50' : 'bg-neutral-50'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-700 dark:text-neutral-300">Show shortcuts</span>
                  <span className={`px-2.5 py-1 rounded text-xs font-medium ${
                    isDark ? 'bg-dark-accent text-neutral-300' : 'bg-neutral-200 text-neutral-700'
                  }`}>?</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowShortcuts(false)}
                className="btn-primary w-full"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  )
} 