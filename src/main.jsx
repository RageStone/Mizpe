import React from 'react'
import ReactDOM from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import App from './App'
import './index.css'

const rootElement = document.getElementById('root')

if (rootElement) {
  // Clear any loading content
  rootElement.innerHTML = ''
  
  // Check for reduced motion preference (respect accessibility)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      {/* MotionConfig ensures consistent Framer Motion behavior across the app */}
      {/* Respects reduced motion preference but keeps essential transitions */}
      <MotionConfig
        reducedMotion={prefersReducedMotion ? 'user' : 'never'}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      >
        <App />
      </MotionConfig>
    </React.StrictMode>
  )
} else {
  console.error('Root element not found')
}

// Development diagnostics (dev-only)
if (import.meta.env.DEV) {
  console.log('Mobile Layout Diagnostics:', {
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    clientHeight: document.documentElement.clientHeight,
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    safeAreaInsets: {
      top: getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-top)'),
      bottom: getComputedStyle(document.documentElement).getPropertyValue('env(safe-area-inset-bottom)'),
    }
  })
}

