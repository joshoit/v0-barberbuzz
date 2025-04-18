import { redirect, notFound } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getStoreBySlug, getStoresByBarberId } from "@/lib/airtable"
import { FeedbackForm } from "@/components/feedback-form"
import { ThemeProvider } from "@/components/theme-provider"
import { StoreSelector } from "@/components/store-selector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { BarChart2 } from "lucide-react"

export default async function StoreFeedbackPage({
  params,
}: {
  params: { storeSlug: string }
}) {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const store = await getStoreBySlug(params.storeSlug)

  if (!store) {
    notFound()
  }

  // Verify that this barber has access to this store
  const barberStores = await getStoresByBarberId(session.id)
  const hasAccess = barberStores.some((s) => s.id === store.id)

  if (!hasAccess) {
    redirect("/app/select-store")
  }

  return (
    <ThemeProvider store={store}>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {store.logo ? (
                <img src={store.logo || "/placeholder.svg"} alt={store.name} className="w-10 h-10 object-contain" />
              ) : null}
              <h1 className="text-xl font-semibold">{store.name}</h1>
            </div>

            <div className="flex items-center gap-4">
              {barberStores.length > 1 && (
                <StoreSelector stores={barberStores} currentStoreSlug={params.storeSlug} baseUrl="/app" />
              )}

              <Link href={`/app/${params.storeSlug}/dashboard`}>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4" />
                  <span>Dashboard</span>
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Thank you for visiting {store.name}!</CardTitle>
            </CardHeader>
            <CardContent>
              <FeedbackForm store={store} />
            </CardContent>
          </Card>
        </main>
      </div>
    </ThemeProvider>
  )
}
