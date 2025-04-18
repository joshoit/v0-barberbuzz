import { type NextRequest, NextResponse } from "next/server"
import { clearSessionCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true })

  await clearSessionCookie(response)

  return response
}
