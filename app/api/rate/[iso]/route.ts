import { NextResponse } from 'next/server';
import { connectDB, Currency } from '@/lib/database';
import { validateApiKey, checkRateLimit, incrementUsage } from '@/lib/api-utils';

export async function GET(request: Request, { params }: { params: { iso: string } }) {
  const validation = await validateApiKey(request);
  if (validation instanceof NextResponse) return validation;
  const user = validation;

  const rateCheck = await checkRateLimit(user._id.toString());
  if (rateCheck instanceof NextResponse) return rateCheck;

  const { iso } = params;

  await connectDB();
  const currency = await Currency.findOne({ código_iso: iso });
  if (!currency) {
    return NextResponse.json({ error: 'Currency not found' }, { status: 404 });
  }

  const rate = {
    ...currency.toObject(),
    fórmula_atualizada: parseFloat(currency.fórmula_atualizada.replace(',', '.'))
  };

  await incrementUsage(user._id.toString());
  return NextResponse.json(rate);
}