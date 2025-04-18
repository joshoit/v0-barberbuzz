import { z } from "zod"
import { base } from "./airtableClient"

// Define types for our data model
export interface Barber {
  id: string
  name: string
  email: string
  passwordHash: string
  isAdmin: boolean
  shop_name: string
  stores?: string[]
  createdAt?: string
}

export interface Store {
  id: string
  name: string
  slug: string
  logo?: string
  primaryColor: string
  accentColor: string
  barber: string
}

export interface Feedback {
  id: string
  store: string
  customerName: string
  rating: number
  visitAgain: "Yes" | "Maybe" | "No"
  contact?: string
  optIn: boolean
  comments?: string
  privateNote?: string
  createdTime: string
}

export const feedbackSchema = z.object({
  store: z.string(),
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  rating: z.number().min(1, "Please select a rating").max(5),
  visitAgain: z.enum(["Yes", "Maybe", "No"], {
    required_error: "Please select if you would visit again",
  }),
  contact: z.string().optional(),
  optIn: z.boolean().default(false),
  comments: z.string().optional(),
})

export type FeedbackInput = z.infer<typeof feedbackSchema>

export async function getBarbers(): Promise<Barber[]> {
  try {
    const records = await base("Barbers").select().all()
    return records.map((record) => ({
      id: record.id,
      name: record.fields.Name as string,
      email: record.fields.Email as string,
      passwordHash: record.fields.PasswordHash as string,
      isAdmin: record.fields.isAdmin as boolean,
      shop_name: record.fields.ShopName as string,
      createdAt: (record.fields.CreatedAt as string) || new Date().toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching barbers:", error)
    return []
  }
}

export async function getBarberBySlug(slug: string): Promise<Barber | null> {
  try {
    const records = await base("Barbers")
      .select({ filterByFormula: `{Slug} = "${slug}"` })
      .firstPage()

    if (records.length === 0) return null

    return {
      id: records[0].id,
      name: records[0].fields.Name as string,
      email: records[0].fields.Email as string,
      passwordHash: records[0].fields.PasswordHash as string,
      isAdmin: records[0].fields.isAdmin as boolean,
      shop_name: records[0].fields.ShopName as string,
      createdAt: (records[0].fields.CreatedAt as string) || new Date().toISOString(),
    }
  } catch (error) {
    console.error(`Error fetching barber with slug ${slug}:`, error)
    return null
  }
}

export async function getFeedbackForBarber(barberId: string): Promise<Feedback[]> {
  try {
    const records = await base("Feedback")
      .select({
        filterByFormula: `{barber_id}='${barberId}'`,
        sort: [{ field: "created_at", direction: "desc" }],
      })
      .all()

    return records.map((record) => ({
      id: record.id,
      store: record.fields.Store as string,
      customerName: record.fields.CustomerName as string,
      rating: record.fields.Rating as number,
      visitAgain: record.fields.VisitAgain as "Yes" | "Maybe" | "No",
      contact: record.fields.Contact as string,
      optIn: record.fields.OptIn as boolean,
      comments: record.fields.Comments as string,
      privateNote: record.fields.PrivateNote as string,
      createdTime: record.fields.CreatedTime as string,
    }))
  } catch (error) {
    console.error(`Error fetching feedback for barber ${barberId}:`, error)
    return []
  }
}

export async function getAllBarberSlugs(): Promise<string[]> {
  try {
    const barbers = await getBarbers()
    return barbers.map((barber) => barber.shop_name || "")
  } catch (error) {
    console.error("Error fetching barber slugs:", error)
    return []
  }
}

export async function getBarberByEmail(email: string): Promise<Barber | null> {
  try {
    const records = await base("Barbers")
      .select({ filterByFormula: `{Email}='${email}'` })
      .firstPage()

    if (records.length === 0) return null

    return {
      id: records[0].id,
      name: records[0].fields.Name as string,
      email: records[0].fields.Email as string,
      passwordHash: records[0].fields.PasswordHash as string,
      isAdmin: !!records[0].fields.isAdmin,
      shop_name: records[0].fields.ShopName as string,
      createdAt: (records[0].fields.CreatedAt as string) || new Date().toISOString(),
    }
  } catch (error) {
    console.error(`Error fetching barber with email ${email}:`, error)
    throw error
  }
}

export async function createBarber(data: {
  name: string
  email: string
  passwordHash: string
  isAdmin: boolean
  shop_name: string
}): Promise<Barber | null> {
  try {
    const record = await base("Barbers").create({
      Name: data.name,
      Email: data.email,
      PasswordHash: data.passwordHash,
      isAdmin: data.isAdmin,
      ShopName: data.shop_name,
    })

    return {
      id: record.id,
      name: record.fields.Name as string,
      email: record.fields.Email as string,
      passwordHash: record.fields.PasswordHash as string,
      isAdmin: record.fields.isAdmin as boolean,
      shop_name: record.fields.ShopName as string,
    }
  } catch (error) {
    console.error("Error creating barber:", error)
    return null
  }
}
