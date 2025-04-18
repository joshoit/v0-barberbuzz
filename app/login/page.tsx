import type { Metadata } from "next"
import { AuthForm } from "@/components/AuthForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Scissors } from "lucide-react"

export const metadata: Metadata = {
  title: "Login - BarberBuzz",
  description: "Sign in to your BarberBuzz account",
}

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Scissors className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">BarberBuzz</CardTitle>
          <CardDescription>Sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm type="login" />

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Contact your administrator if you need access.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
