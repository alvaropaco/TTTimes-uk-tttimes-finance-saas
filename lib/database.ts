import { type Collection, type Db, type MongoClient, ObjectId } from "mongodb"
import { Pool } from "pg"
import { getMongoClient } from "./vercel-mongodb"

// PostgreSQL Pool (for compatibility)
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

export default pool

// MongoDB Database Interface
interface User {
  _id?: ObjectId
  name: string
  email: string
  token: string
  plan: string
  createdAt?: Date
  updatedAt?: Date
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  organizationName?: string
  organizationDomain?: string
}

interface Organization {
  _id?: ObjectId
  name: string
  domain: string
  ownerId: ObjectId
  createdAt?: Date
  updatedAt?: Date
}

interface UsageRecord {
  _id?: ObjectId
  userId: ObjectId
  endpoint: string
  method?: string
  status_code?: number
  response_time_ms?: number
  ip?: string
  userAgent?: string
  createdAt?: Date
}

interface ApiUsage {
  _id?: ObjectId
  userId?: ObjectId
  endpoint: string
  method?: string
  status_code?: number
  response_time_ms?: number
  ip?: string
  userAgent?: string
  createdAt?: Date
}

export interface TranslationCache {
  _id?: string
  textHash: string
  originalText: string
  translatedText: string
  sourceLanguage: string
  targetLanguage: string
  createdAt?: Date
  updatedAt?: Date
  accessCount?: number
  lastAccessed?: Date
}

export class Database {
  private static client: MongoClient | null = null
  private static db: Db | null = null

  private static async getClient(): Promise<MongoClient> {
    if (!this.client) {
      this.client = await getMongoClient()
    }
    return this.client
  }

  private static async getDb(): Promise<Db> {
    if (!this.db) {
      const client = await this.getClient()
      this.db = client.db(process.env.MONGODB_DB_NAME || "zodii")
    }
    return this.db
  }

  private static async getUsersCollection(): Promise<Collection<User>> {
    const db = await this.getDb()
    return db.collection<User>("users")
  }

  private static async getOrganizationsCollection(): Promise<Collection<Organization>> {
    const db = await this.getDb()
    return db.collection<Organization>("organizations")
  }

  private static async getUsageCollection(): Promise<Collection<UsageRecord>> {
    const db = await this.getDb()
    return db.collection<UsageRecord>("usage")
  }

  // User Methods
  static async createUser(userData: Omit<User, "_id" | "createdAt" | "updatedAt">): Promise<User> {
    const users = await this.getUsersCollection()
    const now = new Date()

    const user: User = {
      ...userData,
      createdAt: now,
      updatedAt: now,
    }

    const result = await users.insertOne(user)
    return { ...user, _id: result.insertedId }
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    const users = await this.getUsersCollection()
    return await users.findOne({ email })
  }

  static async findUserByToken(token: string): Promise<User | null> {
    const users = await this.getUsersCollection()
    return await users.findOne({ token })
  }

  static async getUserByToken(token: string): Promise<User | null> {
    return await this.findUserByToken(token)
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const users = await this.getUsersCollection()
    const result = await users.findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: { ...updates, updatedAt: new Date() } },
      { returnDocument: "after" },
    )
    return result
  }

  static async deleteUser(userId: string): Promise<boolean> {
    const users = await this.getUsersCollection()
    const result = await users.deleteOne({ _id: new ObjectId(userId) })
    return result.deletedCount > 0
  }

  // Organization Methods
  static async createOrganization(
    orgData: Omit<Organization, "_id" | "createdAt" | "updatedAt">,
  ): Promise<Organization> {
    const organizations = await this.getOrganizationsCollection()
    const now = new Date()

    const organization: Organization = {
      ...orgData,
      createdAt: now,
      updatedAt: now,
    }

    const result = await organizations.insertOne(organization)
    return { ...organization, _id: result.insertedId }
  }

  static async findOrganizationByDomain(domain: string): Promise<Organization | null> {
    const organizations = await this.getOrganizationsCollection()
    return await organizations.findOne({ domain })
  }

  // Usage Tracking Methods
  static async recordUsage(
    userId: string,
    endpoint: string,
    responseTime?: number,
    statusCode?: number,
  ): Promise<void> {
    const usage = await this.getUsageCollection()
    await usage.insertOne({
      userId: new ObjectId(userId),
      endpoint,
      createdAt: new Date(),
      response_time_ms: responseTime,
      status_code: statusCode,
    })
  }

  static async getUserUsage(userId: string, startDate?: Date, endDate?: Date): Promise<UsageRecord[]> {
    const usage = await this.getUsageCollection()
    const query: any = { userId: new ObjectId(userId) }

    if (startDate || endDate) {
      query.timestamp = {}
      if (startDate) query.timestamp.$gte = startDate
      if (endDate) query.timestamp.$lte = endDate
    }

    return await usage.find(query).sort({ timestamp: -1 }).toArray()
  }

  static async updateUserUsage(token: string, requests: number): Promise<void> {
    // This method is for compatibility - actual usage is tracked via logApiUsage
    // Could be used for batch updates or corrections
  }

  static async getApiUsageStats() {
    const db = await this.getDb()
    const usageCollection = db.collection<ApiUsage>("api_usage")
    const userCollection = db.collection<User>("users")

    // Get total users
    const totalUsers = await userCollection.countDocuments()

    // Get total API calls
    const totalRequests = await usageCollection.countDocuments()

    // Get total API calls this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const monthlyRequests = await usageCollection.countDocuments({
      createdAt: { $gte: startOfMonth },
    })

    // Get requests today
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)

    const dailyRequests = await usageCollection.countDocuments({
      createdAt: { $gte: startOfDay },
    })

    // Get top endpoints
    const topEndpoints = await usageCollection
      .aggregate([
        { $match: { createdAt: { $gte: startOfMonth } } },
        { $group: { _id: "$endpoint", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ])
      .toArray()

    // Get usage by status code
    const statusCodes = await usageCollection
      .aggregate([
        { $match: { createdAt: { $gte: startOfMonth } } },
        { $group: { _id: "$status_code", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray()

    return {
      totalUsers,
      totalRequests,
      monthlyRequests,
      dailyRequests,
      topEndpoints,
      statusCodes,
    }
  }

  static async getAnalytics() {
    const db = await this.getDb()
    const usageCollection = db.collection<ApiUsage>("api_usage")
    const userCollection = db.collection<User>("users")

    // Get total users
    const totalUsers = await userCollection.countDocuments()

    // Get total API calls this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const monthlyRequests = await usageCollection.countDocuments({
      createdAt: { $gte: startOfMonth },
    })

    // Get top endpoints
    const topEndpoints = await usageCollection
      .aggregate([
        { $match: { createdAt: { $gte: startOfMonth } } },
        { $group: { _id: "$endpoint", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ])
      .toArray()

    return {
      totalUsers,
      monthlyRequests,
      topEndpoints,
    }
  }

  // Translation Cache Methods
  static async getCachedTranslation(
    textHash: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<TranslationCache | null> {
    const db = await this.getDb()
    const collection = db.collection<TranslationCache>("translation_cache")
    
    const cached = await collection.findOne({
      textHash,
      sourceLanguage,
      targetLanguage,
    })
    
    if (cached) {
      // Update access statistics
      await collection.updateOne(
        { _id: cached._id },
        {
          $inc: { accessCount: 1 },
          $set: { lastAccessed: new Date() },
        }
      )
    }
    
    return cached ? { ...cached, _id: cached._id?.toString() } : null
  }

  static async setCachedTranslation(
    textHash: string,
    originalText: string,
    translatedText: string,
    sourceLanguage: string,
    targetLanguage: string
  ): Promise<void> {
    const db = await this.getDb()
    const collection = db.collection<TranslationCache>("translation_cache")
    
    const cacheEntry: TranslationCache = {
      textHash,
      originalText,
      translatedText,
      sourceLanguage,
      targetLanguage,
      createdAt: new Date(),
      updatedAt: new Date(),
      accessCount: 1,
      lastAccessed: new Date(),
    }
    
    await collection.replaceOne(
      { textHash, sourceLanguage, targetLanguage },
      cacheEntry,
      { upsert: true }
    )
  }

  static async cleanupOldTranslations(daysOld: number = 30): Promise<number> {
    const db = await this.getDb()
    const collection = db.collection<TranslationCache>("translation_cache")
    
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)
    
    const result = await collection.deleteMany({
      lastAccessed: { $lt: cutoffDate },
    })
    
    return result.deletedCount || 0
  }

  static async getTranslationCacheStats(): Promise<{
    totalEntries: number
    totalSize: number
    mostUsed: Array<{ text: string; accessCount: number }>
  }> {
    const db = await this.getDb()
    const collection = db.collection<TranslationCache>("translation_cache")
    
    const totalEntries = await collection.countDocuments()
    
    const mostUsed = await collection
      .find({})
      .sort({ accessCount: -1 })
      .limit(10)
      .project({ originalText: 1, accessCount: 1 })
      .toArray()
    
    // Estimate total size (rough calculation)
    const sampleDocs = await collection.find({}).limit(100).toArray()
    const avgSize = sampleDocs.reduce((acc, doc) => {
      return acc + (doc.originalText?.length || 0) + (doc.translatedText?.length || 0)
    }, 0) / Math.max(sampleDocs.length, 1)
    
    const totalSize = Math.round(avgSize * totalEntries)
    
    return {
      totalEntries,
      totalSize,
      mostUsed: mostUsed.map(doc => ({
        text: doc.originalText?.substring(0, 50) + (doc.originalText?.length > 50 ? '...' : ''),
        accessCount: doc.accessCount || 0,
      })),
    }
  }

  static async logApiUsage(usageData: Partial<ApiUsage>): Promise<void> {
    const db = await this.getDb()
    const collection = db.collection<ApiUsage>("api_usage")
    
    const usage: ApiUsage = {
      endpoint: usageData.endpoint || '',
      ...usageData,
      createdAt: usageData.createdAt || new Date(),
    }
    
    await collection.insertOne(usage)
  }

  static async close(): Promise<void> {
    if (this.client) {
      await this.client.close()
      this.client = null
      this.db = null
    }
  }
}

// Named exports for backward compatibility
export async function getUserByToken(token: string): Promise<User | null> {
  return Database.findUserByToken(token)
}

export async function logApiUsage(usageData: any): Promise<void> {
  return Database.logApiUsage(usageData)
}
