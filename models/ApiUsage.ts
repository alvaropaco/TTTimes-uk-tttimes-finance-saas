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

export const ApiUsage = mongoose.model<ApiUsageType>('ApiUsage', apiUsageSchema);