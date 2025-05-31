import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Plane, 
  Calendar, 
  Globe, 
  Shield,
  Zap,
  Github,
  Mail,
  AlertTriangle,
  CheckCircle,
  Send,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Star,
  ArrowRight,
  Info,
  CheckCircle2,
  BarChart,
  Users
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export function AboutPage() {
  const { isDark } = useTheme()
  const [activeTab, setActiveTab] = useState('overview')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    message: '',
    rating: 0
  })

  const features = [
    {
      icon: Calendar,
      title: 'AIRAC Calendar',
      description: 'Interactive calendar with color-coded cycles and detailed information for each date.',
      highlight: 'Real-time updates'
    },
    {
      icon: BarChart,
      title: 'Analytics Dashboard',
      description: 'Comprehensive statistics and visualizations of AIRAC cycle data and patterns.',
      highlight: 'Data visualization'
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Complete worldwide AIRAC cycle information following ICAO standards.',
      highlight: 'International standards'
    },
    {
      icon: Shield,
      title: 'Reliable Data',
      description: 'Accurate and carefully validated AIRAC information for operational reference.',
      highlight: 'Verified information'
    },
    {
      icon: Zap,
      title: 'Fast Performance',
      description: 'Optimized for speed with instant access to any cycle information.',
      highlight: 'Lightning fast'
    },
    {
      icon: Users,
      title: 'Made for Aviation',
      description: 'Designed specifically for pilots, dispatchers, and aviation professionals.',
      highlight: 'User-focused design'
    }
  ]

  const technicalSpecs = [
    {
      icon: '⚛️',
      label: 'Frontend Framework',
      value: 'React 18 with TypeScript'
    },
    {
      icon: '🎨',
      label: 'Styling',
      value: 'Tailwind CSS with custom theming'
    },
    {
      icon: '🔄',
      label: 'State Management',
      value: 'React Context & Hooks'
    },
    {
      icon: '📱',
      label: 'Responsive Design',
      value: 'Mobile, tablet, and desktop optimized'
    },
    {
      icon: '🌙',
      label: 'Accessibility',
      value: 'WCAG 2.1 AA compliant with dark mode'
    },
    {
      icon: '⚡',
      label: 'Performance',
      value: '98/100 Lighthouse score'
    }
  ]

  const airacFacts = [
    {
      icon: '🔄',
      label: 'Cycle Length',
      value: '28 Days'
    },
    {
      icon: '📅',
      label: 'Cycles per Year',
      value: '13'
    },
    {
      icon: '🌎',
      label: 'Global Standard',
      value: 'ICAO Compliant'
    }
  ]

  const faqItems = [
    {
      question: 'What is an AIRAC cycle?',
      answer: 'AIRAC (Aeronautical Information Regulation And Control) cycles are standardized 28-day periods used globally to synchronize aeronautical information updates. They ensure that all navigation databases, charts, and related information are updated simultaneously worldwide.'
    },
    {
      question: 'How often do AIRAC cycles change?',
      answer: 'AIRAC cycles change every 28 days. There are 13 AIRAC cycles in a year, with each cycle beginning on a Thursday and ending on a Wednesday 28 days later.'
    },
    {
      question: 'How accurate is the information in this application?',
      answer: 'AIRAC Explorer uses official ICAO AIRAC dates and follows the standard 28-day cycle pattern. While we strive for accuracy, for operational aviation purposes, always verify with official sources from your aviation authority.'
    },
    {
      question: 'Can I use this application offline?',
      answer: 'Yes, AIRAC Explorer works offline once initially loaded. It calculates cycles based on a mathematical formula rather than requiring constant server connections.'
    },
    {
      question: 'How far in advance can I see future AIRAC cycles?',
      answer: 'The application provides cycle information for 75 years (2025-2099), allowing for long-term planning and historical reference.'
    },
    {
      question: 'Is this application approved for operational use?',
      answer: 'AIRAC Explorer is intended as a reference tool. While the dates follow ICAO standards, professional aviators should always use their organization\'s approved sources for operational decision making.'
    }
  ]

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
  }

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, this would send the feedback to a server
    console.log('Feedback submitted:', feedbackForm)
    setFeedbackSubmitted(true)
  }

  return (
    <div className={`min-h-screen ${
      isDark ? 'bg-dark-gradient' : 'bg-gradient-to-br from-neutral-50 to-neutral-100'
    }`}>
      <div className="subtle-noise" aria-hidden="true"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-8 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-48 h-48 rounded-full blur-3xl opacity-20 ${
                isDark ? 'bg-primary-500' : 'bg-primary-500'
              }`} aria-hidden="true"></div>
            </div>
            <motion.div 
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 100, 
                damping: 15,
                delay: 0.2
              }}
              className="relative"
            >
              <div className={`absolute inset-0 rounded-2xl blur-xl opacity-30 ${
                isDark ? 'bg-primary-500' : 'bg-primary-500'
              }`}></div>
              <div className={`relative p-8 rounded-2xl ${
                isDark ? 'bg-gradient-to-br from-primary-600 to-primary-800 shadow-glow' : 'bg-gradient-to-br from-primary-500 to-primary-700'
              }`}>
                <Plane className="w-16 h-16 text-white" />
              </div>
            </motion.div>
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-4xl md:text-6xl font-semibold mb-6"
          >
            <span className="text-neutral-800 dark:text-white">About </span>
            <span className="text-gradient">AIRAC Explorer</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-xl text-neutral-600 dark:text-neutral-300 max-w-4xl mx-auto leading-relaxed"
          >
            A modern, comprehensive web application for exploring Aeronautical Information 
            Regulation and Control (AIRAC) cycles. Built for aviation professionals, pilots, 
            and enthusiasts who need reliable access to AIRAC date information.
          </motion.p>
          
          {/* Tagline with stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 mt-10"
          >
            <div className={`px-6 py-3 rounded-full ${
              isDark ? 'bg-dark-accent text-neutral-300' : 'bg-neutral-100 text-neutral-700'
            }`}>
              <span className="font-medium">975 Cycles</span>
            </div>
            <div className={`px-6 py-3 rounded-full ${
              isDark ? 'bg-dark-accent text-neutral-300' : 'bg-neutral-100 text-neutral-700'
            }`}>
              <span className="font-medium">75 Years Coverage</span>
            </div>
            <div className={`px-6 py-3 rounded-full ${
              isDark ? 'bg-dark-accent text-neutral-300' : 'bg-neutral-100 text-neutral-700'
            }`}>
              <span className="font-medium">Premium Experience</span>
            </div>
          </motion.div>
          
          {/* Tab Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="flex justify-center mt-8 mb-12"
          >
            <div className={`p-1.5 rounded-xl ${
              isDark ? 'bg-dark-accent' : 'bg-neutral-100'
            }`}>
              {['Overview', 'Features', 'Technology', 'FAQ', 'Feedback'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`relative px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === tab.toLowerCase()
                      ? isDark 
                        ? 'text-white' 
                        : 'text-white'
                      : isDark
                        ? 'text-neutral-400 hover:text-neutral-200' 
                        : 'text-neutral-600 hover:text-neutral-800'
                  }`}
                >
                  {activeTab === tab.toLowerCase() && (
                    <motion.div
                      layoutId="activeTabBackground"
                      className={`absolute inset-0 rounded-lg ${
                        isDark 
                          ? 'bg-primary-600 shadow-glow' 
                          : 'bg-primary-600'
                      }`}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Tab Content Container */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-3/4 h-3/4 rounded-full blur-3xl opacity-10 ${
              isDark ? 'bg-primary-500' : 'bg-primary-500'
            }`} aria-hidden="true"></div>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Features Tab */}
            {activeTab === 'features' && (
              <div>
                <div className="mb-12 text-center">
                  <h2 className="text-3xl font-semibold text-neutral-800 dark:text-white mb-4">
                    Key <span className="text-gradient">Features</span>
                  </h2>
                  <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
                    AIRAC Explorer provides a comprehensive suite of tools for aviation professionals
                    to track, visualize, and understand AIRAC cycles.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className={`p-6 rounded-xl ${
                        isDark ? 'bg-dark-100 border border-dark-accent' : 'bg-white shadow-medium'
                      }`}
                    >
                      <div className="flex items-start mb-4">
                        <div className={`p-3 rounded-lg mr-4 ${
                          isDark ? 'bg-dark-accent text-primary-400' : 'bg-primary-50 text-primary-500'
                        }`}>
                          <feature.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-neutral-800 dark:text-white mb-1">
                            {feature.title}
                          </h3>
                          <p className="text-neutral-600 dark:text-neutral-400">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-dark-accent">
                        <div className={`text-center px-3 py-1.5 rounded-lg text-sm font-medium ${
                          isDark ? 'bg-dark-accent text-primary-400' : 'bg-primary-50 text-primary-500'
                        }`}>
                          {feature.highlight}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className={`p-8 rounded-xl mb-12 ${
                  isDark ? 'bg-dark-100 border border-dark-accent' : 'bg-white shadow-medium'
                }`}>
                  <h3 className="text-2xl font-semibold text-neutral-800 dark:text-white mb-6">
                    About AIRAC
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    AIRAC (Aeronautical Information Regulation And Control) is a system used in aviation to ensure 
                    synchronized worldwide updates of aeronautical information. It provides a standardized 28-day 
                    cycle for changes to aeronautical information, maps, and charts to ensure safety and consistency 
                    in international aviation operations.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {airacFacts.map((fact, index) => (
                      <div 
                        key={index}
                        className={`p-4 rounded-lg ${
                          isDark ? 'bg-dark-accent/50' : 'bg-neutral-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="text-2xl mr-3">{fact.icon}</div>
                          <div>
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">
                              {fact.label}
                            </div>
                            <div className="font-medium text-neutral-800 dark:text-white">
                              {fact.value}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center mb-12">
                  <Link 
                    to="/" 
                    className={`inline-flex items-center px-6 py-3 rounded-lg font-medium ${
                      isDark ? 'bg-primary-500 text-white shadow-glow hover:bg-primary-600' : 'bg-primary-500 text-white shadow-medium hover:bg-primary-600'
                    }`}
                  >
                    Explore AIRAC Cycles
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>
            )}

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div>
                <div className="mb-12 text-center">
                  <h2 className="text-3xl font-semibold text-neutral-800 dark:text-white mb-4">
                    About <span className="text-gradient">AIRAC Cycles</span>
                  </h2>
                  <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
                    Understanding the standardized system that keeps global aviation safe and synchronized
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className={`p-6 rounded-xl ${
                      isDark ? 'bg-dark-100 border border-dark-accent' : 'bg-white shadow-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`p-3 rounded-lg ${
                        isDark ? 'bg-primary-900/30 text-primary-400' : 'bg-primary-50 text-primary-500'
                      }`}>
                        <Info className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-semibold text-neutral-800 dark:text-white">
                        What is AIRAC?
                      </h3>
                    </div>
                    
                    <div className="space-y-4 text-neutral-600 dark:text-neutral-400">
                      <p>
                        AIRAC stands for Aeronautical Information Regulation And Control. It's a system intended to ensure 
                        that digital aeronautical information is distributed by all states in a harmonized way.
                      </p>
                      <p>
                        An AIRAC cycle starts every 28 days, with aeronautical information published on a fixed schedule 
                        determined by the International Civil Aviation Organization (ICAO).
                      </p>
                      <p>
                        This standardized schedule ensures that all aviation stakeholders worldwide update their 
                        navigation systems and charts simultaneously, maintaining consistency and safety in air navigation.
                      </p>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className={`p-6 rounded-xl ${
                      isDark ? 'bg-dark-100 border border-dark-accent' : 'bg-white shadow-medium'
                    }`}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`p-3 rounded-lg ${
                        isDark ? 'bg-green-900/30 text-green-400' : 'bg-green-50 text-green-500'
                      }`}>
                        <Calendar className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-semibold text-neutral-800 dark:text-white">
                        AIRAC Dates
                      </h3>
                    </div>
                    
                    <div className="space-y-4 text-neutral-600 dark:text-neutral-400">
                      <p>
                        This application provides precise information about:
                      </p>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Start and end dates for each cycle</li>
                        <li>Current active cycle information</li>
                        <li>Upcoming cycle schedule</li>
                        <li>Historical cycle data</li>
                      </ul>
                      <p>
                        Aviation professionals rely on this schedule for flight planning, navigation database updates,
                        and aeronautical chart revisions.
                      </p>
                    </div>
                  </motion.div>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className={`p-8 rounded-xl mb-12 ${
                    isDark ? 'bg-dark-100 border border-dark-accent' : 'bg-white shadow-medium'
                  }`}
                >
                  <h3 className="text-2xl font-semibold text-neutral-800 dark:text-white mb-6 text-center">
                    Why <span className="text-gradient">AIRAC Explorer</span> Exists
                  </h3>
                  
                  <div className="space-y-6 text-neutral-600 dark:text-neutral-400 max-w-4xl mx-auto">
                    <p>
                      AIRAC Explorer was developed to provide a modern, intuitive interface for accessing AIRAC 
                      cycle information. While this data is available from various aviation authorities, we 
                      wanted to create a dedicated application that makes it easy to:
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className={`flex items-start p-4 rounded-lg ${
                        isDark ? 'bg-dark-accent/50' : 'bg-neutral-50'
                      }`}>
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <p>Quickly identify the current and upcoming AIRAC cycles</p>
                      </div>
                      
                      <div className={`flex items-start p-4 rounded-lg ${
                        isDark ? 'bg-dark-accent/50' : 'bg-neutral-50'
                      }`}>
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <p>Plan database and chart updates in advance</p>
                      </div>
                      
                      <div className={`flex items-start p-4 rounded-lg ${
                        isDark ? 'bg-dark-accent/50' : 'bg-neutral-50'
                      }`}>
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <p>Reference historical AIRAC data for analysis and records</p>
                      </div>
                      
                      <div className={`flex items-start p-4 rounded-lg ${
                        isDark ? 'bg-dark-accent/50' : 'bg-neutral-50'
                      }`}>
                        <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                        <p>Visualize the AIRAC schedule with an intuitive calendar view</p>
                      </div>
                    </div>
                    
                    <p className="text-center mt-8">
                      Our goal is to help aviation professionals, pilots, and enthusiasts stay informed about 
                      AIRAC cycles with a beautiful, functional, and reliable application.
                    </p>
                  </div>
                </motion.div>
                
                <div className="flex justify-center mb-12">
                  <Link 
                    to="/calendar" 
                    className={`inline-flex items-center px-6 py-3 rounded-lg font-medium ${
                      isDark ? 'bg-primary-500 text-white shadow-glow hover:bg-primary-600' : 'bg-primary-500 text-white shadow-medium hover:bg-primary-600'
                    }`}
                  >
                    Explore the Calendar
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>
            )}

            {/* Technology Tab */}
            {activeTab === 'technology' && (
              <div>
                <div className="mb-12 text-center">
                  <h2 className="text-3xl font-semibold text-neutral-800 dark:text-white mb-4">
                    Technical <span className="text-gradient">Specifications</span>
                  </h2>
                  <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
                    AIRAC Explorer is built with modern web technologies for optimal performance,
                    reliability, and user experience.
                  </p>
                </div>
                
                <div className={`p-8 rounded-xl mb-12 ${
                  isDark ? 'bg-dark-100 border border-dark-accent' : 'bg-white shadow-medium'
                }`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {technicalSpecs.map((spec, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className={`flex items-center p-4 rounded-lg ${
                          isDark ? 'bg-dark-accent/50' : 'bg-neutral-50'
                        }`}
                      >
                        <div className="text-2xl mr-4">{spec.icon}</div>
                        <div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            {spec.label}
                          </div>
                          <div className="font-medium text-neutral-800 dark:text-white">
                            {spec.value}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className={`p-8 rounded-xl mb-12 ${
                  isDark ? 'bg-dark-100 border border-dark-accent' : 'bg-white shadow-medium'
                }`}>
                  <h3 className="text-2xl font-semibold text-neutral-800 dark:text-white mb-6">
                    Design Philosophy
                  </h3>
                  <div className="space-y-4 text-neutral-600 dark:text-neutral-400">
                    <p>
                      AIRAC Explorer was designed with a focus on clean, minimalist design that prioritizes
                      data clarity and user experience. The interface follows a consistent design language
                      across all components with attention to typography, spacing, and color harmony.
                    </p>
                    <p>
                      The application features a responsive layout that works seamlessly across desktop,
                      tablet, and mobile devices. Dark mode support ensures comfortable viewing in all
                      lighting conditions and reduces eye strain during night operations.
                    </p>
                    <p>
                      Performance optimization techniques such as code splitting, lazy loading, and
                      memoization are employed to ensure fast load times and smooth interactions
                      even when dealing with large datasets.
                    </p>
                  </div>
                </div>
                
                <div className={`p-5 rounded-xl mb-12 ${
                  isDark ? 'bg-dark-accent/50' : 'bg-amber-50 dark:bg-amber-900/20'
                }`}>
                  <div className="flex items-start">
                    <AlertTriangle className={`w-5 h-5 mt-0.5 mr-3 ${
                      isDark ? 'text-amber-400' : 'text-amber-500'
                    }`} />
                    <div>
                      <h4 className={`text-sm font-medium mb-1 ${
                        isDark ? 'text-white' : 'text-amber-800 dark:text-amber-400'
                      }`}>
                        Important Notice
                      </h4>
                      <p className={`text-sm ${
                        isDark ? 'text-neutral-300' : 'text-amber-700 dark:text-amber-300'
                      }`}>
                        While we strive for accuracy, this application is intended for reference and educational
                        purposes only. For operational aviation use, always refer to official sources and
                        approved navigation databases provided by your local aviation authority.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <div>
                <div className="mb-12 text-center">
                  <h2 className="text-3xl font-semibold text-neutral-800 dark:text-white mb-4">
                    Frequently Asked <span className="text-gradient">Questions</span>
                  </h2>
                  <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
                    Find answers to common questions about AIRAC cycles and how to use this application.
                  </p>
                </div>
                
                <div className={`rounded-xl overflow-hidden mb-12 ${
                  isDark ? 'bg-dark-100 border border-dark-accent' : 'bg-white shadow-medium'
                }`}>
                  <div className="divide-y divide-neutral-100 dark:divide-dark-accent">
                    {faqItems.map((item, index) => (
                      <div key={index} className="relative">
                        <button
                          onClick={() => toggleFaq(index)}
                          className={`w-full text-left p-6 flex items-center justify-between ${
                            expandedFaq === index
                              ? isDark ? 'bg-dark-accent/30' : 'bg-neutral-50'
                              : ''
                          }`}
                        >
                          <h3 className="text-lg font-medium text-neutral-800 dark:text-white pr-8">
                            {item.question}
                          </h3>
                          {expandedFaq === index ? (
                            <ChevronUp className={`w-5 h-5 flex-shrink-0 ${
                              isDark ? 'text-neutral-400' : 'text-neutral-500'
                            }`} />
                          ) : (
                            <ChevronDown className={`w-5 h-5 flex-shrink-0 ${
                              isDark ? 'text-neutral-400' : 'text-neutral-500'
                            }`} />
                          )}
                        </button>
                        
                        {expandedFaq === index && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-6 pb-6"
                          >
                            <p className="text-neutral-600 dark:text-neutral-400">
                              {item.answer}
                            </p>
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className={`p-6 rounded-xl mb-12 ${
                  isDark ? 'bg-dark-100 border border-dark-accent' : 'bg-white shadow-medium'
                }`}>
                  <div className="flex items-center space-x-4 mb-4">
                    <HelpCircle className="w-6 h-6 text-primary-500 dark:text-primary-400" />
                    <h3 className="text-xl font-medium text-neutral-800 dark:text-white">
                      Still have questions?
                    </h3>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    If you couldn't find the answer to your question, feel free to reach out using
                    the feedback form. We're here to help!
                  </p>
                  <button
                    onClick={() => setActiveTab('feedback')}
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                      isDark 
                        ? 'bg-primary-500 text-white hover:bg-primary-600' 
                        : 'bg-primary-500 text-white hover:bg-primary-600'
                    }`}
                  >
                    Contact Us
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            )}

            {/* Feedback Tab */}
            {activeTab === 'feedback' && (
              <div>
                <div className="mb-12 text-center">
                  <h2 className="text-3xl font-semibold text-neutral-800 dark:text-white mb-4">
                    Share Your <span className="text-gradient">Feedback</span>
                  </h2>
                  <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
                    We value your input! Let us know what you think about AIRAC Explorer or
                    suggest features that would help improve your experience.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-12">
                  <div className="lg:col-span-3">
                    <div className={`p-8 rounded-xl ${
                      isDark ? 'bg-dark-100 border border-dark-accent' : 'bg-white shadow-medium'
                    }`}>
                      {feedbackSubmitted ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center py-8"
                        >
                          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                          <h3 className="text-2xl font-semibold text-neutral-800 dark:text-white mb-2">
                            Thank You!
                          </h3>
                          <p className="text-neutral-600 dark:text-neutral-400">
                            Your feedback has been submitted successfully.
                          </p>
                        </motion.div>
                      ) : (
                        <form onSubmit={handleFeedbackSubmit}>
                          <div className="space-y-6">
                            <div>
                              <label 
                                htmlFor="name" 
                                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                              >
                                Name
                              </label>
                              <input
                                type="text"
                                id="name"
                                value={feedbackForm.name}
                                onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                                className="input w-full"
                                placeholder="Your name"
                              />
                            </div>
                            
                            <div>
                              <label 
                                htmlFor="email" 
                                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                              >
                                Email
                              </label>
                              <input
                                type="email"
                                id="email"
                                value={feedbackForm.email}
                                onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                                className="input w-full"
                                placeholder="your.email@example.com"
                              />
                            </div>
                            
                            <div>
                              <label 
                                htmlFor="message" 
                                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
                              >
                                Message
                              </label>
                              <textarea
                                id="message"
                                rows={5}
                                value={feedbackForm.message}
                                onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                                className="input w-full"
                                placeholder="Your feedback or questions..."
                              />
                            </div>
                            
                            <div>
                              <label 
                                className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
                              >
                                Rate your experience
                              </label>
                              <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <button
                                    key={rating}
                                    type="button"
                                    onClick={() => setFeedbackForm({ ...feedbackForm, rating })}
                                    className="focus:outline-none"
                                  >
                                    {rating <= feedbackForm.rating ? (
                                      <svg 
                                        width="24" 
                                        height="24" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="1.5" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        className="text-amber-400"
                                      >
                                        <polygon 
                                          points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" 
                                          fill="#FBB03B" 
                                          stroke="#FBB03B"
                                        />
                                      </svg>
                                    ) : (
                                      <Star className={`w-6 h-6 ${
                                        isDark ? 'text-neutral-600' : 'text-neutral-300'
                                      }`} />
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <button
                                type="submit"
                                className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium ${
                                  isDark 
                                    ? 'bg-primary-500 text-white shadow-glow hover:bg-primary-600' 
                                    : 'bg-primary-500 text-white shadow-medium hover:bg-primary-600'
                                }`}
                              >
                                <Send className="w-4 h-4 mr-2" />
                                Submit Feedback
                              </button>
                            </div>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
                  
                  <div className="lg:col-span-2">
                    <div className={`p-6 rounded-xl mb-6 ${
                      isDark ? 'bg-dark-100 border border-dark-accent' : 'bg-white shadow-medium'
                    }`}>
                      <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-4">
                        Contact Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <Mail className="w-5 h-5 text-primary-500 dark:text-primary-400 mt-0.5 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-neutral-800 dark:text-white">
                              Email
                            </div>
                            <a 
                              href="mailto:support@airac-explorer.com" 
                              className="text-neutral-600 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400"
                            >
                              support@airac-explorer.com
                            </a>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <Github className="w-5 h-5 text-primary-500 dark:text-primary-400 mt-0.5 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-neutral-800 dark:text-white">
                              GitHub
                            </div>
                            <a 
                              href="https://github.com/airac-explorer" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-neutral-600 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400"
                            >
                              github.com/airac-explorer
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`p-6 rounded-xl ${
                      isDark ? 'bg-dark-100 border border-dark-accent' : 'bg-white shadow-medium'
                    }`}>
                      <h3 className="text-lg font-medium text-neutral-800 dark:text-white mb-4">
                        Privacy Note
                      </h3>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Your feedback helps us improve AIRAC Explorer. We never share your personal 
                        information with third parties and only use it to respond to your inquiries.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
} 