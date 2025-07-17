import { Database } from "../lib/database"
import pool from "../lib/database"

interface SampleUser {
  email: string
  name: string
  description: string
}

const sampleUsers: SampleUser[] = [
  {
    email: "demo@zodii.com",
    name: "Demo User",
    description: "Demo account for testing all API endpoints",
  },
  {
    email: "astrologer@zodii.com",
    name: "Professional Astrologer",
    description: "Professional astrologer account for advanced features",
  },
  {
    email: "developer@zodii.com",
    name: "API Developer",
    description: "Developer account for API integration testing",
  },
  {
    email: "mobile@zodii.com",
    name: "Mobile App Developer",
    description: "Mobile application developer account",
  },
  {
    email: "web@zodii.com",
    name: "Web Developer",
    description: "Web application developer account",
  },
  {
    email: "startup@zodii.com",
    name: "Startup Founder",
    description: "Startup founder building astrology features",
  },
  {
    email: "blogger@zodii.com",
    name: "Astrology Blogger",
    description: "Content creator and astrology blogger",
  },
  {
    email: "researcher@zodii.com",
    name: "Astrology Researcher",
    description: "Academic researcher studying astrology patterns",
  },
]

async function seedDatabase() {
  console.log("🌱 Starting database seeding...")

  try {
    // Ensure tables exist
    await Database.createTables()
    console.log("✅ Database tables verified")

    // Create sample users
    console.log("👥 Creating sample users...")
    const createdUsers = []

    for (const userData of sampleUsers) {
      try {
        const existingUser = await Database.getUserByEmail(userData.email)

        if (!existingUser) {
          const user = await Database.createUser(userData.email, userData.name)
          createdUsers.push({
            ...user,
            description: userData.description,
          })
          console.log(`   ✅ Created: ${user.email}`)
        } else {
          console.log(`   ⏭️  Exists: ${userData.email}`)
          createdUsers.push({
            ...existingUser,
            description: userData.description,
          })
        }
      } catch (error) {
        console.log(`   ❌ Error creating ${userData.email}:`, error)
      }
    }

    // Create usage statistics table for analytics
    await createUsageStatsTable()

    // Seed some sample usage data
    await seedUsageStats(createdUsers)

    // Display summary
    console.log("\n📊 Seeding Summary:")
    console.log(`   Users created/verified: ${createdUsers.length}`)
    console.log(`   Sample API tokens available: ${createdUsers.length}`)

    console.log("\n🔑 Sample API Tokens:")
    createdUsers.forEach((user) => {
      console.log(`   ${user.name} (${user.email}):`)
      console.log(`   Token: ${user.token}`)
      console.log(`   Description: ${user.description}`)
      console.log("")
    })

    console.log("🎯 Test your API with these sample tokens!")
    console.log("Example: curl 'http://localhost:3000/api/zodiac/signs?token=" + createdUsers[0].token + "'")
  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

async function createUsageStatsTable() {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS api_usage (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id),
        endpoint VARCHAR(255) NOT NULL,
        method VARCHAR(10) NOT NULL,
        status_code INTEGER NOT NULL,
        response_time_ms INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address INET,
        user_agent TEXT
      )
    `)

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_api_usage_user_id ON api_usage(user_id);
    `)

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_api_usage_created_at ON api_usage(created_at);
    `)

    console.log("✅ Usage statistics table created")
  } finally {
    client.release()
  }
}

async function seedUsageStats(users: any[]) {
  const client = await pool.connect()

  const endpoints = [
    { path: "/api/zodiac/signs", method: "GET" },
    { path: "/api/zodiac/aries", method: "GET" },
    { path: "/api/zodiac/leo", method: "GET" },
    { path: "/api/personality", method: "POST" },
    { path: "/api/birth-chart", method: "POST" },
    { path: "/api/horoscope/aries", method: "GET" },
    { path: "/api/horoscope/leo", method: "GET" },
    { path: "/api/compatibility", method: "POST" },
  ]

  try {
    // Generate sample usage data for the last 30 days
    for (let i = 0; i < 100; i++) {
      const user = users[Math.floor(Math.random() * users.length)]
      const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)]
      const daysAgo = Math.floor(Math.random() * 30)
      const hoursAgo = Math.floor(Math.random() * 24)
      const minutesAgo = Math.floor(Math.random() * 60)

      const createdAt = new Date()
      createdAt.setDate(createdAt.getDate() - daysAgo)
      createdAt.setHours(createdAt.getHours() - hoursAgo)
      createdAt.setMinutes(createdAt.getMinutes() - minutesAgo)

      const statusCode = Math.random() > 0.1 ? 200 : Math.random() > 0.5 ? 400 : 401
      const responseTime = Math.floor(Math.random() * 500) + 50 // 50-550ms

      await client.query(
        `
        INSERT INTO api_usage (user_id, endpoint, method, status_code, response_time_ms, created_at, ip_address)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
        [
          user.id,
          endpoint.path,
          endpoint.method,
          statusCode,
          responseTime,
          createdAt,
          `192.168.1.${Math.floor(Math.random() * 255)}`,
        ],
      )
    }

    console.log("✅ Sample usage statistics created")
  } finally {
    client.release()
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("🎉 Database seeding completed successfully!")
      process.exit(0)
    })
    .catch((error) => {
      console.error("💥 Database seeding failed:", error)
      process.exit(1)
    })
}

export { seedDatabase }
