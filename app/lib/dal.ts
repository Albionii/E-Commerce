import "server-only"
import { cache } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export const verifySession = cache(async () => {
  try {
    console.log("Verifying NextAuth session...")

    const session = await getServerSession(authOptions)

    console.log("NextAuth session:", {
      hasSession: !!session,
      userId: session?.user?.id,
      role: session?.user?.role,
    })

    if (!session?.user?.id) {
      console.log("No valid NextAuth session found, redirecting to login")
      redirect("/login")
    }

    console.log("NextAuth session verified successfully:", {
      userId: session.user.id,
      role: session.user.role,
    })

    return {
      isAuth: true,
      userId: session.user.id,
      role: session.user.role as "user" | "admin",
      email: session.user.email,
    }
  } catch (error) {
    console.error("NextAuth session verification error:", error)
    redirect("/login")
  }
})

export const getUser = cache(async () => {
  try {
    const session = await verifySession()
    if (!session) return null

    const { getUserById } = await import("@/lib/database/users")
    const user = await getUserById(session.userId)
    return user
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
})
