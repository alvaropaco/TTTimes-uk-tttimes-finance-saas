import { DatabaseAdapter } from "../lib/database-adapter"

async function initializeDatabase() {
  try {
    console.log("Initializing MongoDB database...")
    await DatabaseAdapter.createIndexes()
    console.log("Database indexes created successfully!")

    console.log("Seeding database...")
    await seedDatabase()
    console.log("Database seeded successfully!")
  } catch (error: any) {
    console.error("Error initializing database:", error)
    process.exit(1)
  }
}

async function seedDatabase() {
  // Create sample users with API tokens
  const sampleUsers = [
    {
      email: "demo@zodii.com",
      name: "Demo User",
    },
    {
      email: "test@example.com",
      name: "Test User",
    },
    {
      email: "developer@zodii.com",
      name: "Developer Account",
    },
  ]

  for (const userData of sampleUsers) {
    try {
      const existingUser = await DatabaseAdapter.getUserByEmail(userData.email)
      if (!existingUser) {
        const user = await DatabaseAdapter.createUser(userData.email, userData.name)
        console.log(`Created user: ${user.email} with token: ${user.token}`)
      } else {
        console.log(`User ${userData.email} already exists`)
      }
    } catch (error: any) {
      console.log(`User ${userData.email} might already exist, skipping...`)
    }
  }
}

initializeDatabase()
