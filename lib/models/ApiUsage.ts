import mongoose from "mongoose"

const apiUsageSchema = new mongoose.Schema({
  apiKey: {
    type: String,
    required: true,
  },
  date: {
    type: String, // YYYY-MM-DD format
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  requests: [
    {
      endpoint: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
})

apiUsageSchema.index({ apiKey: 1, date: 1 }, { unique: true })

export const ApiUsage = mongoose.models.ApiUsage || mongoose.model("ApiUsage", apiUsageSchema)
