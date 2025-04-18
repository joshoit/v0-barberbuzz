import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { hashPassword } from "@/lib/auth"
import { createBarber, createStore } from "@/lib/airtable"

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const session = await getSession(request)

    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await hashPassword(data.password)

    // Create barber
    const barber = await createBarber({
      name: data.name,
      email: data.email,
      passwordHash,
      isAdmin: data.isAdmin || false,
    })

    if (!barber) {
      return NextResponse.json({ error: "Failed to create barber" }, { status: 500 })
    }

    // Create store if requested
    if (data.createStore && data.storeName && data.storeSlug) {
      const store = await createStore({
        name: data.storeName,
        slug: data.storeSlug,
        primaryColor: data.primaryColor || "#0057D9",
        accentColor: data.accentColor || "#FFD339",
        barber: barber.id,
      })

      if (!store) {
        return NextResponse.json({ error: "Barber created but failed to create store" }, { status: 500 })
      }

      return NextResponse.json({
        barber,
        store,
      })
    }

    return NextResponse.json({ barber })
  } catch (error) {
    console.error("Error creating barber:", error)
    return NextResponse.json({ error: "An error occurred while creating the barber" }, { status: 500 })
  }
}
