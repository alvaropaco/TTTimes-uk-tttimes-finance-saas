import mongoose, { Schema } from 'mongoose';

import crypto from 'crypto';

const userSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  apiKey: { type: String, unique: true, default: () => crypto.randomBytes(32).toString('hex') },
  createdAt: { type: Date, default: Date.now },
});

export const User = mongoose.model('User', userSchema);