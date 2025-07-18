import { NextResponse } from 'next/server';
import { User, ApiUsage, connectDB } from './database';
import crypto from 'crypto';
import { User as UserModel } from '@/models/User';
import { ApiUsage as ApiUsageModel } from '@/models/ApiUsage';

export async function validateApiKey(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Missing or invalid authorization header' }, { status: 401 });
  }
  const apiKey = authHeader.split(' ')[1];
  await connectDB();
  const user = await UserModel.findOne({ apiKey });
  if (!user) {
    return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
  }
  return user;
}

export async function checkRateLimit(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const usage = await ApiUsageModel.findOne({ userId, date: { $gte: today, $lt: tomorrow } });
  const count = usage ? usage.count : 0;
  if (Number(count) >= 100) {
    return NextResponse.json({ error: 'Rate limit exceeded. Try again tomorrow.' }, { status: 429 });
  }
  return count;
}

export async function incrementUsage(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const usage = await ApiUsageModel.findOneAndUpdate(
    { userId: userId, date: today },
    { $inc: { count: 1 } },
    { upsert: true, new: true }
  );
}