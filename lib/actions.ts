"use server"

import { z } from "zod"
import { createFeedback } from "./airtable"

const feedbackSchema = z.object({
  customer_name: z.string().min(2),
  rating: z.number().min(1).max(5),
  visit_again: z.enum(["yes", "maybe", "no"]),
  contact: z.string().min(5),
  comments: z.string().optional(),
  opt_in: z.boolean().default(false),
  barber_id: z.string(),
})

type FeedbackData = z.infer<typeof feedbackSchema>

export async function submitFeedback(data: FeedbackData) {
  // Validate the data
  const validatedData = feedbackSchema.parse(data)

  try {
    // Create feedback in Airtable
    const feedback = await createFeedback(validatedData)
    return { success: true, feedback }
  } catch (error) {
    console.error("Error submitting feedback:", error)
    throw new Error("Failed to submit feedback")
  }
}
