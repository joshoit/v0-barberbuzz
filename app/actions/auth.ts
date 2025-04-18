"use server"

import { cookies } from "next/headers"

// Check if the provided secret matches the environment variable
export async function checkDashboardSecret(secret: string): Promise<boolean> {
  const dashboardSecret = process.env.SHARED_DASHBOARD_SECRET

  if (!dashboardSecret) {
    console.warn("SHARED_DASHBOARD_SECRET is not configured, using fallback authentication")
    // For development, allow a simple fallback password
    const isValid = secret === "barberbuzz"

    if (isValid) {
      // Set a cookie to remember authentication
      cookies().set("dashboard_auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      })
    }

    return isValid
  }

  const isValid = secret === dashboardSecret

  if (isValid) {
    // Set a cookie to remember authentication
    cookies().set("dashboard_auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })
  }

  return isValid
}

// Check if the user is authenticated via cookie
export async function isDashboardAuthenticated(): Promise<boolean> {
  const authCookie = cookies().get("dashboard_auth")
  return authCookie?.value === "authenticated"
}
