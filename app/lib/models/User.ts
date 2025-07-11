import mongoose, { type Document, Schema } from "mongoose"
import bcrypt from "bcryptjs"

export interface IUser extends Document {
  _id: string
  email: string
  password?: string
  name: string
  role: "user" | "admin"
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
  }
  googleId?: string
  authProvider?: "credentials" | "google"
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
  {
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
    password: {
      type: String,
      required: false,
      minlength: [6, "Password must be at least 6 characters"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    googleId: {
      type: String,
    },
    authProvider: {
      type: String,
      enum: ["credentials", "google"],
      default: "google",
    },
  },
  {
    timestamps: true,
  },
)

UserSchema.pre("save", async function (next) {
  if (this.authProvider === "credentials" && !this.password) {
    const error = new Error("Password is required for credentials users")
    return next(error)
  }

  if (this.isModified("password") && this.password) {
    try {
      const salt = await bcrypt.genSalt(12)
      this.password = await bcrypt.hash(this.password, salt)
    } catch (error: any) {
      return next(error)
    }
  }

  next()
})

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false
  return bcrypt.compare(candidatePassword, this.password)
}

UserSchema.methods.toJSON = function () {
  const userObject = this.toObject()
  delete userObject.password
  return userObject
}

UserSchema.index({ email: 1 }, { unique: true })
UserSchema.index({ googleId: 1 }, { sparse: true })

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)
