import { useState } from 'react'
import { motion } from 'framer-motion'
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
  Coffee
} from 'lucide-react'

export function AboutPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-500 rounded-2xl blur-2xl opacity-20"></div>
              <div className="relative bg-gradient-to-br from-primary-500 to-primary-700 p-6 rounded-2xl">
                <Plane className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
            About AIRAC Explorer
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            A modern, comprehensive web application for exploring Aeronautical Information 
            Regulation and Control (AIRAC) cycles. Built for aviation professionals, pilots, 
            and enthusiasts who need reliable access to AIRAC date information.
          </p>
          
          {/* Tab Navigation */}
          <div className="mt-8 flex justify-center">
            <div className="flex bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
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
          transition={{ duration: 0.5 }}
        >
          {activeTab === 'features' && (
            <div className="space-y-12">
              {/* What is AIRAC */}
              <div className="card">
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-accent-500 p-3 rounded-xl">
                      <Info className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        What is AIRAC?
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Understanding the global aviation standard
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        <strong>AIRAC (Aeronautical Information Regulation and Control)</strong> is a 
                        standardized system established by the International Civil Aviation Organization 
                        (ICAO) to ensure synchronized worldwide updates of aeronautical information.
                      </p>
                      
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        The system operates on a fixed 28-day cycle, with 13 cycles per year. This 
                        ensures that critical navigation data, procedure changes, and airport information 
                        are updated simultaneously across the globe, maintaining safety and consistency 
                        in international aviation.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Key AIRAC Facts
                      </h3>
                      <div className="space-y-3">
                        {airacFacts.map((fact, index) => (
                          <motion.div 
                            key={index}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-lg">{fact.icon}</span>
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                {fact.label}
                              </span>
                            </div>
                            <span className="text-sm text-gray-900 dark:text-white font-semibold">
                              {fact.value}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features Grid */}
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Modern Features
                  </h2>
                  <p className="text-xl text-gray-600 dark:text-gray-400">
                    Built with cutting-edge technology for the modern aviation industry
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="card-hover group"
                    >
                      <div className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="bg-primary-500 p-2 rounded-lg group-hover:scale-110 transition-transform duration-200">
                            <feature.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {feature.title}
                            </h3>
                            <div className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                              {feature.highlight}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'technical' && (
            <div className="space-y-8">
              <div className="card">
                <div className="p-8">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-green-500 p-3 rounded-xl">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Technical Specifications
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Modern web technologies for optimal performance
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {technicalSpecs.map((spec, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{spec.icon}</span>
                          <span className="font-medium text-gray-700 dark:text-gray-300">
                            {spec.label}
                          </span>
                        </div>
                        <span className="text-gray-900 dark:text-white font-semibold text-right max-w-xs">
                          {spec.value}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Frequently Asked Questions
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Common questions about AIRAC and this application
                </p>
              </div>

              <div className="space-y-4">
                {faqItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card border border-gray-200 dark:border-gray-700"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {item.question}
                      </h3>
                      {expandedFaq === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 pb-6"
                      >
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  We Value Your Feedback
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  Help us improve AIRAC Explorer with your suggestions and comments
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card">
                  <div className="p-8">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      Share Your Thoughts
                    </h3>
                    
                    {feedbackSubmitted ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                      >
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          Thank you for your feedback!
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                          We appreciate your input and will use it to improve the application.
                        </p>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            placeholder="Your Name"
                            value={feedbackForm.name}
                            onChange={(e) => setFeedbackForm(prev => ({ ...prev, name: e.target.value }))}
                            className="input"
                            required
                          />
                          <input
                            type="email"
                            placeholder="Your Email (optional)"
                            value={feedbackForm.email}
                            onChange={(e) => setFeedbackForm(prev => ({ ...prev, email: e.target.value }))}
                            className="input"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            How would you rate this application?
                          </label>
                          <div className="flex space-x-2">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <button
                                key={rating}
                                type="button"
                                onClick={() => setFeedbackForm(prev => ({ ...prev, rating }))}
                                className={`p-2 rounded transition-colors ${
                                  rating <= feedbackForm.rating
                                    ? 'text-yellow-500'
                                    : 'text-gray-300 dark:text-gray-600'
                                }`}
                              >
                                <Star className="w-6 h-6 fill-current" />
                              </button>
                            ))}
                          </div>
                        </div>
                        
                        <textarea
                          placeholder="Your feedback, suggestions, or comments..."
                          value={feedbackForm.message}
                          onChange={(e) => setFeedbackForm(prev => ({ ...prev, message: e.target.value }))}
                          className="input h-32 resize-none"
                          required
                        />
                        
                        <button
                          type="submit"
                          className="btn-primary w-full flex items-center justify-center space-x-2"
                        >
                          <Send className="w-4 h-4" />
                          <span>Submit Feedback</span>
                        </button>
                      </form>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="card">
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-primary-500 p-2 rounded-lg">
                          <Github className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Open Source
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        This project is open source. Contribute, report issues, or suggest features on GitHub.
                      </p>
                      <button className="btn-secondary flex items-center space-x-2">
                        <Github className="w-4 h-4" />
                        <span>View on GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="card">
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-blue-500 p-2 rounded-lg">
                          <Mail className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Contact Us
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Have questions or need support? Get in touch with our team.
                      </p>
                      <button className="btn-secondary flex items-center space-x-2">
                        <Mail className="w-4 h-4" />
                        <span>Send Email</span>
                      </button>
                    </div>
                  </div>

                  <div className="card">
                    <div className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-yellow-500 p-2 rounded-lg">
                          <Coffee className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Support Development
                        </h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Enjoy using AIRAC Explorer? Consider supporting its development.
                      </p>
                      <button className="btn-secondary flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span>Buy us a coffee</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Important Notice - Always visible */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="card mt-12 border-l-4 border-l-yellow-500"
        >
          <div className="p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-yellow-500 p-3 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Important Notice
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  For operational aviation use
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
              <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4">
                <strong>This application is designed for reference and educational purposes.</strong> 
                While we strive for accuracy, for actual operational use in aviation, always refer 
                to official aviation authority sources such as:
              </p>
              
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>International Civil Aviation Organization (ICAO)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Federal Aviation Administration (FAA)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>European Union Aviation Safety Agency (EASA)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Your local civil aviation authority</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 