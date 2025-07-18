"use client"

import { useEffect, useState, useCallback } from "react"

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage: number
  connectionType: string
}

interface UsePerformanceReturn {
  metrics: PerformanceMetrics | null
  isLoading: boolean
  error: string | null
  measureRender: () => void
}

export function usePerformance(): UsePerformanceReturn {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const measureRender = useCallback(() => {
    try {
      const renderStart = performance.now()

      // Use requestAnimationFrame to measure render time
      requestAnimationFrame(() => {
        const renderEnd = performance.now()
        const renderTime = renderEnd - renderStart

        setMetrics(
          (prev) =>
            ({
              ...prev,
              renderTime,
            }) as PerformanceMetrics,
        )
      })
    } catch (err) {
      setError("Failed to measure render time")
    }
  }, [])

  useEffect(() => {
    const measurePerformance = async () => {
      try {
        setIsLoading(true)

        // Get navigation timing
        const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
        const loadTime = navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0

        // Get memory usage (if available)
        const memoryInfo = (performance as any).memory
        const memoryUsage = memoryInfo ? memoryInfo.usedJSHeapSize / 1024 / 1024 : 0

        // Get connection info (if available)
        const connection = (navigator as any).connection
        const connectionType = connection ? connection.effectiveType || "unknown" : "unknown"

        const performanceMetrics: PerformanceMetrics = {
          loadTime,
          renderTime: 0,
          memoryUsage,
          connectionType,
        }

        setMetrics(performanceMetrics)
        setError(null)
      } catch (err) {
        setError("Failed to measure performance")
        console.error("Performance measurement error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    // Wait for page to load before measuring
    if (document.readyState === "complete") {
      measurePerformance()
    } else {
      window.addEventListener("load", measurePerformance)
      return () => window.removeEventListener("load", measurePerformance)
    }
  }, [])

  return {
    metrics,
    isLoading,
    error,
    measureRender,
  }
}

export default usePerformance
