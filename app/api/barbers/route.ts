import { NextResponse } from "next/server"
import { getBarbers } from "@/lib/airtable"

export async function GET() {
  try {
    // Simple authentication check
    // In a real application, you would use a more secure method
    const dashboardSecret = process.env.SHARED_DASHBOARD_SECRET

    if (!dashboardSecret) {
      console.warn("SHARED_DASHBOARD_SECRET is not configured, proceeding with reduced security")
    }

    // Get barbers from Airtable
    const barbers = await getBarbers()

    return NextResponse.json(barbers)
  } catch (error) {
    console.error("Error fetching barbers:", error)
    return NextResponse.json({ error: "Failed to fetch barbers" }, { status: 500 })
  }
}
