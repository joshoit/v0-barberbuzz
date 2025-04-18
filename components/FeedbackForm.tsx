"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { type Store, feedbackSchema } from "@/lib/airtable"
import { StarRating } from "./StarRating"
import { useToast } from "./ui/use-toast"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Checkbox } from "./ui/checkbox"
import { submitFeedback } from "@/app/actions"

type FormValues = z.infer<typeof feedbackSchema>

interface FeedbackFormProps {
  store: Store
}

export function FeedbackForm({ store }: FeedbackFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      store: store.id,
      customerName: "",
      rating: 0,
      visitAgain: "Yes",
      contact: "",
      optIn: false,
      comments: "",
    },
  })

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      await submitFeedback(data)

      toast({
        title: "Feedback submitted!",
        description: "Thank you for your feedback.",
        variant: "default",
      })

      setSubmitted(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        form.reset({
          store: store.id,
          customerName: "",
          rating: 0,
          visitAgain: "Yes",
          contact: "",
          optIn: false,
          comments: "",
        })
        setSubmitted(false)
      }, 3000)
    } catch (error) {
      console.error("Error submitting feedback:", error)
      toast({
        title: "Submission failed",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
        <p className="text-gray-600 mb-4">Your feedback has been submitted successfully.</p>
        <p className="text-sm text-gray-500">The form will reset automatically in a moment...</p>
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="customerName">Your Name</Label>
        <Input
          id="customerName"
          placeholder="Enter your name"
          {...form.register("customerName")}
          className="text-lg h-12"
        />
        {form.formState.errors.customerName && (
          <p className="text-red-500 text-sm">{form.formState.errors.customerName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Rate Your Experience</Label>
        <div className="flex justify-center py-2">
          <StarRating value={form.watch("rating")} onChange={(rating) => form.setValue("rating", rating)} size="lg" />
        </div>
        {form.formState.errors.rating && <p className="text-red-500 text-sm">{form.formState.errors.rating.message}</p>}
      </div>

      <div className="space-y-2">
        <Label>Would you visit again?</Label>
        <RadioGroup
          value={form.watch("visitAgain")}
          onValueChange={(value) => form.setValue("visitAgain", value as "Yes" | "Maybe" | "No")}
          className="flex justify-between"
        >
          <div className="flex items-center space-x-2 border rounded-md p-3 flex-1 justify-center">
            <RadioGroupItem value="Yes" id="yes" />
            <Label htmlFor="yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-3 flex-1 justify-center">
            <RadioGroupItem value="Maybe" id="maybe" />
            <Label htmlFor="maybe">Maybe</Label>
          </div>
          <div className="flex items-center space-x-2 border rounded-md p-3 flex-1 justify-center">
            <RadioGroupItem value="No" id="no" />
            <Label htmlFor="no">No</Label>
          </div>
        </RadioGroup>
        {form.formState.errors.visitAgain && (
          <p className="text-red-500 text-sm">{form.formState.errors.visitAgain.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact">Your Phone or Email (optional)</Label>
        <Input
          id="contact"
          placeholder="Phone or email for follow-up"
          {...form.register("contact")}
          className="text-lg h-12"
        />
        {form.formState.errors.contact && (
          <p className="text-red-500 text-sm">{form.formState.errors.contact.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="comments">Additional Comments (optional)</Label>
        <Textarea
          id="comments"
          placeholder="Tell us more about your experience..."
          {...form.register("comments")}
          className="min-h-[100px] text-lg"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="optIn"
          checked={form.watch("optIn")}
          onCheckedChange={(checked) => form.setValue("optIn", checked as boolean)}
        />
        <Label htmlFor="optIn" className="text-sm">
          Keep me updated with news and offers
        </Label>
      </div>

      <Button type="submit" className="w-full py-6 text-lg" disabled={isSubmitting || !form.formState.isValid}>
        {isSubmitting ? "Submitting..." : "Submit Feedback"}
      </Button>
    </form>
  )
}
