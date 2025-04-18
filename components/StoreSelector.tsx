"use client"
import { useRouter } from "next/navigation"
import type { Store } from "@/lib/airtable"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { absoluteUrl } from "@/lib/utils"

interface StoreSelectorProps {
  stores: Store[]
  currentStoreSlug?: string
  baseUrl: string
}

export function StoreSelector({ stores, currentStoreSlug, baseUrl }: StoreSelectorProps) {
  const router = useRouter()

  const handleStoreChange = (storeSlug: string) => {
    router.push(absoluteUrl(`${baseUrl}/${storeSlug}`))
  }

  return (
    <div className="flex items-center">
      <Select value={currentStoreSlug} onValueChange={handleStoreChange}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a store" />
        </SelectTrigger>
        <SelectContent>
          {stores.map((store) => (
            <SelectItem key={store.id} value={store.slug}>
              {store.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
