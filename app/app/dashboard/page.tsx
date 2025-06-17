import { UserDashboard } from "@/app/dashboard/user-dashboard"
import { redirect } from "next/navigation"
import Navbar from "@/components/layout/navbar"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import Order from "@/lib/models/Order"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect("/login")
  }

  if (session.user.role === "admin") {
    redirect("/admin")
  }

  await connectDB()

  try {
    let user = await User.findOne({ email: session.user.email }).lean()

    if (!user) {
      const { findOrCreateOAuthUser } = await import("@/lib/database/users")
      user = await findOrCreateOAuthUser({
        email: session.user.email!,
        name: session.user.name || "Unknown User",
        googleId: session.user.id || "",
        role: "user",
      })
    }

    const userOrders = await Order.find({ userId: user._id }).lean()

    const safeUser = JSON.parse(JSON.stringify(user))
    const safeOrders = userOrders.map((order) => JSON.parse(JSON.stringify(order)))

    return (
      <>
        <Navbar />
        <UserDashboard user={safeUser} orders={safeOrders} />
      </>
    )
  } catch (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Dashboard Error</h2>
            <p className="text-red-600">
              There was an error loading your dashboard. Please try again or contact support.
            </p>
          </div>
        </div>
      </>
    )
  }
}
