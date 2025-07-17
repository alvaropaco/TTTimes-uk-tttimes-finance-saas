import { MongoClient } from "mongodb"

export interface ConnectionConfig {
  name: string
  options: any
}

export const connectionConfigs: ConnectionConfig[] = [
  {
    name: "Basic Connection",
    options: {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 30000,
    },
  },
  {
    name: "Atlas Optimized",
    options: {
      tls: true,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 5,
      retryWrites: true,
    },
  },
  {
    name: "Vercel Serverless",
    options: {
      tls: true,
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 60000,
      maxPoolSize: 1,
      minPoolSize: 0,
      maxIdleTimeMS: 30000,
      retryWrites: true,
      retryReads: true,
    },
  },
]

export async function testConnection(uri: string, config: ConnectionConfig): Promise<boolean> {
  let client: MongoClient | null = null

  try {
    console.log(`Testing connection with config: ${config.name}`)

    client = new MongoClient(uri, config.options)
    await client.connect()

    // Test ping
    await client.db("admin").command({ ping: 1 })

    console.log(`✅ Connection successful with config: ${config.name}`)
    return true
  } catch (error: any) {
    console.log(`❌ Connection failed with config: ${config.name}`)
    console.log(`Error: ${error.message}`)
    return false
  } finally {
    if (client) {
      try {
        await client.close()
      } catch (closeError) {
        console.error("Error closing test client:", closeError)
      }
    }
  }
}

export async function findBestConnection(uri: string): Promise<ConnectionConfig | null> {
  console.log("🔍 Testing different connection configurations...")

  for (const config of connectionConfigs) {
    const success = await testConnection(uri, config)
    if (success) {
      console.log(`🎉 Found working configuration: ${config.name}`)
      return config
    }
  }

  console.log("❌ No working configuration found")
  return null
}
