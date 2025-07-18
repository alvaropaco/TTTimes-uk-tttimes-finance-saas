"use client"

import { useEffect, useState } from "react"

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage?: number
}

/**
 * Collects basic web-vitals once the page has fully loaded.
 * Returns `null` while the metrics are being gathered.
 */
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)

  useEffect(() => {
    const measurePerformance = () => {
      if (typeof performance === "undefined") return

      const navEntry = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
      const loadTime = navEntry.loadEventEnd - navEntry.loadEventStart
      const renderTime = navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart

      let memoryUsage: number | undefined
      // The `memory` API is experimental and only exists in Chromium-based browsers.
      if ("memory" in performance) {
        // @ts-ignore – memory is not yet in the TS lib
        const usedJSHeapSize = (performance as any).memory.usedJSHeapSize
        memoryUsage = usedJSHeapSize / 1024 / 1024 // convert to MB
      }

      const collected: PerformanceMetrics = { loadTime, renderTime, memoryUsage }
      setMetrics(collected)

      if (process.env.NODE_ENV === "development") {
        console.table({
          "Page Load": `${loadTime.toFixed(2)} ms`,
          "DOM Content Loaded": `${renderTime.toFixed(2)} ms`,
          "JS Heap Used": memoryUsage ? `${memoryUsage.toFixed(2)} MB` : "N/A",
        })
      }
    }

    if (document.readyState === "complete") {
      measurePerformance()
    } else {
      window.addEventListener("load", measurePerformance)
      return () => window.removeEventListener("load", measurePerformance)
    }
  }, [])

  return metrics
}

/**
 * Logs component render duration when unmounted.
 * Warns in dev if render took longer than one frame (~16 ms).
 */
export function useRenderTime(componentName: string) {
  useEffect(() => {
    const start = performance.now()
    return () => {
      const duration = performance.now() - start
      if (process.env.NODE_ENV === "development" && duration > 16) {
        console.warn(`⚠️  Slow render detected in ${componentName}: ${duration.toFixed(2)} ms`)
      }
    }
  }, [componentName])
}

/**
 * Measures the duration of an async API call.
 * Returns the wrapped result and logs slow requests (>1 s) in dev.
 */
export function useApiPerformance() {
  const measureApiCall = async (apiCall: () => Promise<any>, endpoint: string): Promise<any> => {
    const start = performance.now()

    try {
      const result = await apiCall()
      const duration = performance.now() - start

      if (process.env.NODE_ENV === "development") {
        console.log(`↪️  ${endpoint} – ${duration.toFixed(2)} ms`)
      }
      if (duration > 1000) {
        console.warn(`🐢  Slow API call detected: ${endpoint} took ${duration.toFixed(2)} ms`)
      }

      return result
    } catch (error) {
      const duration = performance.now() - start
      console.error(`❌  ${endpoint} failed after ${duration.toFixed(2)} ms`, error)
      throw error
    }
  }

  return { measureApiCall }
}
