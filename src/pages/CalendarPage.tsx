import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock,
  Download,
  PrinterIcon,
  Share2
} from 'lucide-react'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  isWithinInterval,
  startOfWeek,
  endOfWeek
} from 'date-fns'
import { useAirac } from '@/hooks/useAirac'
import type { AiracCycle } from '@/types/airac'

export function CalendarPage() {
  const { allCycles } = useAirac()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedCycle, setSelectedCycle] = useState<AiracCycle | null>(null)
  const [showExportMenu, setShowExportMenu] = useState(false)

  // Get calendar days for the current month
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const calendarStart = startOfWeek(monthStart)
    const calendarEnd = endOfWeek(monthEnd)
    
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd })
  }, [currentDate])

  // Get cycles for the current month
  const monthCycles = useMemo(() => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    
    return allCycles.filter(cycle => 
      isWithinInterval(cycle.startDate, { start: monthStart, end: monthEnd }) ||
      isWithinInterval(cycle.endDate, { start: monthStart, end: monthEnd }) ||
      (cycle.startDate <= monthStart && cycle.endDate >= monthEnd)
    )
  }, [allCycles, currentDate])

  // Find cycle for a specific day
  const getCycleForDay = (day: Date) => {
    return allCycles.find(cycle => 
      isWithinInterval(day, { start: cycle.startDate, end: cycle.endDate })
    )
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    )
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Export functions
  const exportCalendar = (exportFormat: 'csv' | 'ical' | 'json') => {
    const monthName = format(currentDate, 'MMMM-yyyy')
    
    let content = ''
    let mimeType = ''
    let filename = ''

    switch (exportFormat) {
      case 'csv':
        const csvHeader = 'Cycle,Start Date,End Date,Status,Days in Month\n'
        const csvRows = monthCycles.map(cycle => {
          const status = cycle.isCurrent ? 'Current' : cycle.isUpcoming ? 'Upcoming' : 'Past'
          return `${cycle.cycle},${format(cycle.startDate, 'yyyy-MM-dd')},${format(cycle.endDate, 'yyyy-MM-dd')},${status},${28}`
        }).join('\n')
        content = csvHeader + csvRows
        mimeType = 'text/csv'
        filename = `airac-calendar-${monthName}.csv`
        break

      case 'ical':
        const icalHeader = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//AIRAC Explorer//Calendar Export
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:AIRAC Cycles - ${format(currentDate, 'MMMM yyyy')}
X-WR-TIMEZONE:UTC
X-WR-CALDESC:AIRAC Cycle dates for ${format(currentDate, 'MMMM yyyy')}
`
        const icalEvents = monthCycles.map(cycle => {
          const startDateStr = format(cycle.startDate, 'yyyyMMdd')
          const endDateStr = format(cycle.endDate, 'yyyyMMdd')
          return `BEGIN:VEVENT
UID:airac-${cycle.cycle}@airac-explorer.com
DTSTART;VALUE=DATE:${startDateStr}
DTEND;VALUE=DATE:${endDateStr}
SUMMARY:AIRAC Cycle ${cycle.cycle}
DESCRIPTION:AIRAC Cycle ${cycle.cycle} - Cycle ${cycle.cycleNumber} of ${cycle.year}\\nStatus: ${cycle.isCurrent ? 'Current' : cycle.isUpcoming ? 'Upcoming' : 'Past'}
CATEGORIES:AIRAC,Aviation
TRANSP:TRANSPARENT
END:VEVENT`
        }).join('\n')
        content = icalHeader + icalEvents + '\nEND:VCALENDAR'
        mimeType = 'text/calendar'
        filename = `airac-calendar-${monthName}.ics`
        break

      case 'json':
        const jsonData = {
          month: format(currentDate, 'MMMM yyyy'),
          exportDate: new Date().toISOString(),
          totalCycles: monthCycles.length,
          cycles: monthCycles.map(cycle => ({
            cycle: cycle.cycle,
            year: cycle.year,
            cycleNumber: cycle.cycleNumber,
            startDate: format(cycle.startDate, 'yyyy-MM-dd'),
            endDate: format(cycle.endDate, 'yyyy-MM-dd'),
            status: cycle.isCurrent ? 'current' : cycle.isUpcoming ? 'upcoming' : 'past',
            daysSinceStart: cycle.daysSinceStart || null,
            daysUntilEnd: cycle.daysUntilEnd || null
          }))
        }
        content = JSON.stringify(jsonData, null, 2)
        mimeType = 'application/json'
        filename = `airac-calendar-${monthName}.json`
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
    setShowExportMenu(false)
  }

  const printCalendar = () => {
    window.print()
    setShowExportMenu(false)
  }

  const shareCalendar = async () => {
    const shareData = {
      title: `AIRAC Calendar - ${format(currentDate, 'MMMM yyyy')}`,
      text: `AIRAC Cycles for ${format(currentDate, 'MMMM yyyy')} - ${monthCycles.length} cycles`,
      url: window.location.href
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
        alert('Calendar info copied to clipboard!')
      } catch (err) {
        console.log('Error copying to clipboard:', err)
      }
    }
    setShowExportMenu(false)
  }

  const getDayClasses = (day: Date, cycle?: AiracCycle) => {
    const baseClasses = "min-h-[120px] p-2 border border-gray-100 dark:border-gray-700 cursor-pointer transition-all duration-200"
    const isCurrentMonth = isSameMonth(day, currentDate)
    const isToday = isSameDay(day, new Date())
    const isCycleStart = cycle && isSameDay(day, cycle.startDate)
    const isCycleEnd = cycle && isSameDay(day, cycle.endDate)
    
    let classes = baseClasses
    
    if (!isCurrentMonth) {
      classes += " text-gray-400 bg-gray-50 dark:bg-gray-800/50"
    } else {
      classes += " bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
    }
    
    if (isToday) {
      classes += " ring-2 ring-primary-500"
    }
    
    if (cycle) {
      if (cycle.isCurrent) {
        classes += " bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20"
      } else if (cycle.isUpcoming) {
        classes += " bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
      }
    }
    
    if (isCycleStart) {
      classes += " border-l-4 border-l-primary-500"
    }
    
    if (isCycleEnd) {
      classes += " border-r-4 border-r-accent-500"
    }
    
    return classes
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
            AIRAC Calendar
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Visual calendar view of all AIRAC cycles with start and end dates highlighted
          </p>
        </motion.div>

        {/* Calendar Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card mb-8"
        >
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Month Navigation */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="btn-secondary p-2"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white min-w-[200px] text-center">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                
                <button
                  onClick={() => navigateMonth('next')}
                  className="btn-secondary p-2"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={goToToday}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>Today</span>
                </button>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                  
                  {showExportMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute right-0 top-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-48"
                    >
                      <div className="p-2">
                        <button
                          onClick={() => exportCalendar('csv')}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export CSV</span>
                        </button>
                        <button
                          onClick={() => exportCalendar('ical')}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export Calendar</span>
                        </button>
                        <button
                          onClick={() => exportCalendar('json')}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <Download className="w-4 h-4" />
                          <span>Export JSON</span>
                        </button>
                        <button
                          onClick={printCalendar}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <PrinterIcon className="w-4 h-4" />
                          <span>Print</span>
                        </button>
                        <button
                          onClick={shareCalendar}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>Share</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border border-gray-300 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Current Cycle</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-gray-300 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Upcoming Cycle</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-l-4 border-l-primary-500 bg-white dark:bg-gray-800 border border-gray-300 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Cycle Start</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-r-4 border-r-accent-500 bg-white dark:bg-gray-800 border border-gray-300 rounded"></div>
                  <span className="text-gray-600 dark:text-gray-400">Cycle End</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card"
        >
          <div className="p-6">
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-0 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="p-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-0">
              {calendarDays.map((day) => {
                const cycle = getCycleForDay(day)
                const isCurrentMonth = isSameMonth(day, currentDate)
                const isToday = isSameDay(day, new Date())
                const isCycleStart = cycle && isSameDay(day, cycle.startDate)
                const isCycleEnd = cycle && isSameDay(day, cycle.endDate)
                
                return (
                  <div
                    key={day.toISOString()}
                    className={getDayClasses(day, cycle)}
                    onClick={() => cycle && setSelectedCycle(cycle)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm font-medium ${
                        isToday ? 'text-primary-600 dark:text-primary-400' : 
                        isCurrentMonth ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                      }`}>
                        {format(day, 'd')}
                      </span>
                      {isToday && (
                        <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                      )}
                    </div>
                    
                    {cycle && isCurrentMonth && (
                      <div className="space-y-1">
                        {isCycleStart && (
                          <div className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                            Start: {cycle.cycle}
                          </div>
                        )}
                        {isCycleEnd && (
                          <div className="text-xs font-semibold text-accent-600 dark:text-accent-400">
                            End: {cycle.cycle}
                          </div>
                        )}
                        {!isCycleStart && !isCycleEnd && (
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {cycle.cycle}
                          </div>
                        )}
                        
                        {cycle.isCurrent && (
                          <span className="inline-block px-1.5 py-0.5 bg-primary-500 text-white text-xs rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Month Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="card">
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {monthCycles.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Cycles in {format(currentDate, 'MMMM')}
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-accent-600 dark:text-accent-400 mb-2">
                {monthCycles.filter(c => c.isCurrent).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Current Cycles
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                {monthCycles.filter(c => c.isUpcoming).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Upcoming Cycles
              </div>
            </div>
          </div>
        </motion.div>

        {/* Selected Cycle Modal */}
        {selectedCycle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedCycle(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="card max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Cycle {selectedCycle.cycle}
                  </h3>
                  <button
                    onClick={() => setSelectedCycle(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Start Date</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {format(selectedCycle.startDate, 'EEEE, MMMM dd, yyyy')}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">End Date</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {format(selectedCycle.endDate, 'EEEE, MMMM dd, yyyy')}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
                    <div className="flex items-center space-x-2">
                      {selectedCycle.isCurrent && (
                        <span className="badge-success">Current</span>
                      )}
                      {selectedCycle.isUpcoming && (
                        <span className="badge-warning">Upcoming</span>
                      )}
                      {!selectedCycle.isCurrent && !selectedCycle.isUpcoming && (
                        <span className="badge-neutral">Past</span>
                      )}
                    </div>
                  </div>
                  
                  {selectedCycle.isCurrent && (
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Progress</div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {selectedCycle.daysSinceStart} days elapsed, {selectedCycle.daysUntilEnd} days remaining
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
} 