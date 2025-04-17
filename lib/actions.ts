"use server"

import { z } from "zod"

const feedbackSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  barberId: z.string(),
  rating: z.string(),
  comments: z.string().optional(),
})

type FeedbackData = z.infer<typeof feedbackSchema>

export async function submitFeedback(data: FeedbackData) {
  // Validate the data
  const validatedData = feedbackSchema.parse(data)

  // In a real application, you would store this in a database
  // For now, we'll just log it and simulate a delay
  console.log("Feedback submitted:", validatedData)

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return { success: true }
}
