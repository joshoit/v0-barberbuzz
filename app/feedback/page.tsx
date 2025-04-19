// Import necessary UI components and the feedback form
import { FeedbackForm } from "@/components/feedback-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Scissors } from "lucide-react"

// This page renders the feedback submission interface
export default function FeedbackPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      {/* Feedback card container */}
      <Card className="w-full max-w-md">
        
        {/* Card header section with icon, title, and description */}
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Scissors className="h-6 w-6 text-gray-600" /> {/* Icon for branding */}
          </div>
          <CardTitle className="text-2xl">BarberBuzz Feedback</CardTitle>
          <CardDescription>
            Tell us about your experience
          </CardDescription>
        </CardHeader>

        {/* Card content area holding the feedback form */}
        <CardContent>
          <FeedbackForm /> {/* Reusable form component */}
        </CardContent>
      </Card>
    </div>
  )
}
