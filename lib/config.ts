/**
 * Environment variable validation and configuration
 */

const requiredEnvVars = [
  'MONGODB_URI',
  'NEXTAUTH_SECRET',
] as const

const optionalEnvVars = [
  'MONGODB_DB_NAME',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'NEXT_PUBLIC_APP_URL',
  'NODE_ENV',
] as const

type RequiredEnvVar = typeof requiredEnvVars[number]
type OptionalEnvVar = typeof optionalEnvVars[number]

/**
 * Validates that all required environment variables are present
 */
export function validateEnvVars(): void {
  const missing: string[] = []
  
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar)
    }
  }
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file and ensure all required variables are set.'
    )
  }
}

/**
 * Get environment variable with type safety
 */
export function getEnvVar(name: RequiredEnvVar): string
export function getEnvVar(name: OptionalEnvVar): string | undefined
export function getEnvVar(name: string): string | undefined {
  return process.env[name]
}

/**
 * Configuration object with validated environment variables
 */
export const config = {
  // Database
  mongoUri: getEnvVar('MONGODB_URI'),
  mongoDbName: getEnvVar('MONGODB_DB_NAME') || 'saas-starter',
  
  // Authentication
  nextAuthSecret: getEnvVar('NEXTAUTH_SECRET'),
  googleClientId: getEnvVar('GOOGLE_CLIENT_ID'),
  googleClientSecret: getEnvVar('GOOGLE_CLIENT_SECRET'),
  
  // App
  appUrl: getEnvVar('NEXT_PUBLIC_APP_URL') || 'http://localhost:3000',
  nodeEnv: getEnvVar('NODE_ENV') || 'development',
  
  // Computed values
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const

// Validate environment variables on module load
if (typeof window === 'undefined') {
  validateEnvVars()
}
