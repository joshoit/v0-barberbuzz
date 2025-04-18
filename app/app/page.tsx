import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getStoresByBarberId } from "@/lib/airtable"

export default async function BarberAppPage() {
  const session = await getSession()

  if (!session) {
    redirect("/login")
  }

  const stores = await getStoresByBarberId(session.id)

  // If barber has only one store, redirect directly to that store's feedback page
  if (stores.length === 1) {
    redirect(`/app/${stores[0].slug}/feedback`)
  }

  // If barber has multiple stores, redirect to store selection page
  redirect("/app/select-store")
}
