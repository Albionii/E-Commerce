import { verifySession } from "@/lib/dal"
import { AdminDashboard } from "@/components/admin/admin-dashboard"
import { redirect } from "next/navigation"
import Navbar from "@/components/layout/navbar"

export default async function AdminPage() {
  const session = await verifySession()

  if (session.role !== "admin") {
    redirect("/dashboard")
  }

  return(
    <>
        <Navbar/>
        <AdminDashboard />
    </>
  ) 
  
}
