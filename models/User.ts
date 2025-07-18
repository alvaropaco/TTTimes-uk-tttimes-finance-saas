import mongoose, { Schema } from 'mongoose';

import crypto from 'crypto';

const userSchema = new Schema({
  clerkId: { type: String, unique: true, sparse: true }, // sparse: true allows multiple null values
  email: { type: String, required: true, unique: true },
  apiKey: { type: String, unique: true, default: () => crypto.randomBytes(32).toString('hex') },
  name: { type: String }, // Add name field for compatibility
  token: { type: String }, // Add token field for compatibility
  plan: { type: String, default: 'free' }, // Add plan field for compatibility
  createdAt: { type: Date, default: Date.now },
});

// Check if model already exists to prevent recompilation error
export const User = mongoose.models.User || mongoose.model('User', userSchema);