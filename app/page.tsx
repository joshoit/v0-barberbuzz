import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Scissors } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
            <Scissors className="h-6 w-6 text-gray-600" />
          </div>
          <CardTitle className="text-2xl">BarberBuzz</CardTitle>
          <CardDescription>Share your experience with our barbers</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Link href="/feedback" className="w-full">
            <Button className="w-full">Leave Feedback</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
