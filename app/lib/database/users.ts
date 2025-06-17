import connectDB from "@/lib/mongodb"
import User, { type IUser } from "@/lib/models/User"

export async function createUser(userData: {
  email: string
  password?: string
  name: string
  role?: "user" | "admin"
  authProvider?: "credentials" | "google"
  googleId?: string
}) {
  await connectDB()

  const userDoc = {
    ...userData,
    authProvider: userData.authProvider || (userData.password ? "credentials" : "google"),
  }

  const user = new User(userDoc)
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

export async function getUserByGoogleId(googleId: string): Promise<IUser | null> {
  await connectDB()
  return User.findOne({ googleId }).select("-password").lean()
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

  const user = await User.findOne({
    email,
    authProvider: "credentials",
  })

  if (!user || !user.password) {
    return null
  }

  const isValidPassword = await user.comparePassword(password)
  if (!isValidPassword) {
    return null
  }

  return user
}

export async function findOrCreateOAuthUser(userData: {
  email: string
  name: string
  googleId: string
  role?: "user" | "admin"
}): Promise<IUser> {
  await connectDB()

  const existingUser = await User.findOne({ email: userData.email })

  if (existingUser) {
    if (!existingUser.googleId && userData.googleId) {
      existingUser.googleId = userData.googleId
      if (existingUser.authProvider !== "credentials") {
        existingUser.authProvider = "google"
      }
      await existingUser.save()
    }
    return existingUser
  }

  try {
    const newUser = await User.create({
      email: userData.email,
      name: userData.name,
      role: userData.role || "user",
      authProvider: "google",
      googleId: userData.googleId,
    })
    return newUser
  } catch (createError) {
    const directUserData = {
      email: userData.email,
      name: userData.name,
      role: userData.role || "user",
      authProvider: "google",
      googleId: userData.googleId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await User.collection.insertOne(directUserData)
    const newUser = await User.findById(result.insertedId).lean()

    if (!newUser) {
      throw new Error("Failed to create user")
    }

    return newUser
  }
}

export async function findUserByEmailOrGoogleId(email: string, googleId?: string): Promise<IUser | null> {
  await connectDB()

  const query: any = { email }

  if (googleId) {
    query.$or = [{ email }, { googleId }]
  }

  return User.findOne(query).lean()
}

export async function linkGoogleAccount(email: string, googleId: string): Promise<IUser | null> {
  await connectDB()

  const user = await User.findOneAndUpdate({ email, authProvider: "credentials" }, { googleId }, { new: true }).select(
    "-password",
  )

  return user
}

export async function getUserStats() {
  await connectDB()

  const [totalUsers, credentialsUsers, googleUsers, adminUsers] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ authProvider: "credentials" }),
    User.countDocuments({ authProvider: "google" }),
    User.countDocuments({ role: "admin" }),
  ])

  return {
    total: totalUsers,
    credentials: credentialsUsers,
    google: googleUsers,
    admins: adminUsers,
  }
}
