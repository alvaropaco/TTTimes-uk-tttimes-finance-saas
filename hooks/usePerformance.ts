"use client"

import { useEffect, useState } from "react"

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage?: number | undefined
}

export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)

  useEffect(() => {
    const measurePerformance = () => {
      if (typeof window !== "undefined" && "performance" in window) {
        const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart
        const renderTime = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart

        let memoryUsage: number | undefined
        if ("memory" in performance) {
          const memory = (performance as any).memory
          memoryUsage = memory.usedJSHeapSize / 1024 / 1024 // Convert to MB
        }

        setMetrics({
          loadTime,
          renderTime,
          memoryUsage,
        })

        // Log performance metrics in development
        if (process.env.NODE_ENV === "development") {
          console.log("Performance Metrics:", {
            loadTime: `${loadTime.toFixed(2)}ms`,
            renderTime: `${renderTime.toFixed(2)}ms`,
            memoryUsage: memoryUsage ? `${memoryUsage.toFixed(2)}MB` : "N/A",
          })
        }
      }
    }

    // Measure after the page has fully loaded
    if (typeof document !== "undefined") {
      if (document.readyState === "complete") {
        measurePerformance()
        return undefined
      } else {
        window.addEventListener("load", measurePerformance)
        return () => window.removeEventListener("load", measurePerformance)
      }
    }
    
    return undefined
  }, [])

  return metrics
}

// Hook for measuring component render time
export function useRenderTime(componentName: string) {
  useEffect(() => {
    const startTime = performance.now()

    return () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime

      if (process.env.NODE_ENV === "development" && renderTime > 16) {
        // Log slow renders (>16ms for 60fps)
        console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`)
      }
    }
  }, [componentName])
}

// Hook for API call performance monitoring
export function useApiPerformance() {
  const measureApiCall = async <T>(
    apiCall: () => Promise<T>,
    endpoint: string
  ): Promise<T> => {
    const startTime = performance.now()

    try {
      const result = await apiCall()
      const endTime = performance.now()
      const duration = endTime - startTime

      if (process.env.NODE_ENV === "development") {
        console.log(`API Call ${endpoint}: ${duration.toFixed(2)}ms`)
      }

      // Log slow API calls
      if (duration > 1000) {
        console.warn(`Slow API call detected: ${endpoint} took ${duration.toFixed(2)}ms`)
      }

      return result
    } catch (error) {
      const endTime = performance.now()
      const duration = endTime - startTime
      console.error(`API Call ${endpoint} failed after ${duration.toFixed(2)}ms:`, error)
      throw error
    }
  }

  return { measureApiCall }
}