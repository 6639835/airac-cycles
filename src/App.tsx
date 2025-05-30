import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { Layout } from '@/components/Layout'
import { HomePage } from '@/pages/HomePage'
import { CalendarPage } from '@/pages/CalendarPage'
import { CycleDetailPage } from '@/pages/CycleDetailPage'
import { AnalyticsPage } from '@/pages/AnalyticsPage'
import { AboutPage } from '@/pages/AboutPage'

function ScrollToTop() {
  const location = useLocation()
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
  
  return null
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
          <Layout>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/cycle/:cycleId" element={<CycleDetailPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/about" element={<AboutPage />} />
              </Routes>
            </motion.div>
          </Layout>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App 