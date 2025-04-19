// Import core modules
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import type { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

// ------------------------------------------
// 👤 Type Definitions
// ------------------------------------------

export interface SessionUser {
  id: string            // Airtable record ID (still useful internally)
  name: string          // Barber's display name
  email: string         // Email used for login
  isAdmin: boolean      // Role-based access control
}

// ------------------------------------------
// 🔐 Configuration Constants
// ------------------------------------------

// Fallback in case SESSION_SECRET is not defined (warning for prod)
const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "fallback_secret_do_not_use_in_production_please_set_SESSION_SECRET_env_var"
)

// Cookie name used across app
export const SESSION_COOKIE_NAME = "barberbuzz_session"

// ------------------------------------------
// 🔑 Password Hashing & Verification
// ------------------------------------------

// Hash a plaintext password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Compare a plaintext password with a stored hash
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// ------------------------------------------
// 📦 Create JWT Session Token
// ------------------------------------------

// Creates a signed JWT containing user session data
export async function createSession(user: SessionUser): Promise<string> {
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })         // HMAC SHA256 algorithm
    .setIssuedAt()                                // Token issue timestamp
    .setExpirationTime("24h")                     // Valid for 24 hours
    .sign(JWT_SECRET)

  return token
}

// ------------------------------------------
// 🧾 Read and Verify Session Token from Cookies
// ------------------------------------------

// Extracts and verifies JWT from cookies (can handle App Router or Edge API)
export async function getSession(request?: NextRequest): Promise<SessionUser | null> {
  const cookieStore = request ? request.cookies : cookies()
  const token = request
    ? request.cookies.get(SESSION_COOKIE_NAME)?.value
    : (await cookieStore).get(SESSION_COOKIE_NAME)?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as SessionUser
  } catch (error) {
    console.error("Invalid session token:", error)
    return null
  }
}

// ------------------------------------------
// 🍪 Set Session Cookie in Response
// ------------------------------------------

// Attaches the signed token as a secure HTTP-only cookie
export async function setSessionCookie(response: NextResponse, token: string): Promise<void> {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  })
}

// ------------------------------------------
// ❌ Clear Session Cookie (Logout)
// ------------------------------------------

// Clears the session cookie by setting its expiry to 0
export async function clearSessionCookie(response: NextResponse): Promise<void> {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  })
}


// Authentication functions - moved to server-side routes
// This function is now moved to the login API route to avoid Edge Runtime issues
// export async function authenticateUser(email: string, password: string): Promise<SessionUser | null> {
//   // This has been moved to app/api/login/route.ts
// }
