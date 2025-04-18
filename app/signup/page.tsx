import type { Metadata } from "next"
import Link from "next/link"
import { AuthForm } from "@/components/AuthForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Sign Up - BarberBuzz",
  description: "Create your BarberBuzz account",
}

export default function SignupPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-raleway">Create an Account</CardTitle>
          <CardDescription>Sign up to start collecting customer feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <AuthForm type="signup" />

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
