import { z } from "zod"
import { base } from "./airtableClient"

// ----------------------
// TYPE DEFINITIONS
// ----------------------

// Represents a barber profile
export interface Barber {
  id: string
  name: string
  email: string
  passwordHash: string
  isAdmin: boolean
  shop_name: string
  stores?: string[] // Optional linked store IDs
  createdAt?: string
}

// Represents a store/barbershop location
export interface Store {
  id: string
  name: string
  slug: string
  logo?: string
  primaryColor: string
  accentColor: string
  barber: string
}

// Represents customer feedback for a store
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

// ----------------------
// FEEDBACK SCHEMA VALIDATION
// ----------------------

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

// ----------------------
// BARBER FUNCTIONS
// ----------------------

// Fetch all barbers
export async function getBarbers(): Promise<Barber[]> {
  try {
    const records = await base("Barbers").select().all()
    return records.map((rec) => ({
      id: rec.id,
      name: rec.fields.Name as string,
      email: rec.fields.Email as string,
      passwordHash: rec.fields.PasswordHash as string,
      isAdmin: rec.fields.isAdmin as boolean,
      shop_name: rec.fields.Slug as string,
      createdAt: (rec.fields.CreatedAt as string) || new Date().toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching barbers:", error)
    return []
  }
}

// Fetch a specific barber by slug (used in URLs)
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
      shop_name: records[0].fields.Slug as string,
      createdAt: (records[0].fields.CreatedAt as string) || new Date().toISOString(),
    }
  } catch (error) {
    console.error(`Error fetching barber with slug ${slug}:`, error)
    return null
  }
}

// Fetch a specific barber by email (used during login)
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
      shop_name: records[0].fields.Slug as string,
      createdAt: (records[0].fields.CreatedAt as string) || new Date().toISOString(),
    }
  } catch (error) {
    console.error(`Error fetching barber with email ${email}:`, error)
    throw error
  }
}

// Create a new barber record in Airtable
export async function createBarber(data: {
  name: string
  email: string
  passwordHash: string
  isAdmin: boolean
  shop_name: string
}): Promise<Barber | null> {
  try {
    const createdRecord = await base("Barbers").create([
      {
        fields: {
          Name: data.name,
          Email: data.email,
          PasswordHash: data.passwordHash,
          isAdmin: data.isAdmin,
          Slug: data.shop_name.toLowerCase().replace(/\s+/g, "-"), // safe slug
        },
      },
    ])

    return {
      id: createdRecord[0].id,
      name: createdRecord[0].fields.Name as string,
      email: createdRecord[0].fields.Email as string,
      passwordHash: createdRecord[0].fields.PasswordHash as string,
      isAdmin: createdRecord[0].fields.isAdmin as boolean,
      shop_name: createdRecord[0].fields.Slug as string,
    }
  } catch (error) {
    console.error("Error creating barber:", error)
    return null
  }
}

// Return all available barber slugs
export async function getAllBarberSlugs(): Promise<string[]> {
  try {
    const barbers = await getBarbers()
    return barbers.map((barber) => barber.shop_name || "")
  } catch (error) {
    console.error("Error fetching barber slugs:", error)
    return []
  }
}

// ----------------------
// FEEDBACK FUNCTIONS
// ----------------------

// Fetch all feedback associated with a barber (by ID)
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

// ----------------------
// STORE FUNCTIONS
// ----------------------

// Fetch stores linked to a barber by ID using linked field logic
export async function getStoresByBarberId(barberId: string): Promise<Store[]> {
  try {
    const records = await base("Stores")
      .select({
        // ARRAYJOIN is used to search across linked record array
        filterByFormula: `FIND("${barberId}", ARRAYJOIN(Barber))`,
      })
      .all()

    return records.map((record) => ({
      id: record.id,
      name: record.fields["Name"] as string,
      slug: record.fields["Slug"] as string,
      primaryColor: record.fields["Primary Color"] as string,
      accentColor: record.fields["Accent Color"] as string,
      logo: (record.fields["Logo"] as any)?.[0]?.url ?? "", // use first image
      barber: "", // optional: link back barber if needed
    }))
  } catch (error) {
    console.error("Error fetching stores by barber ID:", error)
    throw new Error("Failed to fetch stores for barber.")
  }
}
