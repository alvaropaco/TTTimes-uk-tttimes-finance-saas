import { NextResponse } from 'next/server';
import { Database } from '@/lib/database';
import { validateApiKey, checkRateLimit, incrementUsage } from '@/lib/api-utils';

export async function GET(request: Request) {
  try {
    const validation = await validateApiKey(request);
    if (validation instanceof NextResponse) return validation;
    const user = validation;

    const rateCheck = await checkRateLimit(user._id?.toString() || user._id);
    if (rateCheck instanceof NextResponse) return rateCheck;

    // Get supported currencies from MongoDB
    const db = await Database.getDb();
    const currenciesCollection = db.collection('currencies');
    const currencies = await currenciesCollection.find({}).project({ código_iso: 1 }).toArray();
    const supported = currencies.map((c: any) => c.código_iso).filter(Boolean);

    await incrementUsage(user._id?.toString() || user._id);
    
    return NextResponse.json(supported);
  } catch (error) {
    console.error('Supported currencies API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}