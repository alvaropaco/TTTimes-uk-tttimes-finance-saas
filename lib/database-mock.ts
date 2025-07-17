// Mock database for preview/demo environments
interface MockUser {
  id: string
  email: string
  name: string
  token: string
  created_at: Date
  is_active: boolean
}

interface MockApiUsage {
  user_id: string
  endpoint: string
  method: string
  status_code: number
  response_time_ms?: number
  created_at: Date
  ip_address?: string
}

// In-memory storage for preview environment
const mockUsers: MockUser[] = [
  {
    id: "demo-user-1",
    email: "demo@zodii.com",
    name: "Demo User",
    token: "demo_token_abc123def456ghi789jkl012mno345pqr678stu901vwx234yz",
    created_at: new Date("2024-01-01"),
    is_active: true,
  },
  {
    id: "demo-user-2",
    email: "test@example.com",
    name: "Test User",
    token: "test_token_xyz987wvu654tsr321qpo098nml765kji432hgf109edc876ba",
    created_at: new Date("2024-01-02"),
    is_active: true,
  },
]

const mockApiUsage: MockApiUsage[] = []

export class MockDatabase {
  static async createIndexes() {
    // No-op for mock database
    console.log("Mock database indexes created")
  }

  static async createUser(email: string, name: string): Promise<MockUser> {
    // Check if user already exists
    const existingUser = mockUsers.find((user) => user.email === email)
    if (existingUser) {
      throw new Error("User with this email already exists")
    }

    // Generate mock token
    const token = `mock_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}_${Date.now()}`

    const newUser: MockUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      email,
      name,
      token,
      created_at: new Date(),
      is_active: true,
    }

    mockUsers.push(newUser)
    return newUser
  }

  static async getUserByToken(token: string): Promise<MockUser | null> {
    return mockUsers.find((user) => user.token === token && user.is_active) || null
  }

  static async getUserByEmail(email: string): Promise<MockUser | null> {
    return mockUsers.find((user) => user.email === email) || null
  }

  static async getAllUsers(): Promise<MockUser[]> {
    return mockUsers.filter((user) => user.is_active)
  }

  static async logApiUsage(usage: Omit<MockApiUsage, "created_at">): Promise<void> {
    mockApiUsage.push({
      ...usage,
      created_at: new Date(),
    })
  }

  static async getApiUsageStats() {
    const totalRequests = mockApiUsage.length
    const successfulRequests = mockApiUsage.filter((usage) => usage.status_code === 200).length
    const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0

    // Group by endpoint
    const endpointCounts = mockApiUsage.reduce(
      (acc, usage) => {
        acc[usage.endpoint] = (acc[usage.endpoint] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const popularEndpoints = Object.entries(endpointCounts)
      .map(([endpoint, count]) => ({ endpoint, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const recentActivity = mockApiUsage
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(0, 10)
      .map((usage) => {
        const user = mockUsers.find((u) => u.id === usage.user_id)
        return {
          ...usage,
          name: user?.name || "Unknown",
          email: user?.email || "unknown@example.com",
        }
      })

    return {
      userCount: mockUsers.filter((user) => user.is_active).length,
      totalRequests,
      successRate,
      popularEndpoints,
      recentActivity,
    }
  }
}
