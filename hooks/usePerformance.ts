"use client"

import { useState, useEffect, useCallback } from "react"

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  apiResponseTime: number
  memoryUsage: number
}

interface UsePerformanceReturn {
  metrics: PerformanceMetrics
  startTimer: (name: string) => void
  endTimer: (name: string) => void
  measureApiCall: (apiCall: () => Promise<any>) => Promise<any>
}

export function usePerformance(): UsePerformanceReturn {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    apiResponseTime: 0,
    memoryUsage: 0,
  })

  const [timers, setTimers] = useState<Record<string, number>>({})

  const startTimer = useCallback((name: string) => {
    setTimers((prev) => ({
      ...prev,
      [name]: performance.now(),
    }))
  }, [])

  const endTimer = useCallback(
    (name: string) => {
      const startTime = timers[name]
      if (startTime) {
        const endTime = performance.now()
        const duration = endTime - startTime

        setMetrics((prev) => ({
          ...prev,
          [name]: duration,
        }))
      }
    },
    [timers],
  )

  const measureApiCall = useCallback(async (apiCall: () => Promise<any>) => {
    const startTime = performance.now()
    try {
      const result = await apiCall()
      const endTime = performance.now()
      const duration = endTime - startTime

      setMetrics((prev) => ({
        ...prev,
        apiResponseTime: duration,
      }))

      return result
    } catch (error) {
      const endTime = performance.now()
      const duration = endTime - startTime

      setMetrics((prev) => ({
        ...prev,
        apiResponseTime: duration,
      }))

      throw error
    }
  }, [])

  useEffect(() => {
    // Measure memory usage if available
    if ("memory" in performance) {
      const memoryInfo = (performance as any).memory
      setMetrics((prev) => ({
        ...prev,
        memoryUsage: memoryInfo.usedJSHeapSize / 1024 / 1024, // Convert to MB
      }))
    }
  }, [])

  return {
    metrics,
    startTimer,
    endTimer,
    measureApiCall,
  }
}
