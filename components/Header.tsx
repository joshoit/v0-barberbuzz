import Link from "next/link"
import { Button } from "@/components/ui/button"

export async function Header() {
  // Simple check for dashboard access - no real auth for now
  const isLoggedIn = false

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="font-semibold text-xl">BarberBuzz</div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/about" className="text-sm font-medium hover:text-primary">
            About
          </Link>
          <Link href="/pricing" className="text-sm font-medium hover:text-primary">
            Pricing
          </Link>
          <Link href="/contact" className="text-sm font-medium hover:text-primary">
            Contact
          </Link>

          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <Link href="/dashboard">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </nav>

        <div className="md:hidden">{/* Mobile menu button would go here */}</div>
      </div>
    </header>
  )
}
