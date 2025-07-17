import { MongoClientOptions } from "mongodb"
import { connectToMongoDB } from "./vercel-mongodb-fix"

export interface MongoConfig {
  uri: string
  dbName: string
  options: MongoClientOptions
}

export function getMongoConfig(): MongoConfig {
  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL || ""
  const dbName = process.env.MONGODB_DB_NAME || "zodii"
  
  if (!uri) {
    throw new Error("MONGODB_URI or DATABASE_URL environment variable is required")
  }

  // Configuração otimizada para Vercel serverless
  const options: MongoClientOptions = {
    // SSL/TLS configurações
    tls: true,
    tlsAllowInvalidCertificates: false,
    tlsAllowInvalidHostnames: false,
    
    // Timeouts otimizados para serverless
    serverSelectionTimeoutMS: 30000,
    connectTimeoutMS: 30000,
    socketTimeoutMS: 60000,
    
    // Pool de conexões otimizado para serverless
    maxPoolSize: 1,
    minPoolSize: 0,
    maxIdleTimeMS: 30000,
    
    // Configurações de retry
    retryWrites: true,
    retryReads: true,
    
    // Configurações de rede
    family: 4, // Força IPv4
    
    // Configurações de monitoramento
    heartbeatFrequencyMS: 30000,
    serverMonitoringMode: "auto",
    
    // Configurações específicas para serverless
    directConnection: false,
  }

  return {
    uri,
    dbName,
    options,
  }
}

// Export getDb function for database operations
export async function getDb() {
  return await connectToMongoDB()
}

export function getFallbackMongoConfig(): MongoConfig {
  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL || ""
  const dbName = process.env.MONGODB_DB_NAME || "zodii"
  
  if (!uri) {
    throw new Error("MONGODB_URI or DATABASE_URL environment variable is required")
  }

  // Configuração de fallback mais simples
  const options: MongoClientOptions = {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 30000,
    maxPoolSize: 1,
    retryWrites: true,
    retryReads: true,
  }

  return {
    uri,
    dbName,
    options,
  }
}
