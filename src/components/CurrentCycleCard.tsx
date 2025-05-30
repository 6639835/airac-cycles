import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, Plane, TrendingUp } from 'lucide-react'
import { format } from 'date-fns'
import type { AiracCycle } from '@/types/airac'

interface CurrentCycleCardProps {
  cycle: AiracCycle
}

export function CurrentCycleCard({ cycle }: CurrentCycleCardProps) {
  const progressPercentage = cycle.daysSinceStart && cycle.daysUntilEnd 
    ? (cycle.daysSinceStart / (cycle.daysSinceStart + cycle.daysUntilEnd)) * 100
    : 0

  return (
    <Link to={`/cycle/${cycle.id}`} className="block">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="card relative overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
      >
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-accent-500/5 to-primary-600/10" />
        
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-500 p-3 rounded-xl">
                <Plane className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Current AIRAC Cycle
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Active Period
                </p>
              </div>
            </div>
            <span className="badge-success text-sm font-medium">
              ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Cycle Info */}
            <div>
              <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {cycle.cycle}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Cycle {cycle.cycleNumber} of {cycle.year}
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {format(cycle.startDate, 'EEEE, MMMM dd, yyyy')}
                    </div>
                    <div className="text-xs text-gray-500">Start Date</div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {format(cycle.endDate, 'EEEE, MMMM dd, yyyy')}
                    </div>
                    <div className="text-xs text-gray-500">End Date</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress & Stats */}
            <div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cycle Progress
                  </span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {cycle.daysSinceStart || 0}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Days Elapsed
                  </div>
                </div>
                
                <div className="text-center p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {cycle.daysUntilEnd || 0}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Days Remaining
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Details
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
              <Calendar className="w-4 h-4 mr-2" />
              Export Calendar
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
} 