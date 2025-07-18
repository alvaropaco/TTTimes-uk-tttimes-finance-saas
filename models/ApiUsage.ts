import mongoose, { Schema } from 'mongoose';

const apiUsageSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  count: { type: Number, default: 0 },
});

apiUsageSchema.index({ userId: 1, date: 1 }, { unique: true });

export type ApiUsageType = {
  userId: Schema.Types.ObjectId,
  date: Date,
  count: Number,
}

// Check if model already exists to prevent recompilation error
export const ApiUsage = mongoose.models.ApiUsage || mongoose.model<ApiUsageType>('ApiUsage', apiUsageSchema);