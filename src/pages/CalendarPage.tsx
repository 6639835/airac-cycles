import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock,
  Download,
  PrinterIcon,
  Share2,
  Calendar as CalendarIcon,
  Info,
  ArrowRight,
  Check,
  Copy
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
  endOfWeek,
  isToday,
  parseISO
} from 'date-fns'
import { useAirac } from '@/hooks/useAirac'
import type { AiracCycle } from '@/types/airac'
import { useTheme } from '@/contexts/ThemeContext'

export function CalendarPage() {
  const { allCycles } = useAirac()
  const { isDark } = useTheme()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedCycle, setSelectedCycle] = useState<AiracCycle | null>(null)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [copied, setCopied] = useState(false)

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

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
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
        await copyToClipboard(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
      } catch (err) {
        console.log('Error copying to clipboard:', err)
      }
    }
    setShowExportMenu(false)
  }

  return (
    <div className={`min-h-screen ${
      isDark ? 'bg-dark-gradient' : 'bg-gradient-to-br from-neutral-50 to-neutral-100'
    }`}>
      <div className="subtle-noise" aria-hidden="true"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <h1 className="text-3xl font-semibold text-neutral-900 dark:text-white mb-1">
                AIRAC Calendar
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Visual calendar for AIRAC cycle planning and scheduling
              </p>
            </div>
            
            <div className="flex items-center space-x-2 no-print">
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    isDark 
                      ? 'bg-dark-accent text-neutral-400 hover:text-neutral-300' 
                      : 'bg-white text-neutral-500 hover:text-neutral-700 shadow-soft'
                  }`}
                  title="Export"
                >
                  <Download className="w-5 h-5" />
                </button>
                
                {showExportMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className={`absolute right-0 top-12 w-48 z-10 rounded-xl py-2 ${
                      isDark ? 'bg-dark-100 border border-dark-accent shadow-dark-medium' : 'bg-white shadow-medium'
                    }`}
                  >
                    <div className="px-3 py-2 border-b border-neutral-100 dark:border-dark-accent">
                      <div className="text-sm font-medium text-neutral-800 dark:text-white">Export Calendar</div>
                    </div>
                    <div className="p-2">
                      <button 
                        onClick={() => exportCalendar('json')}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          isDark 
                            ? 'text-neutral-300 hover:bg-dark-accent/70' 
                            : 'text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        Export as JSON
                      </button>
                      <button 
                        onClick={() => exportCalendar('csv')}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          isDark 
                            ? 'text-neutral-300 hover:bg-dark-accent/70' 
                            : 'text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        Export as CSV
                      </button>
                      <button 
                        onClick={() => exportCalendar('ical')}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          isDark 
                            ? 'text-neutral-300 hover:bg-dark-accent/70' 
                            : 'text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        Export as iCalendar
                      </button>
                      <button 
                        onClick={printCalendar}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          isDark 
                            ? 'text-neutral-300 hover:bg-dark-accent/70' 
                            : 'text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        Print Calendar
                      </button>
                      <button 
                        onClick={shareCalendar}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          isDark 
                            ? 'text-neutral-300 hover:bg-dark-accent/70' 
                            : 'text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        Share Calendar
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
              
              <button
                onClick={printCalendar}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDark 
                    ? 'bg-dark-accent text-neutral-400 hover:text-neutral-300' 
                    : 'bg-white text-neutral-500 hover:text-neutral-700 shadow-soft'
                }`}
                title="Print"
              >
                <PrinterIcon className="w-5 h-5" />
              </button>
              
              <button
                onClick={shareCalendar}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isDark 
                    ? 'bg-dark-accent text-neutral-400 hover:text-neutral-300' 
                    : 'bg-white text-neutral-500 hover:text-neutral-700 shadow-soft'
                }`}
                title="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Calendar Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`flex items-center justify-between mb-6 p-4 rounded-xl ${
            isDark ? 'bg-dark-100 border border-dark-accent' : 'bg-white shadow-soft'
          }`}
        >
          <button
            onClick={() => navigateMonth('prev')}
            className={`p-2 rounded-lg transition-colors ${
              isDark 
                ? 'bg-dark-accent text-neutral-400 hover:text-neutral-300' 
                : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100'
            }`}
            title="Previous Month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <h2 className="text-xl font-medium text-neutral-800 dark:text-white">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="text-sm text-neutral-500 dark:text-neutral-400">
              {monthCycles.length} AIRAC cycles
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={goToToday}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                isDark 
                  ? 'bg-dark-accent text-neutral-300 hover:bg-dark-accent/70' 
                  : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Today
            </button>
            
            <button
              onClick={() => navigateMonth('next')}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'bg-dark-accent text-neutral-400 hover:text-neutral-300' 
                  : 'bg-neutral-50 text-neutral-500 hover:bg-neutral-100'
              }`}
              title="Next Month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
        
        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, i) => (
              <div 
                key={day} 
                className={`text-center font-medium py-2 ${
                  isDark ? 'text-neutral-300' : 'text-neutral-700'
                } ${i === 0 || i === 6 ? isDark ? 'text-neutral-400' : 'text-neutral-500' : ''}`}
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className={`grid grid-cols-7 rounded-xl overflow-hidden border ${
            isDark ? 'border-dark-accent' : 'border-neutral-200'
          }`}>
            {calendarDays.map((day, index) => {
              const isSameMonthDay = isSameMonth(day, currentDate)
              const cycle = getCycleForDay(day)
              const isStart = cycle && isSameDay(day, cycle.startDate)
              const isEnd = cycle && isSameDay(day, cycle.endDate)
              const todayDate = isToday(day)
              
              return (
                <div 
                  key={index}
                  className={`min-h-[120px] p-3 border border-opacity-50 relative ${
                    isSameMonthDay 
                      ? isDark 
                        ? 'bg-dark-100 border-dark-accent hover:bg-dark-accent/30' 
                        : 'bg-white border-neutral-100 hover:bg-neutral-50'
                      : isDark 
                        ? 'bg-dark-200 border-dark-accent/50 text-neutral-500' 
                        : 'bg-neutral-50 border-neutral-100/50 text-neutral-400'
                  } ${
                    todayDate 
                      ? isDark 
                        ? 'ring-2 ring-primary-500/70 ring-inset' 
                        : 'ring-2 ring-primary-500 ring-inset'
                      : ''
                  }`}
                  onClick={() => cycle && setSelectedCycle(cycle)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-sm font-medium ${
                      todayDate 
                        ? 'text-primary-500 dark:text-primary-400' 
                        : isSameMonthDay 
                          ? 'text-neutral-800 dark:text-neutral-200' 
                          : 'text-neutral-500 dark:text-neutral-500'
                    }`}>
                      {format(day, 'd')}
                    </span>
                    
                    {todayDate && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        isDark ? 'bg-primary-900/30 text-primary-400' : 'bg-primary-50 text-primary-500'
                      }`}>
                        Today
                      </span>
                    )}
                  </div>
                  
                  {cycle && (
                    <div 
                      className={`text-xs p-1.5 rounded-lg mb-1 transition-colors ${
                        isStart || isEnd
                          ? cycle.isCurrent
                            ? isDark 
                              ? 'bg-green-900/30 text-green-400 border border-green-800/50' 
                              : 'bg-green-50 text-green-700 border border-green-100'
                            : cycle.isUpcoming
                              ? isDark 
                                ? 'bg-amber-900/30 text-amber-400 border border-amber-800/50' 
                                : 'bg-amber-50 text-amber-700 border border-amber-100'
                              : isDark 
                                ? 'bg-neutral-800/50 text-neutral-300 border border-neutral-700/50' 
                                : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
                          : ''
                      }`}
                    >
                      {isStart && (
                        <div className="font-medium">
                          {cycle.cycle} Start
                        </div>
                      )}
                      {isEnd && (
                        <div className="font-medium">
                          {cycle.cycle} End
                        </div>
                      )}
                      {!isStart && !isEnd && (
                        <div className="font-medium">
                          {cycle.cycle}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </motion.div>
        
        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className={`p-5 rounded-xl mb-8 ${
            isDark ? 'bg-dark-100 border border-dark-accent' : 'bg-white shadow-soft'
          }`}
        >
          <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-4">
            Calendar Legend
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-sm mr-3 ${
                isDark ? 'bg-green-900/30 border border-green-800/50' : 'bg-green-50 border border-green-100'
              }`}></div>
              <span className={`text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Current Cycle
              </span>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-sm mr-3 ${
                isDark ? 'bg-amber-900/30 border border-amber-800/50' : 'bg-amber-50 border border-amber-100'
              }`}></div>
              <span className={`text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Upcoming Cycle
              </span>
            </div>
            <div className="flex items-center">
              <div className={`w-4 h-4 rounded-sm mr-3 ${
                isDark ? 'bg-neutral-800/50 border border-neutral-700/50' : 'bg-neutral-100 border border-neutral-200'
              }`}></div>
              <span className={`text-sm ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Past Cycle
              </span>
            </div>
          </div>
        </motion.div>
        
        {/* Selected Cycle Details */}
        {selectedCycle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`p-6 rounded-xl mb-8 ${
              isDark ? 'bg-dark-100 border border-dark-accent' : 'bg-white shadow-medium'
            }`}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg mr-4 ${
                  selectedCycle.isCurrent
                    ? isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-600'
                    : selectedCycle.isUpcoming
                      ? isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-50 text-amber-600'
                      : isDark ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-600'
                }`}>
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-medium text-neutral-800 dark:text-white">
                    {selectedCycle.cycle}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    {selectedCycle.isCurrent ? 'Current Cycle' : selectedCycle.isUpcoming ? 'Upcoming Cycle' : 'Past Cycle'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setSelectedCycle(null)}
                className={`mt-3 md:mt-0 px-3 py-1.5 rounded-lg text-sm ${
                  isDark 
                    ? 'bg-dark-accent text-neutral-400 hover:text-neutral-300' 
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Close Details
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-dark-accent/50' : 'bg-neutral-50'
              }`}>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                  Start Date
                </div>
                <div className="text-lg font-medium text-neutral-900 dark:text-white">
                  {format(selectedCycle.startDate, 'MMMM d, yyyy')}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  {format(selectedCycle.startDate, 'EEEE')}
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-dark-accent/50' : 'bg-neutral-50'
              }`}>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                  End Date
                </div>
                <div className="text-lg font-medium text-neutral-900 dark:text-white">
                  {format(selectedCycle.endDate, 'MMMM d, yyyy')}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  {format(selectedCycle.endDate, 'EEEE')}
                </div>
              </div>
              
              <div className={`p-4 rounded-lg ${
                isDark ? 'bg-dark-accent/50' : 'bg-neutral-50'
              }`}>
                <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                  {selectedCycle.isCurrent ? 'Remaining' : selectedCycle.isUpcoming ? 'Starts In' : 'Ended'}
                </div>
                <div className="text-lg font-medium text-neutral-900 dark:text-white">
                  {selectedCycle.isCurrent 
                    ? `${selectedCycle.daysUntilEnd} days` 
                    : selectedCycle.isUpcoming 
                      ? `${Math.abs(selectedCycle.daysSinceStart || 0)} days` 
                      : `${selectedCycle.daysSinceStart || 0} days ago`
                  }
                </div>
              </div>
            </div>
            
            <div className="mt-5 pt-5 border-t border-neutral-100 dark:border-dark-accent">
              <Link 
                to={`/cycle/${selectedCycle.id}`}
                className={`inline-flex items-center font-medium ${
                  isDark ? 'text-primary-400 hover:text-primary-300' : 'text-primary-500 hover:text-primary-600'
                }`}
              >
                <span>View full cycle details</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </motion.div>
        )}
        
        {/* Monthly Cycles List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className={`p-6 rounded-xl ${
            isDark ? 'bg-dark-100 border border-dark-accent' : 'bg-white shadow-medium'
          }`}
        >
          <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-4">
            Cycles in {format(currentDate, 'MMMM yyyy')}
          </h3>
          
          {monthCycles.length > 0 ? (
            <div className="space-y-4">
              {monthCycles.map(cycle => (
                <Link 
                  key={cycle.id}
                  to={`/cycle/${cycle.id}`}
                  className={`block p-4 rounded-lg transition-colors ${
                    isDark 
                      ? 'bg-dark-accent/50 hover:bg-dark-accent/70' 
                      : 'bg-neutral-50 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mr-4 ${
                        cycle.isCurrent
                          ? isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-600'
                          : cycle.isUpcoming
                            ? isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-50 text-amber-600'
                            : isDark ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        <CalendarIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium text-neutral-800 dark:text-white">
                          AIRAC {cycle.cycle}
                        </div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">
                          {format(cycle.startDate, 'MMM d')} - {format(cycle.endDate, 'MMM d, yyyy')}
                        </div>
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
                </Link>
              ))}
            </div>
          ) : (
            <div className={`p-6 text-center rounded-lg ${
              isDark ? 'bg-dark-accent/50' : 'bg-neutral-50'
            }`}>
              <p className="text-neutral-600 dark:text-neutral-400">
                No AIRAC cycles in this month.
              </p>
            </div>
          )}
        </motion.div>
        
        {/* Help Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className={`mt-8 p-5 rounded-xl ${
            isDark ? 'bg-dark-accent/50' : 'bg-amber-50 dark:bg-amber-900/20'
          }`}
        >
          <div className="flex items-start">
            <Info className={`w-5 h-5 mt-0.5 mr-3 ${
              isDark ? 'text-amber-400' : 'text-amber-500'
            }`} />
            <div>
              <h4 className={`text-sm font-medium mb-1 ${
                isDark ? 'text-white' : 'text-amber-800 dark:text-amber-400'
              }`}>
                Calendar Information
              </h4>
              <p className={`text-xs ${
                isDark ? 'text-neutral-300' : 'text-amber-700 dark:text-amber-300'
              }`}>
                The calendar displays all AIRAC cycles that overlap with the current month. 
                Click on any day to see details about the associated cycle. You can navigate 
                between months using the controls above.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 