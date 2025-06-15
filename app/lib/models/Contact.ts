import mongoose, { type Document, Schema } from "mongoose"

export interface IContact extends Document {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  status: "new" | "read" | "replied" | "closed"
  createdAt: Date
  updatedAt: Date
}

const ContactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      validate: {
        validator: (email: string) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email),
        message: "Please enter a valid email",
      },
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
      minlength: [5, "Subject must be at least 5 characters"],
      maxlength: [200, "Subject cannot exceed 200 characters"],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters"],
      maxlength: [2000, "Message cannot exceed 2000 characters"],
    },
    status: {
      type: String,
      enum: ["new", "read", "replied", "closed"],
      default: "new",
    },
  },
  {
    timestamps: true,
  },
)

// Create indexes
ContactSchema.index({ email: 1 })
ContactSchema.index({ status: 1 })
ContactSchema.index({ createdAt: -1 })

export default mongoose.models.Contact || mongoose.model<IContact>("Contact", ContactSchema)
