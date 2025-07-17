import { Database, type User } from "./database"

export class DatabaseAdapter {
  static async getUserByToken(token: string): Promise<User | null> {
    return await Database.findUserByToken(token)
  }

  static async createUser(userData: Omit<User, "_id" | "createdAt">): Promise<User> {
    return await Database.createUser(userData)
  }

  static async findUserByEmail(email: string): Promise<User | null> {
    return await Database.findUserByEmail(email)
  }

  static async logApiUsage(usageData: {
    token: string
    endpoint: string
    ip?: string
    userAgent?: string,
    method?: string,
    status_code?: number,
    response_time_ms?: number,
    response?: any
  }): Promise<void> {
    return await Database.logApiUsage(usageData)
  }

  static async getUserUsageStats(token: string): Promise<{ requests: number; lastReset: Date } | null> {
    return await Database.getUserUsageStats(token)
  }

  static async updateUserUsage(token: string, requests: number): Promise<void> {
    return await Database.updateUserUsage(token, requests)
  }

  static async getAnalytics() {
    return await Database.getAnalytics()
  }
}

// Named export for getUserByToken utility function
export async function getUserByToken(token: string): Promise<User | null> {
  return DatabaseAdapter.getUserByToken(token)
}

// Named export for logApiUsage utility function
export async function logApiUsage(usageData: any): Promise<void> {
  return DatabaseAdapter.logApiUsage(usageData)
}
