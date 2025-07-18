import { NextResponse } from 'next/server';
import { connectDB, Currency } from '@/lib/database';
import { validateApiKey, checkRateLimit, incrementUsage } from '@/lib/api-utils';
import { ICurrency } from '@/models/Currency';

export async function GET(request: Request) {
  const validation = await validateApiKey(request);
  if (validation instanceof NextResponse) return validation;
  const user = validation;

  const rateCheck = await checkRateLimit(user._id.toString());
  if (rateCheck instanceof NextResponse) return rateCheck;

  await connectDB();
  const currencies = await Currency.find({});
  const rates = currencies.map((c: ICurrency) => ({
    ...c.toObject(),
    fórmula_atualizada: parseFloat(c.fórmula_atualizada.replace(',', '.'))
  }));

  await incrementUsage(user._id.toString());
  return NextResponse.json(rates);
}