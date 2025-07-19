import mongoose, { Schema } from 'mongoose';
import crypto from 'crypto';

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String }, // For storing user profile image from OAuth
  apiKey: { type: String, unique: true, default: () => crypto.randomBytes(32).toString('hex') },
  plan: { type: String, default: 'free' },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date, default: Date.now },
});

// Check if model already exists to prevent recompilation error
export const User = mongoose.models.User || mongoose.model('User', userSchema);
