import crypto from "crypto"
import bcrypt from "bcryptjs"

// Generate a secure API key
export function generateApiKey(): string {
  return crypto.randomBytes(32).toString("hex")
}

// Hash a password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

// Verify a password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Generate a secure random token
export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString("hex")
}

// Validate API key format
export function isValidApiKey(apiKey: string): boolean {
  return /^[a-f0-9]{64}$/.test(apiKey)
}
