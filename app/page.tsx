import Link from "next/link"                          // Next.js routing for navigation
import { Button } from "@/components/ui/button"       // Reusable styled Button component
import { Scissors } from "lucide-react"               // Icon used for branding

// Main landing page component for BarberBuzz
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      
      {/* --- Header Section --- */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          
          {/* Brand logo + name */}
          <div className="flex items-center gap-2">
            <Scissors className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">BarberBuzz</span>
          </div>

          {/* Sign In button aligned to right */}
          <div>
            <Link href="/login">
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* --- Hero/Main Section --- */}
      <main className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="container mx-auto px-4 py-16 text-center">

          {/* Circle icon background */}
          <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <Scissors className="h-12 w-12 text-primary" />
          </div>

          {/* Heading and description */}
          <h1 className="text-4xl font-bold mb-4">BarberBuzz</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            The multi-tenant feedback and marketing platform designed specifically for barbershops.
          </p>

          {/* CTA button to go to Sign Up page */}
          <Link href="/signup">
            <Button size="lg" className="px-8">
              Get Started
            </Button>
          </Link>
        </div>
      </main>

      {/* --- Footer Section --- */}
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} BarberBuzz. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
