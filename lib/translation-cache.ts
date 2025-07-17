import crypto from 'crypto'
import { Database } from './database'

/**
 * Generate a consistent hash for text content
 */
export function generateTextHash(text: string): string {
  return crypto.createHash('sha256').update(text.trim().toLowerCase()).digest('hex')
}

/**
 * Translation cache service with performance optimizations
 */
export class TranslationCacheService {
  private static readonly CACHE_EXPIRY_DAYS = 30
  private static readonly MAX_TEXT_LENGTH = 10000 // Limit cache to reasonable text sizes
  
  /**
   * Get cached translation if available
   */
  static async getCachedTranslation(
    text: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<string | null> {
    try {
      // Skip cache for very long texts to avoid performance issues
      if (text.length > this.MAX_TEXT_LENGTH) {
        return null
      }
      
      const textHash = generateTextHash(text)
      const cached = await Database.getCachedTranslation(
        textHash,
        sourceLanguage,
        targetLanguage
      )
      
      return cached?.translatedText || null
    } catch (error) {
      console.error('Error getting cached translation:', error)
      return null
    }
  }
  
  /**
   * Store translation in cache
   */
  static async setCachedTranslation(
    originalText: string,
    translatedText: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<void> {
    try {
      // Skip cache for very long texts
      if (originalText.length > this.MAX_TEXT_LENGTH) {
        return
      }
      
      const textHash = generateTextHash(originalText)
      await Database.setCachedTranslation(
        textHash,
        originalText,
        translatedText,
        sourceLanguage,
        targetLanguage
      )
    } catch (error) {
      console.error('Error setting cached translation:', error)
      // Don't throw error to avoid breaking translation flow
    }
  }
  
  /**
   * Clean up old cache entries
   */
  static async cleanupCache(): Promise<number> {
    try {
      return await Database.cleanupOldTranslations(this.CACHE_EXPIRY_DAYS)
    } catch (error) {
      console.error('Error cleaning up translation cache:', error)
      return 0
    }
  }
  
  /**
   * Get cache statistics
   */
  static async getCacheStats() {
    try {
      return await Database.getTranslationCacheStats()
    } catch (error) {
      console.error('Error getting cache stats:', error)
      return {
        totalEntries: 0,
        totalSize: 0,
        mostUsed: [],
      }
    }
  }
}
