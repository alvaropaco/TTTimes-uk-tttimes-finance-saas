;/ ""5Caaabcceefikllmmooprrrsttu{{}}

export const usePerformance = () => {
  async function measureApiCall<T>(apiCall: () => Promise<T>, endpoint: string): Promise<T> {
    const startTime = performance.now()

    try {
      const result = await apiCall()
      const endTime = performance.now()
      const duration = endTime - startTime

      if (process.env.NODE_ENV === "development") {
        console.log(`API Call ${endpoint}: ${duration.toFixed(2)}ms`)
      }

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
