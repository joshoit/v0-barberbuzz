import { type NextRequest, NextResponse } from "next/server"
import { createSession, setSessionCookie, verifyPassword } from "@/lib/auth"
import { getBarberByEmail } from "@/lib/airtable"

// Handles POST request to /api/login for authenticating barbers
export async function POST(request: NextRequest) {
  try {
    // 📨 Parse incoming email and password
    const { email, password } = await request.json()

    // ❌ Return error if required fields are missing
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log(`Attempting login for email: ${email}`)

    try {
      // 🔍 Find the barber by email in Airtable
      const barber = await getBarberByEmail(email)

      if (!barber) {
        // ❌ Barber not found
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
      }

      // 🔐 Check if password matches the stored hash
      const passwordValid = await verifyPassword(password, barber.passwordHash)

      if (!passwordValid) {
        // ❌ Password mismatch
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
      }

      // ✅ Prepare session user data
      const user = {
        id: barber.id,
        name: barber.name,
        email: barber.email,
        isAdmin: barber.isAdmin,
      }

      // 🎟️ Create a signed JWT session token
      const token = await createSession(user)

      // 📦 Prepare success response with session data
      const response = NextResponse.json({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      })

      // 🍪 Attach session cookie to response
      await setSessionCookie(response, token)

      return response
    } catch (authError) {
      // ⚠️ Auth-level failures (e.g. Airtable access)
      console.error("Authentication error:", authError)
      return NextResponse.json({ error: "Authentication service unavailable" }, { status: 503 })
    }
  } catch (error) {
    // 🧯 Unexpected server error
    console.error("Login error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}
