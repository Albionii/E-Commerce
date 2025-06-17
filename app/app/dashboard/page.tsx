import { verifySession } from "@/lib/dal";
import { UserDashboard } from "@/components/dashboard/user-dashboard";
import { redirect } from "next/navigation";
import Navbar from "@/components/layout/navbar";

import { mockOrders, mockUsers } from "@/lib/mock-data"

export default async function DashboardPage() {
  // Later you'll replace this with real DB queries
  const user = mockUsers.find((u) => u.id === "1")
  const userOrders = mockOrders.filter((order) => order.userId === "1")

  // Serialize to plain JSON if needed
  const safeUser = JSON.parse(JSON.stringify(user))
  const safeOrders = JSON.parse(JSON.stringify(userOrders))
  const session = await verifySession();

  if (session.role === "admin") {
    redirect("/admin");
  }

  return (
    <>
      <Navbar />
      <UserDashboard user={safeUser} orders={safeOrders} />
    </>
  );
}
