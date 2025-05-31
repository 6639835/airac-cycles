import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plane, 
  Moon, 
  Sun, 
  Menu, 
  X, 
  Home, 
  BarChart3, 
  Info,
  Calendar
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { theme, toggleTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'About', href: '/about', icon: Info },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-900 transition-colors duration-300">
      {/* Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-lg bg-white/80 dark:bg-neutral-900/80 shadow-soft' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 focus-ring rounded-lg p-1 -ml-1">
              <div className="relative">
                <div className="bg-primary-500 p-2 rounded-md">
                  <Plane className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary-500 dark:text-white">
                  AIRAC Explorer
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 tracking-wide">
                  Premium Edition
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus-ring ${
                    isActive(item.href)
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-500 dark:text-primary-400'
                      : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Theme Toggle & Mobile Menu */}
            <div className="flex items-center space-x-1">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-ring"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors focus-ring md:hidden"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-500 dark:text-primary-400'
                        : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-4 pb-16">
        <div className="relative">
          <div className="subtle-noise" aria-hidden="true"></div>
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-100 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-primary-500 p-2 rounded-md">
                  <Plane className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-medium text-neutral-900 dark:text-white">
                  AIRAC Explorer
                </h3>
              </div>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                Modern, comprehensive AIRAC cycles database for aviation professionals. 
                Built with precision for the premium experience.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-neutral-900 dark:text-white mb-4">
                About AIRAC
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                The AIRAC system ensures synchronized updates of aeronautical 
                information worldwide on a standardized 28-day cycle schedule.
              </p>
            </div>

            <div>
              <h4 className="font-medium text-neutral-900 dark:text-white mb-4">
                Important Notice
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                For operational use, always refer to official aviation authority sources. 
                This tool is for reference and educational purposes.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                © 2024 AIRAC Explorer. Built with modern web technologies.
              </p>
              <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-2 md:mt-0">
                Version 2.1.0 - Premium Edition
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 