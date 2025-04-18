import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import type { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { getBarberByEmail } from "./airtable"

// Types
export interface SessionUser {
  id: string
  name: string
  email: string
  isAdmin: boolean
}

// Constants
const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET || "fallback_secret_do_not_use_in_production_please_set_SESSION_SECRET_env_var",
)
const SESSION_COOKIE_NAME = "barberbuzz_session"

// Helper functions
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Session management
export async function createSession(user: SessionUser): Promise<string> {
  const token = await new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET)

  return token
}

export async function getSession(request?: NextRequest): Promise<SessionUser | null> {
  const cookieStore = cookies()
  const token = request ? request.cookies.get(SESSION_COOKIE_NAME)?.value : cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as SessionUser
  } catch (error) {
    console.error("Invalid session token:", error)
    return null
  }
}

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

// Authentication functions
export async function authenticateUser(email: string, password: string): Promise<SessionUser | null> {
  const barber = await getBarberByEmail(email)

  if (!barber) return null

  const passwordValid = await verifyPassword(password, barber.passwordHash)

  if (!passwordValid) return null

  return {
    id: barber.id,
    name: barber.name,
    email: barber.email,
    isAdmin: barber.isAdmin,
  }
}
