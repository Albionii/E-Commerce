import "server-only"
import { cache } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export const verifySession = cache(async () => {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      redirect("/login")
    }

    return {
      isAuth: true,
      userId: session.user.id,
      role: session.user.role as "user" | "admin",
      email: session.user.email!,
      name: session.user.name,
    }
  } catch (error) {
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
    return null
  }
})
