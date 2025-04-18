import { type NextRequest, NextResponse } from "next/server"
import { authenticateUser, createSession, setSessionCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    console.log(`Attempting login for email: ${email}`)

    try {
      const user = await authenticateUser(email, password)

      if (!user) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
      }

      // Create session token
      const token = await createSession(user)

      // Create response
      const response = NextResponse.json({
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      })

      // Set session cookie
      await setSessionCookie(response, token)

      return response
    } catch (authError) {
      console.error("Authentication error:", authError)
      return NextResponse.json({ error: "Authentication service unavailable" }, { status: 503 })
    }
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}
