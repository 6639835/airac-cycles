import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, Plane, ArrowRight, Clock } from 'lucide-react'
import { format } from 'date-fns'
import type { AiracCycle } from '@/types/airac'
import { useTheme } from '@/contexts/ThemeContext'

interface CurrentCycleCardProps {
  cycle: AiracCycle
}

export function CurrentCycleCard({ cycle }: CurrentCycleCardProps) {
  const { isDark } = useTheme()
  
  const progressPercentage = cycle.daysSinceStart && cycle.daysUntilEnd 
    ? (cycle.daysSinceStart / (cycle.daysSinceStart + cycle.daysUntilEnd)) * 100
    : 0

  // Calculate next cycle identifier (assumption: format is like 2307)
  const nextCycleNumber = (parseInt(cycle.cycleNumber.toString()) % 13) + 1
  const nextCycleYear = nextCycleNumber === 1 ? cycle.year + 1 : cycle.year
  const nextCycle = `${nextCycleYear.toString().slice(-2)}${nextCycleNumber.toString().padStart(2, '0')}`

  return (
    <Link to={`/cycle/${cycle.id}`} className="block focus-ring rounded-xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`card relative overflow-hidden cursor-pointer hover:shadow-medium transition-all duration-200
          ${isDark ? 'bg-dark-100 border-dark-accent hover:shadow-dark-medium dark-glow' : ''}
        `}
      >
        <div className="relative p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className={`bg-primary-500 p-2 rounded-md ${isDark ? 'animate-pulse-glow' : ''}`}>
                <Plane className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-neutral-800 dark:text-white">
                  Current AIRAC Cycle
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Active Period
                </p>
              </div>
            </div>
            <span className="badge-success text-sm px-3 py-1">
              ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cycle Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-3xl font-medium text-primary-500 dark:text-primary-400 mb-1">
                  {cycle.cycle}
                </h3>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">
                  Cycle {cycle.cycleNumber} of {cycle.year}
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDark ? 'bg-dark-accent' : 'bg-primary-50 dark:bg-primary-900/20'
                  }`}>
                    <Calendar className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-neutral-800 dark:text-white">
                      {format(cycle.startDate, 'MMMM dd, yyyy')}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">Start Date</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isDark ? 'bg-dark-accent' : 'bg-primary-50 dark:bg-primary-900/20'
                  }`}>
                    <Calendar className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-neutral-800 dark:text-white">
                      {format(cycle.endDate, 'MMMM dd, yyyy')}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">End Date</div>
                  </div>
                </div>
              </div>
              
              <button className={`btn-primary mt-4 inline-flex ${isDark ? 'shadow-glow' : ''}`}>
                <span>View cycle details</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>

            {/* Progress & Stats */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    Cycle Progress
                  </span>
                  <span className="text-sm text-neutral-500 dark:text-neutral-400">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <div className={`w-full rounded-full h-1.5 ${
                  isDark ? 'bg-dark-accent' : 'bg-neutral-100 dark:bg-neutral-800'
                }`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className={`h-1.5 rounded-full ${
                      isDark ? 'bg-primary-400 shadow-glow' : 'bg-primary-500'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${
                  isDark 
                    ? 'bg-dark-accent/50 border border-dark-accent' 
                    : 'bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800'
                }`}>
                  <div className="flex items-center space-x-3 mb-1">
                    <Clock className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                    <span className="text-sm font-medium text-neutral-800 dark:text-white">
                      Elapsed
                    </span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-medium text-neutral-800 dark:text-white">
                      {cycle.daysSinceStart || 0}
                    </span>
                    <span className="ml-1 text-xs text-neutral-500 dark:text-neutral-400">
                      days
                    </span>
                  </div>
                </div>
                
                <div className={`p-4 rounded-lg ${
                  isDark 
                    ? 'bg-dark-accent/50 border border-dark-accent' 
                    : 'bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800'
                }`}>
                  <div className="flex items-center space-x-3 mb-1">
                    <Clock className="w-4 h-4 text-primary-500 dark:text-primary-400" />
                    <span className="text-sm font-medium text-neutral-800 dark:text-white">
                      Remaining
                    </span>
                  </div>
                  <div className="flex items-baseline">
                    <span className="text-2xl font-medium text-neutral-800 dark:text-white">
                      {cycle.daysUntilEnd || 0}
                    </span>
                    <span className="ml-1 text-xs text-neutral-500 dark:text-neutral-400">
                      days
                    </span>
                  </div>
                </div>
              </div>
              
              <div className={`text-sm text-neutral-500 dark:text-neutral-400 pt-3 ${
                isDark ? 'border-t border-dark-accent' : 'border-t border-neutral-100 dark:border-neutral-800'
              }`}>
                This cycle will end in {cycle.daysUntilEnd || 0} days. The next cycle ({nextCycle}) 
                will begin on {format(cycle.endDate, 'MMMM dd, yyyy')}.
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
} 