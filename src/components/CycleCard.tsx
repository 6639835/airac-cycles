import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { format } from 'date-fns'
import type { AiracCycle } from '@/types/airac'

interface CycleCardProps {
  cycle: AiracCycle
  viewMode: 'grid' | 'list'
}

export function CycleCard({ cycle, viewMode }: CycleCardProps) {
  const getStatusBadge = () => {
    if (cycle.isCurrent) {
      return <span className="badge-success">Current</span>
    }
    if (cycle.isUpcoming) {
      return <span className="badge-warning">Upcoming</span>
    }
    return <span className="badge-neutral">Past</span>
  }

  const getDaysInfo = () => {
    if (cycle.isCurrent) {
      return cycle.daysUntilEnd && cycle.daysUntilEnd > 0 
        ? `${cycle.daysUntilEnd} days remaining`
        : 'Ending today'
    }
    if (cycle.isUpcoming && cycle.daysSinceStart) {
      return `Starts in ${Math.abs(cycle.daysSinceStart)} days`
    }
    return null
  }

  if (viewMode === 'list') {
    return (
      <Link to={`/cycle/${cycle.id}`} className="block">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          className="card-hover p-6 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {cycle.cycle}
                </div>
                <div className="text-xs text-gray-500">
                  Cycle {cycle.cycleNumber}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {format(cycle.startDate, 'MMM dd, yyyy')}
                  </div>
                  <div className="text-xs text-gray-500">Start Date</div>
                </div>
                
                <ArrowRight className="w-4 h-4 text-gray-400" />
                
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {format(cycle.endDate, 'MMM dd, yyyy')}
                  </div>
                  <div className="text-xs text-gray-500">End Date</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {getDaysInfo() && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4 inline mr-1" />
                  {getDaysInfo()}
                </div>
              )}
              {getStatusBadge()}
            </div>
          </div>
        </motion.div>
      </Link>
    )
  }

  return (
    <Link to={`/cycle/${cycle.id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05, y: -5 }}
        className="card-hover p-6 relative overflow-hidden cursor-pointer"
      >
        {/* Status indicator */}
        <div className="absolute top-4 right-4">
          {getStatusBadge()}
        </div>
        
        {/* Cycle identifier */}
        <div className="mb-4">
          <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-1">
            {cycle.cycle}
          </div>
          <div className="text-sm text-gray-500">
            Cycle {cycle.cycleNumber} of {cycle.year}
          </div>
        </div>
        
        {/* Dates */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {format(cycle.startDate, 'MMM dd, yyyy')}
              </div>
              <div className="text-xs text-gray-500">Start Date</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {format(cycle.endDate, 'MMM dd, yyyy')}
              </div>
              <div className="text-xs text-gray-500">End Date</div>
            </div>
          </div>
        </div>
        
        {/* Additional info */}
        {getDaysInfo() && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{getDaysInfo()}</span>
          </div>
        )}
        
        {/* Current cycle highlight */}
        {cycle.isCurrent && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-accent-500/10 pointer-events-none" />
        )}
      </motion.div>
    </Link>
  )
} 