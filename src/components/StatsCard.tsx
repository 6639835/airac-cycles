import { motion } from 'framer-motion'
import { BarChart3, Calendar, Clock, TrendingUp } from 'lucide-react'
import type { AiracStats } from '@/types/airac'

interface StatsCardProps {
  stats: AiracStats
}

export function StatsCard({ stats }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="card"
    >
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-accent-500 p-3 rounded-xl">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Statistics
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AIRAC Overview
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Total Cycles */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total Cycles
              </span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {stats.totalCycles}
            </span>
          </div>

          {/* Upcoming Cycles */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Upcoming Cycles
              </span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {stats.upcomingCycles.length}
            </span>
          </div>

          {/* Cycle Duration */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Cycle Duration
              </span>
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {stats.averageCycleDuration} days
            </span>
          </div>
        </div>

        {/* Next Upcoming Cycles */}
        {stats.upcomingCycles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Next Upcoming Cycles
            </h3>
            <div className="space-y-2">
              {stats.upcomingCycles.slice(0, 3).map((cycle) => (
                <div
                  key={cycle.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="font-medium text-primary-600 dark:text-primary-400">
                    {cycle.cycle}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {cycle.startDate.toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Years Coverage */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Object.keys(stats.cyclesByYear).length}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">
              Years Covered (2025-2099)
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 