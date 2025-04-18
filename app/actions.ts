"use server"

import { revalidatePath } from "next/cache"
import {
  createFeedback as createFeedbackInAirtable,
  updateFeedbackNote as updateFeedbackNoteInAirtable,
  feedbackSchema,
  type FeedbackInput,
} from "@/lib/airtable"

export async function submitFeedback(data: FeedbackInput) {
  // Validate the data
  const validatedData = feedbackSchema.parse(data)

  // Create feedback in Airtable
  const feedback = await createFeedbackInAirtable(validatedData)

  if (!feedback) {
    throw new Error("Failed to create feedback")
  }

  return feedback
}

export async function updateFeedbackNote(feedbackId: string, note: string) {
  const success = await updateFeedbackNoteInAirtable(feedbackId, note)

  if (!success) {
    throw new Error("Failed to update feedback note")
  }

  revalidatePath("/app/[storeSlug]/dashboard")
  revalidatePath("/admin/dashboard")

  return { success }
}

export async function sendMessage(feedbackId: string) {
  // This would integrate with a messaging service like Twilio or SendGrid
  // For now, we'll just simulate a successful message send

  console.log(`Sending message for feedback ${feedbackId}`)

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return { success: true }
}

export async function resetMessageTimer(feedbackId: string) {
  // This would update a field in Airtable to reset the message timer
  // For now, we'll just simulate a successful reset

  console.log(`Resetting message timer for feedback ${feedbackId}`)

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  return { success: true }
}
