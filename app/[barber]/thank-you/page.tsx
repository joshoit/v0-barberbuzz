import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeProvider } from "@/components/theme-provider"
import { CheckCircle } from "lucide-react"
import { getBarberBySlug, getStoresByBarberId } from "@/lib/airtable"

interface ThankYouPageProps {
  params: {
    barber: string
  }
}

// Dynamic metadata
export async function generateMetadata({ params }: ThankYouPageProps): Promise<Metadata> {
  const barber = await getBarberBySlug(params.barber)

  if (!barber) {
    return {
      title: "Thank You",
    }
  }

  return {
    title: `Thank You - ${barber.shop_name}`,
    description: `Thank you for your feedback for ${barber.name} at ${barber.shop_name}`,
  }
}

export default async function ThankYouPage({ params }: ThankYouPageProps) {
  const barber = await getBarberBySlug(params.barber)

  if (!barber) {
    notFound()
  }

  // Get the store for this barber
  const stores = await getStoresByBarberId(barber.id)
  const store = stores.length > 0 ? stores[0] : null

  return (
    <ThemeProvider store={store}>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-raleway">Thank You!</CardTitle>
            <CardDescription>Your feedback for {barber.name} has been submitted successfully</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="text-center mb-6 text-gray-600">
              We appreciate you taking the time to share your experience.
            </p>
            <Link href={`/${params.barber}`}>
              <Button variant="outline">Back to Form</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  )
}
