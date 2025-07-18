import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from "crypto"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateApiKey(): string {
  return "ttf_" + crypto.randomBytes(32).toString("hex")
}

export function getTodayString(): string {
  return new Date().toISOString().split("T")[0]
}

export function convertFormula(formula: string): number {
  return Number.parseFloat(formula.replace(",", "."))
}
