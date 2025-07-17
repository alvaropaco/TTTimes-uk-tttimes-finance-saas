import { MongoClient, type Db } from "mongodb"

let client: MongoClient | null = null
let db: Db | null = null

export async function connectToMongoDB(): Promise<Db> {
  const MONGODB_URI = process.env.MONGODB_URI || process.env.DATABASE_URL
  const DB_NAME = process.env.MONGODB_DB_NAME || "zodii"

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI or DATABASE_URL environment variable is required")
  }

  // Se já temos uma conexão ativa, retorna ela
  if (db) {
    return db
  }

  try {
    // Configuração específica para resolver problemas SSL/TLS no Vercel serverless
    const options = {
      // Configurações SSL/TLS mais permissivas para serverless
      tls: true,
      tlsAllowInvalidCertificates: false,
      tlsAllowInvalidHostnames: false,
      
      // Timeouts mais longos para ambiente serverless
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 60000,
      
      // Pool de conexões otimizado para serverless (conexão única)
      maxPoolSize: 1,
      minPoolSize: 0,
      maxIdleTimeMS: 30000,
      
      // Configurações de retry
      retryWrites: true,
      retryReads: true,
      
      // Força IPv4 para evitar problemas de DNS
      family: 4,
      
      // Configurações de monitoramento
      heartbeatFrequencyMS: 30000,
      serverMonitoringMode: "auto" as const,
      
      // Configurações específicas para serverless
      directConnection: false,
    }

    console.log("Connecting to MongoDB with Vercel-optimized config...")
    
    client = new MongoClient(MONGODB_URI, options)
    await client.connect()

    // Testa a conexão
    await client.db("admin").command({ ping: 1 })

    db = client.db(DB_NAME)
    
    console.log("Successfully connected to MongoDB")
    return db
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)
    
    // Cleanup em caso de erro
    if (client) {
      try {
        await client.close()
      } catch (closeError) {
        console.error("Error closing client:", closeError)
      }
      client = null
      db = null
    }
    
    throw error
  }
}

export async function closeMongoDBConnection(): Promise<void> {
  if (client) {
    try {
      await client.close()
      console.log("MongoDB connection closed")
    } catch (error) {
      console.error("Error closing MongoDB connection:", error)
    } finally {
      client = null
      db = null
    }
  }
}
