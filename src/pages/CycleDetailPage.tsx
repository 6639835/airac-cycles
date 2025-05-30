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
  ExternalLink
} from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { useAirac } from '@/hooks/useAirac'
import type { AiracCycle } from '@/types/airac'

export function CycleDetailPage() {
  const { cycleId } = useParams<{ cycleId: string }>()
  const navigate = useNavigate()
  const { allCycles, stats } = useAirac()
  
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Cycle Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The requested AIRAC cycle could not be found.
          </p>
          <Link to="/" className="btn-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="btn-secondary flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className="flex items-center space-x-2">
            {previousCycle && (
              <Link
                to={`/cycle/${previousCycle.id}`}
                className="btn-secondary p-2"
                title={`Previous: ${previousCycle.cycle}`}
              >
                <ChevronLeft className="w-4 h-4" />
              </Link>
            )}
            
            {nextCycle && (
              <Link
                to={`/cycle/${nextCycle.id}`}
                className="btn-secondary p-2"
                title={`Next: ${nextCycle.cycle}`}
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card mb-8 relative overflow-hidden"
        >
          {cycle.isCurrent && (
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10" />
          )}
          
          <div className="relative p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="flex items-center space-x-6">
                <div className="bg-primary-500 p-4 rounded-2xl">
                  <Plane className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    AIRAC {cycle.cycle}
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Cycle {cycle.cycleNumber} of {cycle.year}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    {cycle.isCurrent && (
                      <span className="badge-success">Current Cycle</span>
                    )}
                    {cycle.isUpcoming && (
                      <span className="badge-warning">Upcoming</span>
                    )}
                    {!cycle.isCurrent && !cycle.isUpcoming && (
                      <span className="badge-neutral">Past</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={toggleBookmark}
                  className="btn-secondary p-2"
                  title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShareMenuOpen(!shareMenuOpen)}
                    className="btn-secondary p-2"
                    title="Share"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                  
                  {shareMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-0 top-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-48"
                    >
                      <div className="p-2">
                        <button
                          onClick={() => copyToClipboard(shareUrl)}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          <span>{copied ? 'Copied!' : 'Copy URL'}</span>
                        </button>
                        <button
                          onClick={() => window.open(`https://twitter.com/intent/tweet?text=AIRAC Cycle ${cycle.cycle}&url=${shareUrl}`, '_blank')}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Share on Twitter</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>

                <button
                  onClick={printPage}
                  className="btn-secondary p-2"
                  title="Print"
                >
                  <PrinterIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Dates & Duration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="card"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Cycle Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Calendar className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Start Date</div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {format(cycle.startDate, 'EEEE, MMMM dd, yyyy')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(cycle.startDate, 'HH:mm')} UTC
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Calendar className="w-5 h-5 text-red-500" />
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">End Date</div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {format(cycle.endDate, 'EEEE, MMMM dd, yyyy')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(cycle.endDate, 'HH:mm')} UTC
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Clock className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {cycleDuration} days
                        </div>
                        <div className="text-xs text-gray-500">
                          Standard AIRAC cycle
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-purple-500" />
                      <div className="flex-1">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {cycle.isCurrent ? 'Progress' : cycle.isUpcoming ? 'Future Cycle' : 'Completed Cycle'}
                        </div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {Math.round(progressPercentage)}%
                          {cycle.isCurrent && ' Complete'}
                          {cycle.isUpcoming && ' (Not Started)'}
                          {!cycle.isCurrent && !cycle.isUpcoming && ' (Finished)'}
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${
                              cycle.isCurrent ? 'bg-purple-500' : 
                              cycle.isUpcoming ? 'bg-yellow-500' : 'bg-green-500'
                            }`}
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {cycle.isCurrent && (
                  <div className="mt-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                          {cycle.daysSinceStart || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Days Elapsed
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                          {cycle.daysUntilEnd || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Days Remaining
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Export Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="card"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Export & Integration
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => exportData('json')}
                    className="btn-secondary flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>JSON</span>
                  </button>
                  
                  <button
                    onClick={() => exportData('csv')}
                    className="btn-secondary flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>CSV</span>
                  </button>
                  
                  <button
                    onClick={() => exportData('ical')}
                    className="btn-secondary flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Calendar (.ics)</span>
                  </button>
                </div>
                
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Direct URL:</div>
                  <div className="flex items-center space-x-2">
                    <code className="flex-1 px-2 py-1 bg-white dark:bg-gray-900 border rounded text-xs font-mono">
                      {shareUrl}
                    </code>
                    <button
                      onClick={() => copyToClipboard(shareUrl)}
                      className="btn-secondary p-1"
                      title="Copy URL"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Context & Navigation */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="card"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Context
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Year</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {cycle.year}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Cycle of Year</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {cycle.cycleNumber} of 13
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Cycles</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {stats.totalCycles}
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-accent-500 h-2 rounded-full"
                      style={{ width: `${(cycle.cycleNumber / 13) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Related Cycles */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="card"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Navigation
                </h3>
                
                <div className="space-y-3">
                  {previousCycle && (
                    <Link
                      to={`/cycle/${previousCycle.id}`}
                      className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4 text-gray-400" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {previousCycle.cycle}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(previousCycle.startDate, 'MMM dd, yyyy')}
                        </div>
                      </div>
                    </Link>
                  )}
                  
                  {nextCycle && (
                    <Link
                      to={`/cycle/${nextCycle.id}`}
                      className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {nextCycle.cycle}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(nextCycle.startDate, 'MMM dd, yyyy')}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </Link>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    to="/calendar"
                    className="btn-secondary w-full flex items-center justify-center space-x-2"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>View in Calendar</span>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* AIRAC Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="card"
            >
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Info className="w-5 h-5 text-blue-500" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    About AIRAC
                  </h3>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  AIRAC cycles ensure synchronized worldwide updates of aeronautical 
                  information every 28 days, maintaining safety and consistency in 
                  international aviation.
                </p>
                
                <Link
                  to="/about"
                  className="text-primary-600 dark:text-primary-400 text-sm hover:underline"
                >
                  Learn more about AIRAC →
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
} 