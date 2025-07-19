import mongoose from "mongoose"

const apiUsageSchema = new mongoose.Schema({
  apiKey: {
    type: String,
    required: true,
    index: true,
  },
  date: {
    type: String,
    required: true,
    index: true,
  },
  endpoints: {
    type: Map,
    of: Number,
    default: new Map(),
  },
  totalRequests: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Compound index for efficient queries
apiUsageSchema.index({ apiKey: 1, date: 1 }, { unique: true })

// Update the updatedAt field on save
apiUsageSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

export const ApiUsage = mongoose.models.ApiUsage || mongoose.model("ApiUsage", apiUsageSchema)
