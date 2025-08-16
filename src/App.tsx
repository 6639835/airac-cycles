import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, Suspense, lazy } from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ComponentLoader } from '@/components/LoadingSpinner'
import { AccessibilityProvider, SkipLink } from '@/components/AccessibilityProvider'
import { Layout } from '@/components/Layout'

// Lazy load pages for better performance
const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })))
const CalendarPage = lazy(() => import('@/pages/CalendarPage').then(m => ({ default: m.CalendarPage })))
const CycleDetailPage = lazy(() => import('@/pages/CycleDetailPage').then(m => ({ default: m.CycleDetailPage })))
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })))
const AboutPage = lazy(() => import('@/pages/AboutPage').then(m => ({ default: m.AboutPage })))

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
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <AnimatePresence mode="wait">
        <Layout>
          <main id="main-content" tabIndex={-1}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Suspense fallback={<ComponentLoader text="Loading page..." />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/calendar" element={<CalendarPage />} />
                  <Route path="/cycle/:cycleId" element={<CycleDetailPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/about" element={<AboutPage />} />
                </Routes>
              </Suspense>
            </motion.div>
          </main>
        </Layout>
      </AnimatePresence>
    </>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <ThemeProvider>
          <Router>
            <ErrorBoundary>
              <AppContent />
            </ErrorBoundary>
          </Router>
        </ThemeProvider>
      </AccessibilityProvider>
    </ErrorBoundary>
  )
}

export default App 