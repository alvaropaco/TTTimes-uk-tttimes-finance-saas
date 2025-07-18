import mongoose from "mongoose"

export interface IUser extends mongoose.Document {
  email: string
  name?: string
  image?: string
  apiKey: string
  plan: "free" | "pro" | "enterprise"
  usage: {
    requests: number
    lastReset: Date
  }
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new mongoose.Schema<IUser>(
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
      trim: true,
    },
    image: {
      type: String,
    },
    apiKey: {
      type: String,
      required: true,
      unique: true,
    },
    plan: {
      type: String,
      enum: ["free", "pro", "enterprise"],
      default: "free",
    },
    usage: {
      requests: {
        type: Number,
        default: 0,
      },
      lastReset: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better performance
UserSchema.index({ email: 1 })
UserSchema.index({ apiKey: 1 })

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
