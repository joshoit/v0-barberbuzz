"use client"

import { useEffect, useState } from "react"
import { DashboardTable } from "@/components/DashboardTable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Define types based on Airtable structure
interface Barber {
  id: string
  name: string
  shop_name: string
  primary_color?: string
  accent_color?: string
  logo_url?: string
  slug?: string
  email?: string
  phone?: string
  created_at?: string
}

interface Feedback {
  id: string
  customer_name: string
  rating: number
  visit_again: "yes" | "maybe" | "no"
  contact: string
  comments?: string
  opt_in: boolean
  barber_id: string
  created_at: string
}

export function DashboardClient() {
  const [barbers, setBarbers] = useState<Barber[]>([])
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch barbers and feedback
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch barbers
        const barbersResponse = await fetch("/api/barbers")
        if (!barbersResponse.ok) throw new Error("Failed to fetch barbers")
        const barbersData = await barbersResponse.json()
        setBarbers(barbersData)

        // Set the first barber as selected by default
        if (barbersData.length > 0 && !selectedBarberId) {
          setSelectedBarberId(barbersData[0].id)

          // Fetch feedback for the first barber
          const feedbackResponse = await fetch(`/api/feedback?barberId=${barbersData[0].id}`)
          if (!feedbackResponse.ok) throw new Error("Failed to fetch feedback")
          const feedbackData = await feedbackResponse.json()
          setFeedback(feedbackData)
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load dashboard data. Please check your Airtable configuration.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedBarberId])

  // Handle barber selection change
  const handleBarberChange = async (barberId: string) => {
    setSelectedBarberId(barberId)

    try {
      setLoading(true)
      const feedbackResponse = await fetch(`/api/feedback?barberId=${barberId}`)
      if (!feedbackResponse.ok) throw new Error("Failed to fetch feedback")
      const feedbackData = await feedbackResponse.json()
      setFeedback(feedbackData)
    } catch (err) {
      console.error("Error fetching feedback:", err)
      setError("Failed to load feedback data")
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-raleway font-semibold mb-2">Dashboard</h1>

      {barbers.length > 0 ? (
        <>
          <div className="mb-8">
            <label htmlFor="barber-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select Barber:
            </label>
            <select
              id="barber-select"
              value={selectedBarberId || ""}
              onChange={(e) => handleBarberChange(e.target.value)}
              className="block w-full max-w-md rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              {barbers.map((barber) => (
                <option key={barber.id} value={barber.id}>
                  {barber.name} - {barber.shop_name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-8">{selectedBarberId && <DashboardTable feedback={feedback} />}</div>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Barbers Found</CardTitle>
            <CardDescription>No barbers have been added to the system yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please add barbers to your Airtable "Barbers" table to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
