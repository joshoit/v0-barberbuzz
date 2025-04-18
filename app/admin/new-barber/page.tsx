"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

const newBarberSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  isAdmin: z.boolean().default(false),
  createStore: z.boolean().default(false),
  storeName: z.string().optional(),
  storeSlug: z.string().optional(),
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
})

type NewBarberFormValues = z.infer<typeof newBarberSchema>

export default function NewBarberPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<NewBarberFormValues>({
    resolver: zodResolver(newBarberSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      isAdmin: false,
      createStore: false,
      storeName: "",
      storeSlug: "",
      primaryColor: "#0057D9",
      accentColor: "#FFD339",
    },
  })

  const watchCreateStore = form.watch("createStore")

  const onSubmit = async (data: NewBarberFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/admin/barbers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to create barber")
      }

      router.push("/admin/dashboard")
    } catch (err) {
      console.error("Error creating barber:", err)
      setError(err instanceof Error ? err.message : "Failed to create barber. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-gray-600 mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Create New Barber</CardTitle>
            <CardDescription>Add a new barber account to the system</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Barber Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="John Doe" {...form.register("name")} />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-sm">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" {...form.register("email")} />
                  {form.formState.errors.email && (
                    <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" {...form.register("password")} />
                  {form.formState.errors.password && (
                    <p className="text-red-500 text-sm">{form.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isAdmin"
                    checked={form.watch("isAdmin")}
                    onCheckedChange={(checked) => form.setValue("isAdmin", checked as boolean)}
                  />
                  <Label htmlFor="isAdmin">Make this barber an admin</Label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Store Assignment</h3>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="createStore"
                    checked={form.watch("createStore")}
                    onCheckedChange={(checked) => form.setValue("createStore", checked as boolean)}
                  />
                  <Label htmlFor="createStore">Create a new store for this barber</Label>
                </div>

                {watchCreateStore && (
                  <div className="space-y-4 border-l-2 pl-4 ml-2">
                    <div className="space-y-2">
                      <Label htmlFor="storeName">Store Name</Label>
                      <Input id="storeName" placeholder="Downtown Barbers" {...form.register("storeName")} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="storeSlug">Store Slug</Label>
                      <Input id="storeSlug" placeholder="downtown" {...form.register("storeSlug")} />
                      <p className="text-xs text-gray-500">Used in URLs: /app/[slug]/feedback</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="primaryColor"
                            type="color"
                            className="w-12 h-10 p-1"
                            {...form.register("primaryColor")}
                          />
                          <Input
                            type="text"
                            value={form.watch("primaryColor")}
                            onChange={(e) => form.setValue("primaryColor", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accentColor">Accent Color</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="accentColor"
                            type="color"
                            className="w-12 h-10 p-1"
                            {...form.register("accentColor")}
                          />
                          <Input
                            type="text"
                            value={form.watch("accentColor")}
                            onChange={(e) => form.setValue("accentColor", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!watchCreateStore && (
                  <div className="text-sm text-gray-500">
                    You can assign existing stores to this barber after creation.
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Barber"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
