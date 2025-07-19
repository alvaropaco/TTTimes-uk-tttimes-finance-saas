import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import { User } from '@/lib/models/User'

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    id: string
    email: string
    apiKey: string
    plan: string
  }
}

/**
 * Higher-order function to protect API routes with authentication
 */
export function withAuth(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const session = await getServerSession(req, res, authOptions)
      
      if (!session?.user?.email) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      await connectDB()
      const user = await User.findOne({ email: session.user.email })
      
      if (!user) {
        return res.status(401).json({ error: 'User not found' })
      }

      req.user = {
        id: user._id.toString(),
        email: user.email,
        apiKey: user.apiKey,
        plan: user.plan
      }

      return handler(req, res)
    } catch (error) {
      console.error('Auth middleware error:', error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}

/**
 * Validate API key for API routes
 */
export async function validateApiKey(apiKey: string) {
  try {
    await connectDB()
    const user = await User.findOne({ apiKey })
    return user
  } catch (error) {
    console.error('API key validation error:', error)
    return null
  }
}

/**
 * Rate limiting utility
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  
  constructor(
    private maxRequests: number = 100,
    private windowMs: number = 60 * 1000 // 1 minute
  ) {}

  isAllowed(identifier: string): boolean {
    const now = Date.now()
    const requests = this.requests.get(identifier) || []
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < this.windowMs)
    
    if (validRequests.length >= this.maxRequests) {
      return false
    }
    
    validRequests.push(now)
    this.requests.set(identifier, validRequests)
    return true
  }
}

export const rateLimiter = new RateLimiter()
