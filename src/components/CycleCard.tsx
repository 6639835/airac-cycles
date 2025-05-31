import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Calendar, Clock, ArrowRight, ChevronRight } from 'lucide-react'
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
      <Link to={`/cycle/${cycle.id}`} className="block focus-ring rounded-xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
          className="card p-4 cursor-pointer hover:shadow-medium transition-all duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-xl font-semibold text-primary-500 dark:text-primary-400">
                  {cycle.cycle}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">
                  Cycle {cycle.cycleNumber}
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div>
                  <div className="text-sm font-medium text-neutral-800 dark:text-white">
                    {format(cycle.startDate, 'MMM dd, yyyy')}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">Start Date</div>
                </div>
                
                <ArrowRight className="w-4 h-4 text-neutral-400" />
                
                <div>
                  <div className="text-sm font-medium text-neutral-800 dark:text-white">
                    {format(cycle.endDate, 'MMM dd, yyyy')}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">End Date</div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {getDaysInfo() && (
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
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
    <Link to={`/cycle/${cycle.id}`} className="block focus-ring rounded-xl">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className={`card p-5 relative overflow-hidden cursor-pointer hover:shadow-medium ${
          cycle.isCurrent ? 'border-l-4 border-l-primary-500' : ''
        }`}
      >
        {/* Status indicator */}
        <div className="absolute top-4 right-4">
          {getStatusBadge()}
        </div>
        
        {/* Cycle identifier */}
        <div className="mb-5">
          <h3 className="text-2xl font-medium text-primary-500 dark:text-primary-400 mb-1">
            {cycle.cycle}
          </h3>
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            Cycle {cycle.cycleNumber} of {cycle.year}
          </div>
        </div>
        
        {/* Dates */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-primary-500 dark:text-primary-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-neutral-800 dark:text-white">
                {format(cycle.startDate, 'MMM dd, yyyy')}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Start Date</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-4 h-4 text-primary-500 dark:text-primary-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-neutral-800 dark:text-white">
                {format(cycle.endDate, 'MMM dd, yyyy')}
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">End Date</div>
            </div>
          </div>
        </div>
        
        {/* Additional info */}
        <div className="flex items-center justify-between">
          {getDaysInfo() && (
            <div className="flex items-center space-x-2 text-sm text-neutral-600 dark:text-neutral-400">
              <Clock className="w-4 h-4" />
              <span>{getDaysInfo()}</span>
            </div>
          )}
          
          <div className="text-primary-500 dark:text-primary-400 flex items-center text-sm font-medium">
            <span>View details</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </div>
        </div>
        
        {/* Current cycle highlight */}
        {cycle.isCurrent && !cycle.isUpcoming && (
          <div className="absolute -left-1 top-0 bottom-0 w-1 bg-primary-500"></div>
        )}
      </motion.div>
    </Link>
  )
} 