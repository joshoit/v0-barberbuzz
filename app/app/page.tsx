import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { getStoresByBarberEmail } from "@/lib/airtable"


// Main entry point for the /app route
export default async function BarberAppPage() {
  // Retrieve session info from cookie (or headers in SSR)
  const session = await getSession()

  // If no valid session, redirect to login page
  if (!session) {
    redirect("/login")
  }

  // Fetch stores linked to this barber
  const stores = await getStoresByBarberEmail(session.email)


  // If the barber has only one store, redirect to that store’s feedback page
  if (stores.length === 1) {
    redirect(`/app/${stores[0].slug}/feedback`)
  }

  // If multiple stores, redirect to store selection page
  redirect("/app/select-store")
}
