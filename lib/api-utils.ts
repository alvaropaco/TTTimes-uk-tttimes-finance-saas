import { NextResponse } from 'next/server';
import { Database } from './database';
import { ObjectId } from 'mongodb';

export async function validateApiKey(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
  }
  
  const apiKey = authHeader.split(' ')[1];
  
  // For demo purposes, allow demo_token
  if (apiKey === "demo_token") {
    return {
      _id: "demo_user_id",
      email: "demo@example.com",
      apiKey: "demo_token",
      plan: "free",
      createdAt: new Date(),
    };
  }
  
  // Find user by token using the Database class
  const user = await Database.findUserByToken(apiKey);
  if (!user) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }
  
  return user;
}

export async function checkRateLimit(userId: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const db = await Database.getDb();
    const usageCollection = db.collection('api_usage');
    
    const usage = await usageCollection.findOne({ 
      userId: userId === "demo_user_id" ? userId : new ObjectId(userId), 
      createdAt: { $gte: today, $lt: tomorrow } 
    });
    
    const count = usage ? usage.count || 0 : 0;
    if (Number(count) >= 100) {
      return NextResponse.json({ error: 'Rate limit exceeded. Try again tomorrow.' }, { status: 429 });
    }
    
    return count;
  } catch (error) {
    console.error('Rate limit check error:', error);
    return 0; // Allow request if rate limit check fails
  }
}

export async function incrementUsage(userId: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const db = await Database.getDb();
    const usageCollection = db.collection('api_usage');
    
    await usageCollection.updateOne(
      { 
        userId: userId === "demo_user_id" ? userId : new ObjectId(userId), 
        createdAt: today 
      },
      { 
        $inc: { count: 1 },
        $setOnInsert: { createdAt: today }
      },
      { upsert: true }
    );
  } catch (error) {
    console.error('Usage increment error:', error);
    // Don't fail the request if usage tracking fails
  }
}