import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Calendar, 
  Clock, 
  ArrowLeft, 
  Download,
  Share2,
  Bookmark,
  BookmarkCheck,
  Plane,
  Info,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  PrinterIcon,
  ExternalLink,
  AlertTriangle
} from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { useAirac } from '@/hooks/useAirac'
import type { AiracCycle } from '@/types/airac'
import { useTheme } from '@/contexts/ThemeContext'

export function CycleDetailPage() {
  const { cycleId } = useParams<{ cycleId: string }>()
  const navigate = useNavigate()
  const { allCycles, stats } = useAirac()
  const { isDark } = useTheme()
  
  const [cycle, setCycle] = useState<AiracCycle | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [shareMenuOpen, setShareMenuOpen] = useState(false)

  // Scroll to top when component mounts or cycleId changes
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [cycleId])

  // Find the cycle and related cycles
  useEffect(() => {
    if (cycleId && allCycles.length > 0) {
      // Try to find by exact ID match first, then by cycle identifier
      let foundCycle = allCycles.find(c => c.id === cycleId)
      
      if (!foundCycle) {
        foundCycle = allCycles.find(c => c.cycle === cycleId)
      }
      
      // If still not found, try parsing as cycle identifier (e.g., "2501" -> year 2025, cycle 1)
      if (!foundCycle && /^\d{4}$/.test(cycleId)) {
        const year = 2000 + parseInt(cycleId.substring(0, 2))
        const cycleNumber = parseInt(cycleId.substring(2))
        foundCycle = allCycles.find(c => c.year === year && c.cycleNumber === cycleNumber)
      }
      
      setCycle(foundCycle || null)
      
      // Check if bookmarked (from localStorage)
      if (foundCycle) {
        const bookmarks = JSON.parse(localStorage.getItem('airac-bookmarks') || '[]')
        setIsBookmarked(bookmarks.includes(foundCycle.id) || bookmarks.includes(foundCycle.cycle))
      }
    }
  }, [cycleId, allCycles])

  if (!cycle) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-dark-gradient' : 'bg-gradient-to-br from-neutral-50 to-neutral-100'
      }`}>
        <div className="subtle-noise" aria-hidden="true"></div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className={`max-w-md p-8 rounded-xl text-center ${
            isDark ? 'bg-dark-100 border border-dark-accent shadow-dark-medium' : 'bg-white shadow-medium'
          }`}
        >
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-amber-500" />
          <h1 className="text-2xl font-semibold text-neutral-800 dark:text-white mb-4">
            Cycle Not Found
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            The requested AIRAC cycle could not be found or does not exist.
          </p>
          <Link to="/" className={`btn-primary inline-flex items-center justify-center ${
            isDark ? 'shadow-glow' : ''
          }`}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    )
  }

  // Navigation functions
  const getPreviousCycle = () => {
    const currentIndex = allCycles.findIndex(c => c.id === cycle.id)
    return currentIndex > 0 ? allCycles[currentIndex - 1] : null
  }

  const getNextCycle = () => {
    const currentIndex = allCycles.findIndex(c => c.id === cycle.id)
    return currentIndex < allCycles.length - 1 ? allCycles[currentIndex + 1] : null
  }

  // Utility functions
  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('airac-bookmarks') || '[]')
    let newBookmarks
    
    if (isBookmarked) {
      newBookmarks = bookmarks.filter((id: string) => id !== cycle.id && id !== cycle.cycle)
    } else {
      newBookmarks = [...bookmarks, cycle.id, cycle.cycle]
    }
    
    localStorage.setItem('airac-bookmarks', JSON.stringify(newBookmarks))
    setIsBookmarked(!isBookmarked)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const shareUrl = `${window.location.origin}/cycle/${cycle.id}`
  
  const exportData = (exportFormat: 'json' | 'csv' | 'ical') => {
    const data = {
      cycle: cycle.cycle,
      year: cycle.year,
      cycleNumber: cycle.cycleNumber,
      startDate: format(cycle.startDate, 'yyyy-MM-dd'),
      endDate: format(cycle.endDate, 'yyyy-MM-dd'),
      status: cycle.isCurrent ? 'current' : cycle.isUpcoming ? 'upcoming' : 'past'
    }

    let content = ''
    let mimeType = ''
    let filename = ''

    switch (exportFormat) {
      case 'json':
        content = JSON.stringify(data, null, 2)
        mimeType = 'application/json'
        filename = `airac-${cycle.cycle}.json`
        break
      case 'csv':
        content = `Cycle,Year,Cycle Number,Start Date,End Date,Status\n${data.cycle},${data.year},${data.cycleNumber},${data.startDate},${data.endDate},${data.status}`
        mimeType = 'text/csv'
        filename = `airac-${cycle.cycle}.csv`
        break
      case 'ical':
        content = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AIRAC Explorer//EN
BEGIN:VEVENT
UID:airac-${cycle.cycle}@airac-explorer.com
DTSTART:${format(cycle.startDate, 'yyyyMMdd')}
DTEND:${format(cycle.endDate, 'yyyyMMdd')}
SUMMARY:AIRAC Cycle ${cycle.cycle}
DESCRIPTION:AIRAC Cycle ${cycle.cycle} (${cycle.year} - Cycle ${cycle.cycleNumber})
END:VEVENT
END:VCALENDAR`
        mimeType = 'text/calendar'
        filename = `airac-${cycle.cycle}.ics`
        break
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const printPage = () => {
    window.print()
  }

  const previousCycle = getPreviousCycle()
  const nextCycle = getNextCycle()
  const cycleDuration = differenceInDays(cycle.endDate, cycle.startDate) + 1
  
  // Calculate progress percentage based on cycle status
  const progressPercentage = (() => {
    if (cycle.isCurrent) {
      // For current cycles, calculate actual progress
      if (cycle.daysSinceStart !== undefined && cycle.daysUntilEnd !== undefined && 
          cycle.daysSinceStart >= 0 && cycle.daysUntilEnd >= 0) {
        return (cycle.daysSinceStart / (cycle.daysSinceStart + cycle.daysUntilEnd)) * 100
      }
      return 50 // Fallback for current cycles
    } else if (cycle.isUpcoming) {
      // Future cycles have 0% progress
      return 0
    } else {
      // Past cycles have 100% progress
      return 100
    }
  })()

  return (
    <div className={`min-h-screen ${
      isDark ? 'bg-dark-gradient' : 'bg-gradient-to-br from-neutral-50 to-neutral-100'
    }`}>
      <div className="subtle-noise" aria-hidden="true"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb & Actions */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link 
                to="/"
                className={`inline-flex items-center text-sm font-medium mb-2 focus-ring rounded-lg ${
                  isDark ? 'text-neutral-300 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span>Back to all cycles</span>
              </Link>
              <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white">
                AIRAC Cycle <span className="text-primary-500 dark:text-primary-400">{cycle.cycle}</span>
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex items-center space-x-2 no-print"
            >
              <button
                onClick={toggleBookmark}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isBookmarked 
                    ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' 
                    : isDark 
                      ? 'bg-dark-accent text-neutral-400 hover:text-neutral-300' 
                      : 'bg-white text-neutral-500 hover:text-neutral-700 shadow-soft'
                }`}
                title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
              >
                {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShareMenuOpen(!shareMenuOpen)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isDark 
                      ? 'bg-dark-accent text-neutral-400 hover:text-neutral-300' 
                      : 'bg-white text-neutral-500 hover:text-neutral-700 shadow-soft'
                  }`}
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                
                {shareMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className={`absolute right-0 top-12 w-64 z-10 rounded-xl py-2 ${
                      isDark ? 'bg-dark-100 border border-dark-accent shadow-dark-medium' : 'bg-white shadow-medium'
                    }`}
                  >
                    <div className="px-3 py-2 border-b border-neutral-100 dark:border-dark-accent">
                      <div className="text-sm font-medium text-neutral-800 dark:text-white">Share Cycle</div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center mb-2">
                        <input
                          type="text"
                          readOnly
                          value={shareUrl}
                          className="input text-xs py-1.5 h-auto"
                          onClick={(e) => e.currentTarget.select()}
                        />
                        <button
                          onClick={() => copyToClipboard(shareUrl)}
                          className={`p-1.5 rounded ml-1 ${
                            isDark ? 'bg-dark-accent hover:bg-primary-900/30' : 'bg-neutral-100 hover:bg-neutral-200'
                          }`}
                        >
                          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-neutral-500" />}
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        <button
                          onClick={() => exportData('json')}
                          className={`p-2 rounded-lg text-xs font-medium ${
                            isDark 
                              ? 'bg-dark-accent text-neutral-300 hover:bg-dark-accent/70' 
                              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                          }`}
                        >
                          JSON
                        </button>
                        <button
                          onClick={() => exportData('csv')}
                          className={`p-2 rounded-lg text-xs font-medium ${
                            isDark 
                              ? 'bg-dark-accent text-neutral-300 hover:bg-dark-accent/70' 
                              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                          }`}
                        >
                          CSV
                        </button>
                        <button
                          onClick={() => exportData('ical')}
                          className={`p-2 rounded-lg text-xs font-medium ${
                            isDark 
                              ? 'bg-dark-accent text-neutral-300 hover:bg-dark-accent/70' 
                              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                          }`}
                        >
                          iCal
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
              
              <button
                onClick={printPage}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDark 
                    ? 'bg-dark-accent text-neutral-400 hover:text-neutral-300' 
                    : 'bg-white text-neutral-500 hover:text-neutral-700 shadow-soft'
                }`}
                title="Print"
              >
                <PrinterIcon className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Cycle Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-2"
          >
            <div className={`card overflow-hidden ${
              cycle.isCurrent ? 'border-l-4 border-l-primary-500' : ''
            }`}>
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                      AIRAC Cycle
                    </div>
                    <h2 className="text-3xl font-semibold text-primary-500 dark:text-primary-400">
                      {cycle.cycle}
                    </h2>
                    <div className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
                      {cycle.year} &middot; Cycle {cycle.cycleNumber}
                    </div>
                  </div>
                  
                  <div>
                    {cycle.isCurrent && (
                      <span className="badge-success">Current</span>
                    )}
                    {cycle.isUpcoming && (
                      <span className="badge-warning">Upcoming</span>
                    )}
                    {!cycle.isCurrent && !cycle.isUpcoming && (
                      <span className="badge-neutral">Past</span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className={`p-4 rounded-lg ${
                    isDark ? 'bg-dark-accent/50' : 'bg-neutral-50'
                  }`}>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isDark ? 'bg-dark-accent' : 'bg-primary-50 dark:bg-primary-900/20'
                      }`}>
                        <Calendar className="w-5 h-5 text-primary-500 dark:text-primary-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-neutral-800 dark:text-white">
                          Start Date
                        </div>
                        <div className="text-xl font-medium text-neutral-900 dark:text-white">
                          {format(cycle.startDate, 'MMMM d, yyyy')}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          {format(cycle.startDate, 'EEEE')}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${
                    isDark ? 'bg-dark-accent/50' : 'bg-neutral-50'
                  }`}>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isDark ? 'bg-dark-accent' : 'bg-primary-50 dark:bg-primary-900/20'
                      }`}>
                        <Calendar className="w-5 h-5 text-primary-500 dark:text-primary-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-neutral-800 dark:text-white">
                          End Date
                        </div>
                        <div className="text-xl font-medium text-neutral-900 dark:text-white">
                          {format(cycle.endDate, 'MMMM d, yyyy')}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          {format(cycle.endDate, 'EEEE')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Cycle Progress */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {cycle.isCurrent 
                        ? 'Current Progress' 
                        : cycle.isUpcoming 
                          ? 'Starts in the future' 
                          : 'Complete'
                      }
                    </div>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      {Math.round(progressPercentage)}%
                    </div>
                  </div>
                  
                  <div className={`relative h-2 w-full rounded-full overflow-hidden ${
                    isDark ? 'bg-dark-accent' : 'bg-neutral-100'
                  }`}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercentage}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className={`absolute top-0 left-0 h-full rounded-full ${
                        cycle.isCurrent 
                          ? isDark ? 'bg-primary-500 shadow-glow' : 'bg-primary-500'
                          : cycle.isUpcoming 
                            ? 'bg-amber-500' 
                            : 'bg-neutral-500'
                      }`}
                    />
                  </div>
                </div>
                
                {/* Timing Information */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className={`p-4 rounded-lg ${
                    isDark ? 'bg-dark-accent/50' : 'bg-neutral-50'
                  }`}>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                      Duration
                    </div>
                    <div className="text-2xl font-medium text-neutral-900 dark:text-white">
                      {cycleDuration} days
                    </div>
                  </div>
                  
                  <div className={`p-4 rounded-lg ${
                    isDark ? 'bg-dark-accent/50' : 'bg-neutral-50'
                  }`}>
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                      {cycle.isCurrent ? 'Remaining' : cycle.isUpcoming ? 'Starts In' : 'Ended'}
                    </div>
                    <div className="text-2xl font-medium text-neutral-900 dark:text-white">
                      {cycle.isCurrent 
                        ? `${cycle.daysUntilEnd} days` 
                        : cycle.isUpcoming 
                          ? `${Math.abs(cycle.daysSinceStart || 0)} days` 
                          : `${cycle.daysSinceStart || 0} days ago`
                      }
                    </div>
                  </div>
                </div>
                
                {/* Cycle Navigation */}
                <div className={`flex justify-between pt-4 ${
                  isDark ? 'border-t border-dark-accent' : 'border-t border-neutral-100'
                }`}>
                  {previousCycle ? (
                    <Link 
                      to={`/cycle/${previousCycle.id}`} 
                      className={`flex items-center text-sm font-medium ${
                        isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      <span>Previous: {previousCycle.cycle}</span>
                    </Link>
                  ) : (
                    <div></div>
                  )}
                  
                  {nextCycle && (
                    <Link 
                      to={`/cycle/${nextCycle.id}`} 
                      className={`flex items-center text-sm font-medium ${
                        isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      <span>Next: {nextCycle.cycle}</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="space-y-6">
              {/* Technical Details */}
              <div className="card p-6">
                <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-4">
                  Technical Details
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">ID</span>
                    <span className="text-sm font-medium text-neutral-800 dark:text-white">{cycle.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">Identifier</span>
                    <span className="text-sm font-medium text-neutral-800 dark:text-white">{cycle.cycle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">Year</span>
                    <span className="text-sm font-medium text-neutral-800 dark:text-white">{cycle.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">Cycle Number</span>
                    <span className="text-sm font-medium text-neutral-800 dark:text-white">{cycle.cycleNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-neutral-500 dark:text-neutral-400">Status</span>
                    <span className="text-sm font-medium text-neutral-800 dark:text-white">
                      {cycle.isCurrent ? 'Current' : cycle.isUpcoming ? 'Upcoming' : 'Past'}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Related Links */}
              <div className="card p-6">
                <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-4">
                  Navigation
                </h3>
                
                <div className="space-y-3">
                  <Link
                    to="/"
                    className={`flex items-center py-2 px-3 rounded-lg transition-colors ${
                      isDark 
                        ? 'bg-dark-accent text-neutral-300 hover:text-white' 
                        : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <Plane className="w-4 h-4 mr-3" />
                    <span className="text-sm font-medium">All Cycles</span>
                  </Link>
                  
                  <Link
                    to="/calendar"
                    className={`flex items-center py-2 px-3 rounded-lg transition-colors ${
                      isDark 
                        ? 'bg-dark-accent text-neutral-300 hover:text-white' 
                        : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <Calendar className="w-4 h-4 mr-3" />
                    <span className="text-sm font-medium">Calendar View</span>
                  </Link>
                  
                  <Link
                    to="/analytics"
                    className={`flex items-center py-2 px-3 rounded-lg transition-colors ${
                      isDark 
                        ? 'bg-dark-accent text-neutral-300 hover:text-white' 
                        : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 mr-3" />
                    <span className="text-sm font-medium">Analytics</span>
                  </Link>
                  
                  <Link
                    to="/about"
                    className={`flex items-center py-2 px-3 rounded-lg transition-colors ${
                      isDark 
                        ? 'bg-dark-accent text-neutral-300 hover:text-white' 
                        : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
                    }`}
                  >
                    <Info className="w-4 h-4 mr-3" />
                    <span className="text-sm font-medium">About AIRAC</span>
                  </Link>
                </div>
              </div>
              
              {/* Information */}
              <div className={`p-5 rounded-xl ${
                isDark ? 'bg-dark-accent/50' : 'bg-amber-50 dark:bg-amber-900/20'
              }`}>
                <div className="flex items-start">
                  <Info className={`w-5 h-5 mt-0.5 mr-3 ${
                    isDark ? 'text-amber-400' : 'text-amber-500'
                  }`} />
                  <div>
                    <h4 className={`text-sm font-medium mb-1 ${
                      isDark ? 'text-white' : 'text-amber-800 dark:text-amber-400'
                    }`}>
                      Important Notice
                    </h4>
                    <p className={`text-xs ${
                      isDark ? 'text-neutral-300' : 'text-amber-700 dark:text-amber-300'
                    }`}>
                      For operational use, always refer to official aviation authority sources. 
                      This tool is for reference and educational purposes only.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* External Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-12 no-print"
        >
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
            Related Resources
          </h2>
          
          <div className={`p-6 rounded-xl ${
            isDark ? 'bg-dark-100 border border-dark-accent' : 'bg-white shadow-medium'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a 
                href="https://www.faa.gov/air_traffic/flight_info/aeronav/aero_data/NASR_Subscription/" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex items-center p-4 rounded-lg ${
                  isDark 
                    ? 'bg-dark-accent hover:bg-dark-accent/70' 
                    : 'bg-neutral-50 hover:bg-neutral-100'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isDark ? 'bg-primary-900/30' : 'bg-primary-50'
                }`}>
                  <ExternalLink className="w-6 h-6 text-primary-500 dark:text-primary-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-neutral-800 dark:text-white">
                    FAA NASR Data
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Official FAA Aeronautical Data
                  </p>
                </div>
              </a>
              
              <a 
                href="https://www.eurocontrol.int/service/european-ais-database" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex items-center p-4 rounded-lg ${
                  isDark 
                    ? 'bg-dark-accent hover:bg-dark-accent/70' 
                    : 'bg-neutral-50 hover:bg-neutral-100'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isDark ? 'bg-primary-900/30' : 'bg-primary-50'
                }`}>
                  <ExternalLink className="w-6 h-6 text-primary-500 dark:text-primary-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-neutral-800 dark:text-white">
                    EAD System
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    European AIS Database
                  </p>
                </div>
              </a>
              
              <a 
                href="https://www.icao.int/safety/information-management/Pages/default.aspx" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`flex items-center p-4 rounded-lg ${
                  isDark 
                    ? 'bg-dark-accent hover:bg-dark-accent/70' 
                    : 'bg-neutral-50 hover:bg-neutral-100'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isDark ? 'bg-primary-900/30' : 'bg-primary-50'
                }`}>
                  <ExternalLink className="w-6 h-6 text-primary-500 dark:text-primary-400" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-neutral-800 dark:text-white">
                    ICAO Information Management
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Official ICAO Standards
                  </p>
                </div>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 