import { redirect } from "next/navigation"
import { isDashboardAuthenticated } from "../actions/auth"
import { DashboardClient } from "@/components/DashboardClient"

export default async function DashboardPage() {
  // Check authentication on the server
  const isAuthenticated = await isDashboardAuthenticated()

  if (!isAuthenticated) {
    redirect("/login?redirect=/dashboard")
  }

  return <DashboardClient />
}
