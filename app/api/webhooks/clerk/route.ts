import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { connectDB } from '@/lib/database';
import { User } from '@/models/User';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  const payload = await req.text();
  const heads = headers();
  const svix_id = heads.get('svix-id');
  const svix_timestamp = heads.get('svix-timestamp');
  const svix_signature = heads.get('svix-signature');
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 });
  }
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');
  let evt: any;
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 });
  }

  if (evt.type === 'user.created') {
    await connectDB();
    const clerkId = evt.data?.id;
    const email = evt.data?.email_addresses?.[0]?.email_address;
    if (!clerkId || !email) {
      return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
    }
    const apiKey = crypto.randomBytes(32).toString('hex');
    const newUser = new User({ clerkId, email, apiKey });
    await newUser.save();
  }

  return NextResponse.json({ success: true });
}