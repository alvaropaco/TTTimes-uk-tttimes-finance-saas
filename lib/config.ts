export const config = {
  database: {
    url: process.env.DATABASE_URL || process.env.MONGODB_URI,
    ssl: process.env.NODE_ENV === "production",
    name: process.env.MONGODB_DB_NAME || "zodii",
  },
  app: {
    env: process.env.NODE_ENV || "development",
    url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
  },
  mongodb: {
    // Configurações específicas para diferentes ambientes
    connectionOptions: {
      development: {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
      },
      production: {
        tls: true,
        tlsAllowInvalidCertificates: false,
        tlsAllowInvalidHostnames: false,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10,
        minPoolSize: 0,
        maxIdleTimeMS: 30000,
        retryWrites: true,
        retryReads: true,
        family: 4,
        heartbeatFrequencyMS: 10000,
        serverMonitoringMode: "auto" as const,
      },
    },
  },
}

export function validateConfig() {
  const errors = []

  if (!config.database.url) {
    errors.push("DATABASE_URL or MONGODB_URI is required")
  }

  if (errors.length > 0) {
    throw new Error(`Configuration errors: ${errors.join(", ")}`)
  }
}

export function getMongoConnectionOptions() {
  const env = config.app.env as "development" | "production"
  return config.mongodb.connectionOptions[env] || config.mongodb.connectionOptions.development
}
