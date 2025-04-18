import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { FeedbackForm } from "@/components/feedback-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ThemeProvider } from "@/components/theme-provider"
import { getBarberBySlug, getAllBarberSlugs, getStoresByBarberId } from "@/lib/airtable"

interface BarberPageProps {
  params: {
    barber: string
  }
}

// Generate static params for all barbers
export async function generateStaticParams() {
  const slugs = await getAllBarberSlugs()

  return slugs.map((slug) => ({
    barber: slug,
  }))
}

// Dynamic metadata
export async function generateMetadata({ params }: BarberPageProps): Promise<Metadata> {
  const barber = await getBarberBySlug(params.barber)

  if (!barber) {
    return {
      title: "Barber Not Found",
    }
  }

  return {
    title: `${barber.name} at ${barber.shop_name} - Feedback Form`,
    description: `Share your experience with ${barber.name} at ${barber.shop_name}`,
  }
}

export default async function BarberPage({ params }: BarberPageProps) {
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
            {store?.logo && (
              <div className="mx-auto mb-4 h-16 w-16 overflow-hidden">
                <img
                  src={store.logo || "/placeholder.svg"}
                  alt={`${barber.shop_name} logo`}
                  className="h-full w-full object-contain"
                />
              </div>
            )}
            <CardTitle className="text-2xl font-raleway">{barber.shop_name}</CardTitle>
            <CardDescription>Share your experience with {barber.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <FeedbackForm store={store} barber={barber} />
          </CardContent>
        </Card>
      </div>
    </ThemeProvider>
  )
}
