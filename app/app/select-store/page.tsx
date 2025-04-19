import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getStoresByBarberEmail } from "@/lib/airtable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Store } from "lucide-react"

export default async function SelectStorePage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const stores = await getStoresByBarberEmail(session.email)


  if (stores.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>No Stores Found</CardTitle>
            <CardDescription>You don't have any stores assigned to your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              Please contact your administrator to assign stores to your account.
            </p>
            <form action="/api/logout" method="POST">
              <Button type="submit" variant="outline" className="w-full">
                Sign Out
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Select a Store</CardTitle>
          <CardDescription>Choose a store to manage feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {stores.map((store) => (
              <Link key={store.id} href={`/app/${store.slug}/feedback`} className="block">
                <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                  <div className="flex items-center gap-3">
                    {store.logo ? (
                      <img src={store.logo || "/placeholder.svg"} alt={store.name} className="w-8 h-8 object-contain" />
                    ) : (
                      <Store className="w-5 h-5" />
                    )}
                    <div>
                      <div className="font-medium">{store.name}</div>
                    </div>
                  </div>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
