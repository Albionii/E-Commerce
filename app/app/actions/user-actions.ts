"use server"

import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { updateUser } from "@/lib/database/users"
import { revalidatePath } from "next/cache"
import { verifySession } from "@/lib/dal"

interface ProfileUpdateData {
  name: string
  email: string
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    zipCode?: string
  }
}

export async function updateUserProfile(data: ProfileUpdateData) {
  try {
    // const session = await getServerSession(authOptions)
    const session = await verifySession()

    if (session.isAuth) {
      return { success: false, message: "You must be logged in to update your profile" }
    }

    const userId = session.userId

    // Update user in database
    await updateUser(userId, {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
    })

    // Revalidate the profile page to show updated data
    revalidatePath("/profile")

    return { success: true }
  } catch (error: any) {
    console.error("Error updating profile:", error)
    return {
      success: false,
      message: error.message || "Failed to update profile",
    }
  }
}
