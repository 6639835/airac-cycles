import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Clock,
  Download,
  Filter,
  PieChart,
  LineChart,
  Activity,
  FileText,
  Database
} from 'lucide-react'
import { useAirac } from '@/hooks/useAirac'
import { format, differenceInDays } from 'date-fns'

export function AnalyticsPage() {
  const { allCycles, currentCycle, stats } = useAirac()
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [chartType, setChartType] = useState<'year' | 'month' | 'quarter'>('year')
  const [showExportMenu, setShowExportMenu] = useState(false)

  // Analytics calculations
  const analytics = useMemo(() => {
    // Cycles by year
    const cyclesByYear = allCycles.reduce((acc, cycle) => {
      const year = cycle.year
      if (!acc[year]) acc[year] = { total: 0, active: 0, upcoming: 0, past: 0 }
      acc[year].total++
      if (cycle.isCurrent) acc[year].active++
      else if (cycle.isUpcoming) acc[year].upcoming++
      else acc[year].past++
      return acc
    }, {} as Record<number, { total: number, active: number, upcoming: number, past: number }>)

    // Progress statistics
    const totalElapsed = allCycles.filter(c => !c.isCurrent && !c.isUpcoming).length
    const totalUpcoming = allCycles.filter(c => c.isUpcoming).length
    const progressPercentage = (totalElapsed / allCycles.length) * 100

    // Cycle duration analysis
    const cycleDurations = allCycles.map(cycle => 
      differenceInDays(cycle.endDate, cycle.startDate) + 1
    )
    const avgDuration = cycleDurations.reduce((a, b) => a + b, 0) / cycleDurations.length
    const minDuration = Math.min(...cycleDurations)
    const maxDuration = Math.max(...cycleDurations)

    // Current year analysis
    const currentYearCycles = allCycles.filter(c => c.year === selectedYear)
    const currentYearProgress = currentYearCycles.filter(c => !c.isCurrent && !c.isUpcoming).length
    const currentYearPercentage = (currentYearProgress / currentYearCycles.length) * 100

    // Monthly distribution
    const monthlyDistribution = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1
      const monthCycles = currentYearCycles.filter(cycle => {
        const startMonth = cycle.startDate.getMonth() + 1
        const endMonth = cycle.endDate.getMonth() + 1
        return startMonth === month || endMonth === month
      })
      return {
        month: format(new Date(2024, i, 1), 'MMM'),
        cycles: monthCycles.length,
        active: monthCycles.filter(c => c.isCurrent).length,
        upcoming: monthCycles.filter(c => c.isUpcoming).length
      }
    })

    // Quarterly distribution
    const quarterlyDistribution = Array.from({ length: 4 }, (_, i) => {
      const quarter = i + 1
      const startMonth = i * 3 + 1
      const endMonth = (i + 1) * 3
      const quarterCycles = currentYearCycles.filter(cycle => {
        const cycleMonth = cycle.startDate.getMonth() + 1
        return cycleMonth >= startMonth && cycleMonth <= endMonth
      })
      return {
        quarter: `Q${quarter}`,
        cycles: quarterCycles.length,
        active: quarterCycles.filter(c => c.isCurrent).length,
        upcoming: quarterCycles.filter(c => c.isUpcoming).length
      }
    })

    return {
      cyclesByYear,
      totalElapsed,
      totalUpcoming,
      progressPercentage,
      avgDuration,
      minDuration,
      maxDuration,
      currentYearCycles,
      currentYearProgress,
      currentYearPercentage,
      monthlyDistribution,
      quarterlyDistribution
    }
  }, [allCycles, selectedYear])

  const availableYears = useMemo(() => {
    return Array.from(new Set(allCycles.map(c => c.year))).sort()
  }, [allCycles])

  const getChartData = () => {
    switch (chartType) {
      case 'month':
        return analytics.monthlyDistribution
      case 'quarter':
        return analytics.quarterlyDistribution
      case 'year':
      default:
        return Object.entries(analytics.cyclesByYear).map(([year, data]) => ({
          label: year,
          cycles: data.total,
          active: data.active,
          upcoming: data.upcoming,
          past: data.past
        }))
    }
  }

  // Export functions
  const exportReport = (exportFormat: 'json' | 'csv' | 'pdf') => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      selectedYear,
      chartType,
      summary: {
        totalCycles: stats.totalCycles,
        totalElapsed: analytics.totalElapsed,
        totalUpcoming: analytics.totalUpcoming,
        progressPercentage: Math.round(analytics.progressPercentage),
        avgDuration: analytics.avgDuration,
        selectedYearCycles: analytics.currentYearCycles.length,
        selectedYearProgress: Math.round(analytics.currentYearPercentage)
      },
      yearlyData: Object.entries(analytics.cyclesByYear).map(([year, data]) => ({
        year: parseInt(year),
        total: data.total,
        active: data.active,
        upcoming: data.upcoming,
        past: data.past
      })),
      monthlyData: analytics.monthlyDistribution,
      quarterlyData: analytics.quarterlyDistribution
    }

    let content = ''
    let mimeType = ''
    let filename = ''

    switch (exportFormat) {
      case 'json':
        content = JSON.stringify(reportData, null, 2)
        mimeType = 'application/json'
        filename = `airac-analytics-${selectedYear}.json`
        break

      case 'csv':
        // Create comprehensive CSV with multiple sheets worth of data
        const csvHeaders = [
          'Report Type,Value',
          `Generated At,${reportData.generatedAt}`,
          `Selected Year,${selectedYear}`,
          `Total Cycles,${reportData.summary.totalCycles}`,
          `Progress Percentage,${reportData.summary.progressPercentage}%`,
          `Average Duration,${reportData.summary.avgDuration} days`,
          '',
          'Year,Total Cycles,Active,Upcoming,Past'
        ]
        
        const yearlyRows = reportData.yearlyData.map(year => 
          `${year.year},${year.total},${year.active},${year.upcoming},${year.past}`
        )
        
        const monthlyHeaders = [
          '',
          `Monthly Distribution (${selectedYear})`,
          'Month,Cycles,Active,Upcoming'
        ]
        
        const monthlyRows = reportData.monthlyData.map(month => 
          `${month.month},${month.cycles},${month.active},${month.upcoming}`
        )

        content = [...csvHeaders, ...yearlyRows, ...monthlyHeaders, ...monthlyRows].join('\n')
        mimeType = 'text/csv'
        filename = `airac-analytics-${selectedYear}.csv`
        break

      case 'pdf':
        // Generate a simple HTML report for PDF printing
        const htmlReport = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>AIRAC Analytics Report - ${selectedYear}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
            .card { border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
            .metric { font-size: 2em; font-weight: bold; color: #4f46e5; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f5f5f5; }
            .footer { margin-top: 40px; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>AIRAC Analytics Report</h1>
            <h2>${selectedYear}</h2>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="summary">
            <div class="card">
              <h3>Total Cycles</h3>
              <div class="metric">${reportData.summary.totalCycles}</div>
            </div>
            <div class="card">
              <h3>Progress</h3>
              <div class="metric">${reportData.summary.progressPercentage}%</div>
            </div>
            <div class="card">
              <h3>Average Duration</h3>
              <div class="metric">${reportData.summary.avgDuration} days</div>
            </div>
            <div class="card">
              <h3>Upcoming Cycles</h3>
              <div class="metric">${reportData.summary.totalUpcoming}</div>
            </div>
          </div>

          <h3>Yearly Breakdown</h3>
          <table>
            <thead>
              <tr><th>Year</th><th>Total</th><th>Active</th><th>Upcoming</th><th>Past</th></tr>
            </thead>
            <tbody>
              ${reportData.yearlyData.map(year => 
                `<tr><td>${year.year}</td><td>${year.total}</td><td>${year.active}</td><td>${year.upcoming}</td><td>${year.past}</td></tr>`
              ).join('')}
            </tbody>
          </table>

          <h3>Monthly Distribution (${selectedYear})</h3>
          <table>
            <thead>
              <tr><th>Month</th><th>Cycles</th><th>Active</th><th>Upcoming</th></tr>
            </thead>
            <tbody>
              ${reportData.monthlyData.map(month => 
                `<tr><td>${month.month}</td><td>${month.cycles}</td><td>${month.active}</td><td>${month.upcoming}</td></tr>`
              ).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>Generated by AIRAC Explorer - Modern Edition</p>
            <p>For operational use, always refer to official aviation authority sources</p>
          </div>
        </body>
        </html>`
        
        // Open in new window for printing
        const printWindow = window.open('', '_blank')
        if (printWindow) {
          printWindow.document.write(htmlReport)
          printWindow.document.close()
          printWindow.focus()
          setTimeout(() => {
            printWindow.print()
          }, 250)
        }
        return // Don't create download link for PDF
    }

    if (content) {
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
    
    setShowExportMenu(false)
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
            AIRAC Analytics
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Statistical analysis and insights about AIRAC cycles with interactive charts and data visualization
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="card mb-8"
        >
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="input w-auto min-w-32"
                  >
                    {availableYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setChartType('year')}
                    className={`px-3 py-1 rounded text-sm ${
                      chartType === 'year'
                        ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    Yearly
                  </button>
                  <button
                    onClick={() => setChartType('quarter')}
                    className={`px-3 py-1 rounded text-sm ${
                      chartType === 'quarter'
                        ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    Quarterly
                  </button>
                  <button
                    onClick={() => setChartType('month')}
                    className={`px-3 py-1 rounded text-sm ${
                      chartType === 'month'
                        ? 'bg-white dark:bg-gray-600 shadow-sm text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              <div className="relative">
                <button 
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Report</span>
                </button>
                
                {showExportMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-0 top-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 min-w-48"
                  >
                    <div className="p-2">
                      <button
                        onClick={() => exportReport('pdf')}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <FileText className="w-4 h-4" />
                        <span>PDF Report</span>
                      </button>
                      <button
                        onClick={() => exportReport('csv')}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Database className="w-4 h-4" />
                        <span>CSV Data</span>
                      </button>
                      <button
                        onClick={() => exportReport('json')}
                        className="w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Download className="w-4 h-4" />
                        <span>JSON Export</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="card">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-primary-500 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.totalCycles}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Cycles
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                2025 - 2099 (75 years)
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-accent-500 p-2 rounded-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(analytics.progressPercentage)}%
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Progress
                  </div>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-accent-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${analytics.progressPercentage}%` }}
                />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-green-500 p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.avgDuration}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Avg Duration (days)
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Min: {analytics.minDuration}, Max: {analytics.maxDuration}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="bg-yellow-500 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {analytics.totalUpcoming}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Upcoming Cycles
                  </div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Future planning cycles
              </div>
            </div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card"
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-primary-500 p-2 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Cycles Distribution
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {chartType === 'year' ? 'By Year' : chartType === 'quarter' ? `${selectedYear} Quarters` : `${selectedYear} Months`}
                  </p>
                </div>
              </div>

              {/* Simple Bar Chart */}
              <div className="space-y-4">
                {getChartData().slice(0, 10).map((item: any, index) => {
                  const maxValue = Math.max(...getChartData().map((d: any) => d.cycles || d.total || 0))
                  const percentage = ((item.cycles || item.total || 0) / maxValue) * 100
                  
                  return (
                    <div key={item.label || item.quarter || item.month || index} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {item.label || item.quarter || item.month}
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {item.cycles || item.total || 0} cycles
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full"
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </motion.div>

          {/* Status Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card"
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-accent-500 p-2 rounded-lg">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Status Distribution
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Current status breakdown
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Past Cycles</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {analytics.totalElapsed}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round((analytics.totalElapsed / stats.totalCycles) * 100)}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-primary-500 rounded"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Current Cycle</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {currentCycle ? 1 : 0}
                    </div>
                    <div className="text-xs text-gray-500">
                      {currentCycle ? '<1%' : '0%'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">Upcoming Cycles</span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {analytics.totalUpcoming}
                    </div>
                    <div className="text-xs text-gray-500">
                      {Math.round((analytics.totalUpcoming / stats.totalCycles) * 100)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Progress Ring */}
              <div className="mt-6 flex justify-center">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200 dark:text-gray-700"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 56}`}
                      strokeDashoffset={`${2 * Math.PI * 56 * (1 - analytics.progressPercentage / 100)}`}
                      className="text-primary-500 transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {Math.round(analytics.progressPercentage)}%
                      </div>
                      <div className="text-xs text-gray-500">Complete</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Detailed Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="card"
        >
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-500 p-2 rounded-lg">
                <LineChart className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Year {selectedYear} Analysis
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Detailed breakdown of the selected year
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {analytics.currentYearCycles.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Cycles
                </div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {analytics.currentYearProgress}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Completed
                </div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {Math.round(analytics.currentYearPercentage)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Progress
                </div>
              </div>
            </div>

            {/* Monthly/Quarterly Breakdown */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 text-gray-600 dark:text-gray-400">
                      {chartType === 'month' ? 'Month' : 'Quarter'}
                    </th>
                    <th className="text-center py-2 text-gray-600 dark:text-gray-400">Total</th>
                    <th className="text-center py-2 text-gray-600 dark:text-gray-400">Active</th>
                    <th className="text-center py-2 text-gray-600 dark:text-gray-400">Upcoming</th>
                  </tr>
                </thead>
                <tbody>
                  {(chartType === 'month' ? analytics.monthlyDistribution : analytics.quarterlyDistribution).map((item) => (
                    <tr key={'month' in item ? item.month : item.quarter} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 font-medium text-gray-900 dark:text-white">
                        {'month' in item ? item.month : item.quarter}
                      </td>
                      <td className="py-3 text-center text-gray-700 dark:text-gray-300">
                        {item.cycles}
                      </td>
                      <td className="py-3 text-center">
                        {item.active > 0 && (
                          <span className="badge-success">{item.active}</span>
                        )}
                      </td>
                      <td className="py-3 text-center">
                        {item.upcoming > 0 && (
                          <span className="badge-warning">{item.upcoming}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 