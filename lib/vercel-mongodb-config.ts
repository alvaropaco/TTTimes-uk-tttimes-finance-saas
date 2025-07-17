import { MongoClientOptions } from "mongodb"

export interface VercelMongoConfig {
  uri: string
  dbName: string
  options: MongoClientOptions
}

export function getVercelMongoConfig(): VercelMongoConfig {
  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL || ""
  const dbName = process.env.MONGODB_DB_NAME || "zodii"
  
  if (!uri) {
    throw new Error("MONGODB_URI or DATABASE_URL environment variable is required")
  }

  // Configuração específica para resolver problemas SSL/TLS no Vercel serverless
  const options: MongoClientOptions = {
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
    
    // Configurações de retry mais agressivas
    retryWrites: true,
    retryReads: true,
    
    // Força IPv4 para evitar problemas de DNS
    family: 4,
    
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

export function getFallbackVercelMongoConfig(): VercelMongoConfig {
  const uri = process.env.MONGODB_URI || process.env.DATABASE_URL || ""
  const dbName = process.env.MONGODB_DB_NAME || "zodii"
  
  if (!uri) {
    throw new Error("MONGODB_URI or DATABASE_URL environment variable is required")
  }

  // Configuração de fallback mais simples para casos extremos
  const options: MongoClientOptions = {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 30000,
    maxPoolSize: 1,
    retryWrites: true,
    retryReads: true,
    family: 4,
  }

  return {
    uri,
    dbName,
    options,
  }
}
