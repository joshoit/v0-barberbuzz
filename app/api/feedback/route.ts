import { NextResponse } from "next/server"
import { z } from "zod"
import { createFeedback, getBarberBySlug, getFeedbackForBarber } from "@/lib/airtable"

// Validation schema
const feedbackSchema = z.object({
  customer_name: z.string().min(2),
  rating: z.number().min(1).max(5),
  visit_again: z.enum(["yes", "maybe", "no"]),
  contact: z.string().min(5),
  comments: z.string().optional(),
  opt_in: z.boolean().default(false),
  barber_id: z.string(),
})

export async function POST(request: Request) {
  try {
    // Parse and validate the request body
    const body = await request.json()
    const validatedData = feedbackSchema.parse(body)

    // Get the barber
    const barber = await getBarberBySlug(validatedData.barber_id)

    if (!barber) {
      return NextResponse.json({ error: "Barber not found" }, { status: 404 })
    }

    // Create the feedback in Airtable
    const feedback = await createFeedback(validatedData)

    if (!feedback) {
      return NextResponse.json({ error: "Failed to create feedback" }, { status: 500 })
    }

    // In a real application, you would send a notification here
    // For now, we'll just return success
    return NextResponse.json({ success: true, feedback })
  } catch (error) {
    console.error("Error creating feedback:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    // Get the barber ID from the query string
    const url = new URL(request.url)
    const barberId = url.searchParams.get("barberId")

    if (!barberId) {
      return NextResponse.json({ error: "Barber ID is required" }, { status: 400 })
    }

    // Get feedback for the barber from Airtable
    const feedback = await getFeedbackForBarber(barberId)

    return NextResponse.json(feedback)
  } catch (error) {
    console.error("Error fetching feedback:", error)
    return NextResponse.json({ error: "Failed to fetch feedback" }, { status: 500 })
  }
}
