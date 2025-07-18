import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateApiKey(): string {
  const prefix = "ttf_"
  const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  return prefix + randomString
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export function getTodayString(): string {
  return new Date().toISOString().split("T")[0]
}

export function convertFormula(from: string, to: string, amount: number): string {
  return `${amount} ${from} = ${amount * 1.1} ${to}` // Mock conversion
}

export function validateApiKey(apiKey: string): boolean {
  return apiKey.startsWith("ttf_") && apiKey.length > 10
}

export function calculateUsagePercentage(used: number, limit: number): number {
  return Math.min((used / limit) * 100, 100)
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function truncateString(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + "..." : str
}

export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num)
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}
