import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

import Nav from './components/layout/Nav'
import Footer from './components/layout/Footer'
import SmoothScroll from './components/layout/SmoothScroll'
import PageTransition from './components/layout/PageTransition'
import CursorLabel from './components/fx/CursorLabel'

import Home from './routes/Home'
// Only the home page ships in the main bundle; the rest load when visited.
const CaseStudyPage = lazy(() => import('./routes/CaseStudyPage'))
const NotFound = lazy(() => import('./routes/NotFound'))

/** Route changes should land at the top — except in-page hash links. */
function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) return
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  const location = useLocation()

  return (
    <SmoothScroll>
      <CursorLabel />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-canvas"
      >
        Skip to content
      </a>

      <ScrollToTop />
      <Nav />

      <main id="main">
        <PageTransition key={location.pathname}>
          <Suspense fallback={<div className="min-h-svh" />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/design/:slug" element={<CaseStudyPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </PageTransition>
      </main>

      <Footer />
    </SmoothScroll>
  )
}
