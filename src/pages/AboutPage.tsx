import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Plane, 
  Calendar, 
  Globe, 
  Clock,
  BookOpen,
  Shield,
  Zap,
  Heart,
  Github,
  Mail,
  ExternalLink,
  Info,
  AlertTriangle,
  CheckCircle,
  Send,
  MessageSquare,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Star,
  Code,
  Coffee,
  ArrowRight
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

export function AboutPage() {
  const { isDark } = useTheme()
  const [activeTab, setActiveTab] = useState('features')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    message: '',
    rating: 5
  })
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  const tabs = [
    { id: 'features', label: 'Features', icon: Zap },
    { id: 'technical', label: 'Technical', icon: Code },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare }
  ]

  const faqItems = [
    {
      question: "What is AIRAC and why is it important?",
      answer: "AIRAC (Aeronautical Information Regulation and Control) is a standardized system established by ICAO to ensure synchronized worldwide updates of aeronautical information every 28 days. This maintains safety and consistency in international aviation."
    },
    {
      question: "How accurate is the data in this application?",
      answer: "The AIRAC cycle dates are calculated based on the official ICAO standard of 28-day cycles. However, for operational use, always refer to official aviation authority sources like FAA, EASA, or your local civil aviation authority."
    },
    {
      question: "Can I use this for actual flight planning?",
      answer: "This application is designed for reference and educational purposes. For actual flight planning and operational use, always use official sources and approved navigation databases."
    },
    {
      question: "What are the keyboard shortcuts available?",
      answer: "Press '?' on the homepage to see all available keyboard shortcuts including 'C' for current cycle, 'G' to toggle views, 'S' to focus search, and 'R' to reset filters."
    },
    {
      question: "How do I export AIRAC data?",
      answer: "You can export data in multiple formats (JSON, CSV, iCal) from the Analytics page or individual cycle pages. The Calendar page also supports calendar exports."
    },
    {
      question: "Is this application open source?",
      answer: "Yes! This application is built with modern web technologies and the source code is available. You can contribute or suggest improvements through our GitHub repository."
    }
  ]

  const features = [
    {
      icon: Calendar,
      title: "Complete Database",
      description: "975 AIRAC cycles from 2025 to 2099 with precise 28-day intervals",
      highlight: "975 cycles"
    },
    {
      icon: Clock,
      title: "Real-time Tracking",
      description: "Live current cycle status with progress indicators and countdown timers",
      highlight: "Live updates"
    },
    {
      icon: Zap,
      title: "Modern Interface",
      description: "Built with React, TypeScript, and Tailwind CSS for optimal performance",
      highlight: "Lightning fast"
    },
    {
      icon: Globe,
      title: "Responsive Design",
      description: "Works seamlessly across desktop, tablet, and mobile devices",
      highlight: "All devices"
    },
    {
      icon: BookOpen,
      title: "Multiple Views",
      description: "Grid, list, calendar, and analytics views for different use cases",
      highlight: "4 view modes"
    },
    {
      icon: Shield,
      title: "Type Safety",
      description: "TypeScript ensures reliability and prevents runtime errors",
      highlight: "Zero errors"
    }
  ]

  const technicalSpecs = [
    { label: "Framework", value: "React 18 with TypeScript", icon: "⚛️" },
    { label: "Styling", value: "Tailwind CSS with custom design system", icon: "🎨" },
    { label: "Build Tool", value: "Vite for fast development and optimized builds", icon: "⚡" },
    { label: "Icons", value: "Lucide React for consistent iconography", icon: "🎯" },
    { label: "Animations", value: "Framer Motion for smooth transitions", icon: "✨" },
    { label: "Date Handling", value: "date-fns for reliable date calculations", icon: "📅" },
    { label: "Performance", value: "Code splitting and lazy loading", icon: "🚀" },
    { label: "Accessibility", value: "WCAG 2.1 compliant with screen reader support", icon: "♿" }
  ]

  const airacFacts = [
    { label: "Cycle Duration", value: "28 days (exactly 4 weeks)", icon: "⏱️" },
    { label: "Annual Cycles", value: "13 cycles per year", icon: "📅" },
    { label: "Global Standard", value: "ICAO Annex 15 specification", icon: "🌍" },
    { label: "Update Schedule", value: "Every 28 days worldwide", icon: "🔄" },
    { label: "Coverage", value: "All international airports and airways", icon: "✈️" },
    { label: "First Implementation", value: "1998 for global coordination", icon: "🏁" }
  ]

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    setFeedbackSubmitted(true)
    setTimeout(() => {
      setFeedbackSubmitted(false)
      setFeedbackForm({ name: '', email: '', message: '', rating: 5 })
    }, 2000)
  }

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index)
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
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className={`absolute inset-0 rounded-2xl blur-2xl opacity-20 ${
                isDark ? 'bg-primary-500' : 'bg-primary-500'
              }`}></div>
              <div className={`relative p-6 rounded-2xl ${
                isDark ? 'bg-gradient-to-br from-primary-600 to-primary-800 shadow-glow' : 'bg-gradient-to-br from-primary-500 to-primary-700'
              }`}>
                <Plane className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-semibold text-gradient mb-4">
            About AIRAC Explorer
          </h1>
          <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-4xl mx-auto leading-relaxed">
            A modern, comprehensive web application for exploring Aeronautical Information 
            Regulation and Control (AIRAC) cycles. Built for aviation professionals, pilots, 
            and enthusiasts who need reliable access to AIRAC date information.
          </p>
          
          {/* Tab Navigation */}
          <div className="mt-8 flex justify-center">
            <div className={`flex rounded-lg p-1 ${
              isDark ? 'bg-dark-100 border border-dark-accent' : 'bg-white shadow-medium'
            }`}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded transition-all duration-200 ${
                    activeTab === tab.id
                      ? isDark 
                        ? 'bg-primary-500 text-white shadow-glow' 
                        : 'bg-primary-500 text-white shadow-medium'
                      : isDark
                        ? 'text-neutral-400 hover:text-neutral-300' 
                        : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
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

          {/* Technical Tab */}
          {activeTab === 'technical' && (
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
                                  <Star className={`w-6 h-6 ${
                                    rating <= feedbackForm.rating
                                      ? 'text-amber-400 fill-amber-400'
                                      : isDark ? 'text-neutral-600' : 'text-neutral-300'
                                  }`} />
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
                    <div className="flex items-center mb-4">
                      <Coffee className="w-5 h-5 text-primary-500 dark:text-primary-400 mr-3" />
                      <h3 className="text-lg font-medium text-neutral-800 dark:text-white">
                        Support the Project
                      </h3>
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                      If you find AIRAC Explorer useful, consider supporting the project.
                      Your contribution helps maintain and improve this free tool.
                    </p>
                    <a 
                      href="#" 
                      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                        isDark 
                          ? 'bg-amber-500 text-white hover:bg-amber-600' 
                          : 'bg-amber-500 text-white hover:bg-amber-600'
                      }`}
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Buy us a coffee
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
        
        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-dark-accent text-center">
          <p className="text-neutral-600 dark:text-neutral-400">
            &copy; {new Date().getFullYear()} AIRAC Explorer. All rights reserved.
          </p>
          <div className="flex justify-center mt-4 space-x-4">
            <Link 
              to="/" 
              className="text-neutral-600 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400"
            >
              Home
            </Link>
            <Link 
              to="/calendar" 
              className="text-neutral-600 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400"
            >
              Calendar
            </Link>
            <Link 
              to="/analytics" 
              className="text-neutral-600 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400"
            >
              Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 