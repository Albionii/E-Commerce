import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getUserById } from "@/lib/database/users"
import ProfileForm from "@/components/profile/profile-form"
import type { Metadata } from "next"
import Navbar from "@/components/layout/navbar"

export const metadata: Metadata = {
  title: "Your Profile | TechTreasure",
  description: "View and edit your profile information",
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login?callbackUrl=/profile")
  }

  const userId = session.user.id
  const user = await getUserById(userId)

  if (!user) {
    redirect("/login")
  }

  return (
    <>
    <Navbar/>
    <div className="flex justify-center">
      <div className="container max-w-4xl py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
          <p className="text-muted-foreground">
            View and update your account information
          </p>
        </div>

        <div className="grid gap-8">
          <ProfileForm user={user} />
        </div>
      </div>
    </div>
    </>
  )
}
