import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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

function AppContent() {
  const location = useLocation()
  
  return (
    <>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Layout>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
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
      </AnimatePresence>
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  )
}

export default App 