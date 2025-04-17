import { FeedbackForm } from "@/components/feedback-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Scissors } from "lucide-react"

export default function FeedbackPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Scissors className="h-6 w-6 text-gray-600" />
          </div>
          <CardTitle className="text-2xl">BarberBuzz Feedback</CardTitle>
          <CardDescription>Tell us about your experience</CardDescription>
        </CardHeader>
        <CardContent>
          <FeedbackForm />
        </CardContent>
      </Card>
    </div>
  )
}
