import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './features/store.js'
import './utils/axiosConfig.js'

// Suppress noisy external extension errors (e.g. mobx-state-tree / performance observer startTime)
// These come from browser extensions (VM* / sw.js), not from app code. In production they don't appear.
window.addEventListener('error', (e) => {
  const msg = e.message || ''
  const src = e.filename || ''
  if (msg.includes('startTime') || msg.includes('reportAllChanges') || src.includes('VM') || src.includes('sw.js')) {
    e.preventDefault()
    e.stopImmediatePropagation()
    return true
  }
}, true)
window.addEventListener('unhandledrejection', (e) => {
  const msg = e.reason?.message || String(e.reason) || ''
  if (msg.includes('startTime') || msg.includes('reportAllChanges')) {
    e.preventDefault()
  }
})
// Also filter console.error spam from extensions
const _origConsoleError = console.error
console.error = (...args) => {
  const first = String(args[0] || '')
  if (first.includes('startTime') || first.includes('reportAllChanges') || first.includes('VM262') || first.includes('VM3569')) return
  _origConsoleError.apply(console, args)
}
// Patch PerformanceObserver to guard extension's buggy callback that reads entry.startTime when entry is undefined
if (typeof PerformanceObserver !== 'undefined') {
  const OriginalPO = window.PerformanceObserver
  window.PerformanceObserver = function(callback, options) {
    const wrappedCallback = (list, observer, ...rest) => {
      try {
        const entries = list.getEntries ? list.getEntries() : []
        const hasInvalid = entries.some(e => !e || typeof e.startTime === 'undefined')
        if (hasInvalid) return
        return callback(list, observer, ...rest)
      } catch (err) {
        if (String(err.message).includes('startTime') || String(err.message).includes('reportAllChanges')) return
        throw err
      }
    }
    return new OriginalPO(wrappedCallback, options)
  }
  window.PerformanceObserver.prototype = OriginalPO.prototype
  Object.setPrototypeOf(window.PerformanceObserver, OriginalPO)
  // Copy static members safely (skip read-only like supportedEntryTypes)
  Object.getOwnPropertyNames(OriginalPO).forEach(k => {
    try {
      if (k === 'prototype' || k === 'length' || k === 'name') return
      const desc = Object.getOwnPropertyDescriptor(OriginalPO, k)
      if (desc && desc.writable === false) return
      window.PerformanceObserver[k] = OriginalPO[k]
    } catch {}
  })
  if (OriginalPO.supportedEntryTypes) {
    try {
      Object.defineProperty(window.PerformanceObserver, 'supportedEntryTypes', {
        get: () => OriginalPO.supportedEntryTypes,
        configurable: true
      })
    } catch {}
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
