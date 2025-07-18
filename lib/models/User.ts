import mongoose, { Schema, type Document } from "mongoose"

export interface IUser extends Document {
  email: string
  name: string
  image?: string
  apiKey: string
  plan: "free" | "pro" | "enterprise"
  createdAt: Date
  lastLoginAt: Date
  usage?: {
    requests: number
    lastReset: Date
  }
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    apiKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    plan: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
    usage: {
      requests: { type: Number, default: 0 },
      lastReset: { type: Date, default: Date.now },
    },
  },
  {
    timestamps: true,
    collection: "users",
  },
)

// Remove duplicate indexes by not specifying them in schema options
userSchema.index({ email: 1 }, { unique: true })
userSchema.index({ apiKey: 1 }, { unique: true })

// Pre-save middleware to update lastLoginAt
userSchema.pre("save", function (next) {
  if (this.isNew) {
    this.lastLoginAt = new Date()
  }
  next()
})

// Check if model already exists to prevent recompilation error
export const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema)
