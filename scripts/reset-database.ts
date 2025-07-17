import pool from "../lib/database"
import { seedDatabase } from "./seed-database"

async function resetDatabase() {
  console.log("🔄 Resetting database...")

  const client = await pool.connect()

  try {
    // Drop existing tables
    await client.query("DROP TABLE IF EXISTS api_usage CASCADE")
    await client.query("DROP TABLE IF EXISTS users CASCADE")

    console.log("🗑️  Existing tables dropped")

    // Recreate and seed
    await seedDatabase()
  } catch (error) {
    console.error("❌ Error resetting database:", error)
    process.exit(1)
  } finally {
    client.release()
  }
}

resetDatabase()
  .then(() => {
    console.log("🎉 Database reset completed successfully!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("💥 Database reset failed:", error)
    process.exit(1)
  })
