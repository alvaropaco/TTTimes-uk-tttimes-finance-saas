/**
 * Validadores de entrada para APIs
 * Centraliza a validação de dados de entrada
 */

import { z } from 'zod';

// Schema para validação de conversão de moeda
export const convertSchema = z.object({
  from: z.string().length(3, 'Currency code must be 3 characters').toUpperCase(),
  to: z.string().length(3, 'Currency code must be 3 characters').toUpperCase(),
  amount: z.number().positive('Amount must be positive').max(1000000, 'Amount too large')
});

// Schema para validação de signup
export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  email: z.string().email('Invalid email format'),
  plan: z.enum(['free', 'basic', 'premium'], {
    errorMap: () => ({ message: 'Invalid plan type. Must be one of: free, basic, premium' })
  })
});

// Schema para validação de signin
export const signinSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

// Schema para validação de API key
export const apiKeySchema = z.string().regex(
  /^ttf_[a-f0-9]{64}$/,
  'Invalid API key format'
);

// Helper para validar dados de entrada
export const validateInput = <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; error?: string } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors.map(e => e.message).join(', ') 
      };
    }
    return { success: false, error: 'Validation failed' };
  }
};

// Helper para validar query parameters
export const validateQueryParams = (searchParams: URLSearchParams, requiredParams: string[]) => {
  const missing = requiredParams.filter(param => !searchParams.has(param));
  if (missing.length > 0) {
    return { success: false, error: `Missing required parameters: ${missing.join(', ')}` };
  }
  return { success: true };
};