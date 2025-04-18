import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getAllBarbers, getAllStores, getAllFeedback } from "@/lib/airtable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { UserPlus, Store, Download } from "lucide-react"

export default async function AdminDashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  if (!session.isAdmin) {
    redirect("/app")
  }

  // Get all data for admin dashboard
  const barbers = await getAllBarbers()
  const stores = await getAllStores()
  const feedback = await getAllFeedback()

  // Calculate analytics
  const totalFeedback = feedback.length
  const averageRating = totalFeedback > 0 ? feedback.reduce((sum, item) => sum + item.rating, 0) / totalFeedback : 0
  const optInCount = feedback.filter((item) => item.optIn).length
  const optInPercentage = totalFeedback > 0 ? (optInCount / totalFeedback) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-semibold">BarberBuzz Admin</h1>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/admin/new-barber">
              <Button size="sm" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                <span>New Barber</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalFeedback}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Opt-In Count</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{optInCount}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Opt-In Percentage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{optInPercentage.toFixed(1)}%</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="feedback">
          <TabsList className="mb-4">
            <TabsTrigger value="feedback">All Feedback</TabsTrigger>
            <TabsTrigger value="barbers">Barbers</TabsTrigger>
            <TabsTrigger value="stores">Stores</TabsTrigger>
          </TabsList>

          <TabsContent value="feedback">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Feedback</CardTitle>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </Button>
              </CardHeader>
              <CardContent>
                {/* We'd need to adapt DashboardTable for admin view with store column */}
                <p className="text-center py-6 text-muted-foreground">
                  Feedback table would be displayed here with store column
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="barbers">
            <Card>
              <CardHeader>
                <CardTitle>Barbers</CardTitle>
                <CardDescription>Manage barber accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Stores</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {barbers.map((barber) => (
                        <tr key={barber.id} className="border-b">
                          <td className="py-3 px-4">{barber.name}</td>
                          <td className="py-3 px-4">{barber.email}</td>
                          <td className="py-3 px-4">
                            {/* We'd need to fetch stores for each barber */}
                            <span className="text-gray-500">Stores count would go here</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                Edit
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-500">
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stores">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Stores</CardTitle>
                  <CardDescription>Manage store locations</CardDescription>
                </div>
                <Button size="sm" className="flex items-center gap-2">
                  <Store className="w-4 h-4" />
                  <span>New Store</span>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">Slug</th>
                        <th className="text-left py-3 px-4">Barber</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stores.map((store) => (
                        <tr key={store.id} className="border-b">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              {store.logo ? (
                                <img
                                  src={store.logo || "/placeholder.svg"}
                                  alt={store.name}
                                  className="w-6 h-6 object-contain"
                                />
                              ) : null}
                              {store.name}
                            </div>
                          </td>
                          <td className="py-3 px-4">{store.slug}</td>
                          <td className="py-3 px-4">
                            {/* We'd need to fetch barber name */}
                            <span className="text-gray-500">Barber name would go here</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                Edit
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-500">
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
