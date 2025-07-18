import { NextResponse } from 'next/server';
import { connectDB, Currency } from '@/lib/database';
import { validateApiKey, checkRateLimit, incrementUsage } from '@/lib/api-utils';

export async function GET(request: Request) {
  const validation = await validateApiKey(request);
  if (validation instanceof NextResponse) return validation;
  const user = validation;

  const rateCheck = await checkRateLimit(user._id.toString());
  if (rateCheck instanceof NextResponse) return rateCheck;

  const url = new URL(request.url);
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  const amount = parseFloat(url.searchParams.get('amount') || '1');

  if (!from || !to || isNaN(amount)) {
    return NextResponse.json({ error: 'Missing or invalid parameters' }, { status: 400 });
  }

  await connectDB();
  const currency = await Currency.findOne({ código_iso: from });
  if (!currency) {
    return NextResponse.json({ error: 'Currency not found' }, { status: 404 });
  }

  const rate = parseFloat(currency.fórmula_atualizada.replace(',', '.'));
  const converted = amount * (to === 'USD' ? 1 / rate : rate); // Assuming conversion to/from USD

  await incrementUsage(user._id.toString());
  return NextResponse.json({ from, to, amount, converted });
}