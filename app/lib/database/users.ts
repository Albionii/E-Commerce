import connectDB from "@/lib/mongodb"
import User, { type IUser } from "@/lib/models/User"

export async function createUser(userData: {
  email: string
  password: string
  name: string
  role?: "user" | "admin"
}) {
  await connectDB()

  const user = new User(userData)
  await user.save()
  return user
}

export async function getUserByEmail(email: string): Promise<IUser | null> {
  await connectDB()
  return User.findOne({ email }).lean()
}

export async function getUserById(id: string): Promise<IUser | null> {
  await connectDB()
  return User.findById(id).select("-password").lean()
}

export async function updateUser(id: string, updateData: Partial<IUser>) {
  await connectDB()
  return User.findByIdAndUpdate(id, updateData, { new: true }).select("-password")
}

export async function deleteUser(id: string) {
  await connectDB()
  return User.findByIdAndDelete(id)
}

export async function getAllUsers(page = 1, limit = 10) {
  await connectDB()
  const skip = (page - 1) * limit

  const [users, total] = await Promise.all([
    User.find().select("-password").skip(skip).limit(limit).sort({ createdAt: -1 }),
    User.countDocuments(),
  ])

  return {
    users,
    total,
    page,
    pages: Math.ceil(total / limit),
  }
}

export async function authenticateUser(email: string, password: string): Promise<IUser | null> {
  await connectDB()
  const user = await User.findOne({ email })

  if (!user || !(await user.comparePassword(password))) {
    return null
  }

  return user
}
