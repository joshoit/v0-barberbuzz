"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Form schemas
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
})

const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  shop_name: z.string().min(2, { message: "Shop name must be at least 2 characters." }),
})

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
})

type AuthFormType = "login" | "signup" | "forgot-password"

interface AuthFormProps {
  type: AuthFormType
}

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const schema =
    type === "login"
      ? loginSchema
      : type === "signup"
      ? signupSchema
      : forgotPasswordSchema

  const form = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      shop_name: "",
    },
  })

  async function onSubmit(values: any) {
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      if (type === "login") {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email, password: values.password }),
        })

        const data = await response.json()

        if (!response.ok) {
          console.error("Login failed:", data)
          throw new Error(data.error || "Login failed")
        }

        router.push("/app")
        router.refresh()

      } else if (type === "signup") {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
            shop_name: values.shop_name,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          console.error("Signup failed:", data)
          throw new Error(data.error || "Signup failed")
        }

        setSuccess("Account created successfully! You can now log in.")
        setTimeout(() => router.push("/login"), 3000)

      } else if (type === "forgot-password") {
        setSuccess("Password reset instructions would be sent to your email in a real application.")
      }

    } catch (error: any) {
      console.error("Auth error:", error)
      setError(error.message || "An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {type === "signup" && (
          <>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" className="shadow-inner" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="shop_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Awesome Cuts" className="shadow-inner" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" className="shadow-inner" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {(type === "login" || type === "signup") && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shadow-inner" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-gray-500">
          <p>Note: This is a demo application. Authentication is simulated and no real accounts are created.</p>
        </div>

        <Button type="submit" className="w-full shadow-lg" disabled={isSubmitting}>
          {type === "login"
            ? isSubmitting
              ? "Logging in..."
              : "Log In"
            : type === "signup"
              ? isSubmitting
                ? "Creating Account..."
                : "Create Account"
              : isSubmitting
                ? "Sending..."
                : "Reset Password"}
        </Button>
      </form>
    </Form>
  )
}
