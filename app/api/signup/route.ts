import { NextResponse } from "next/server"
import { hashPassword } from "@/lib/auth"
import { createBarber } from "@/lib/airtable"

export async function POST(request: Request) {
  try {
    const { name, email, password, shop_name } = await request.json()

    // Validate required fields
    if (!name || !email || !password || !shop_name) {
      return NextResponse.json(
        { error: "Name, email, password, and shop name are required" },
        { status: 400 }
      )
    }

    // Hash password securely
    const passwordHash = await hashPassword(password)

    // Create barber entry in Airtable
    const barber = await createBarber({
      name,
      email,
      passwordHash,
      shop_name,
      isAdmin: false,
    })

    // Handle Airtable failure
    if (!barber) {
      return NextResponse.json({ error: "Failed to create barber" }, { status: 500 })
    }

    // Respond with success and created record info
    return NextResponse.json(
      {
        success: true,
        barber: {
          id: barber.id,
          name: barber.name,
          email: barber.email,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "An error occurred during signup" }, { status: 500 })
  }
}
