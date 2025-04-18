import { NextResponse } from "next/server"
import { hashPassword } from "@/lib/auth"
import { createBarber } from "@/lib/airtable"

export async function POST(request: Request) {
  try {
    const { name, email, password, shop_name } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    // Create barber in Airtable
    const barber = await createBarber({
      name,
      email,
      passwordHash,
      isAdmin: false,
    })

    if (!barber) {
      return NextResponse.json({ error: "Failed to create barber" }, { status: 500 })
    }

    return NextResponse.json(
      { success: true, barber: { id: barber.id, name: barber.name, email: barber.email } },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "An error occurred during signup" }, { status: 500 })
  }
}
