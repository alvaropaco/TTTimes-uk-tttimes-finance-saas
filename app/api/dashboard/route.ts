import { currentUser } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/database';
import { User } from '@/models/User';
import { ApiUsage, ApiUsageType } from '@/models/ApiUsage';
import { NextResponse } from 'next/server';

export async function GET() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const user = await User.findOne({ clerkId: clerkUser.id });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const today = new Date().toISOString().split('T')[0];
  const dailyUsage = await ApiUsage.findOne({ userId: user._id, date: today });
  const dailyCount = dailyUsage ? dailyUsage.count : 0;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const usageHistory = await ApiUsage.find({
    userId: user._id,
    date: { $gte: sevenDaysAgo.toISOString().split('T')[0] }
  }).sort({ date: 1 });

  const formattedHistory = usageHistory.map((u: ApiUsageType) => ({
    date: u.date,
    requests: u.count
  }));

  return NextResponse.json({
    apiKey: user.apiKey,
    dailyCount,
    usageHistory: formattedHistory
  });
}