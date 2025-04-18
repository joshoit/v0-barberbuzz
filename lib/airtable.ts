import Airtable from "airtable"
import { z } from "zod"

// Initialize Airtable client
const token = process.env.AIRTABLE_TOKEN
const baseId = process.env.AIRTABLE_BASE_ID

if (!token || !baseId) {
  console.error("Missing Airtable configuration: AIRTABLE_TOKEN or AIRTABLE_BASE_ID")
  throw new Error("Missing required environment variables: AIRTABLE_TOKEN or AIRTABLE_BASE_ID")
}

// Create the Airtable instance with the token
const base = new Airtable({ apiKey: token }).base(baseId)

// Define types for our data model
export interface Barber {
  id: string
  name: string
  email: string
  passwordHash: string
  isAdmin: boolean
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

// Zod schema for feedback validation
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

/**
 * Get all barbers from Airtable
 * @returns {Promise<Array>} Array of barber records
 */
export async function getBarbers() {
  try {
    const records = await base("Barbers").select().all()
    return records.map((record) => ({
      id: record.id,
      ...record.fields,
      // Ensure created_at exists
      created_at: record.fields.created_at || new Date().toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching barbers:", error)
    return []
  }
}

/**
 * Get a barber by slug
 * @param {string} slug - The barber's slug
 * @returns {Promise<Object|null>} Barber record or null
 */
export async function getBarberBySlug(slug: string) {
  try {
    const records = await base("Barbers")
      .select({
        filterByFormula: `{Slug} = "${slug}"`,
      })
      .firstPage()

    if (records.length === 0) {
      return null
    }

    return {
      id: records[0].id,
      ...records[0].fields,
      // Ensure created_at exists
      created_at: records[0].fields.created_at || new Date().toISOString(),
    }
  } catch (error) {
    console.error(`Error fetching barber with slug ${slug}:`, error)
    return null
  }
}

/**
 * Get feedback for a specific barber
 * @param {string} barberId - The barber's ID
 * @returns {Promise<Array>} Array of feedback records
 */
export async function getFeedbackForBarber(barberId) {
  try {
    const records = await base("Feedback")
      .select({
        filterByFormula: `{barber_id}='${barberId}'`,
        sort: [{ field: "created_at", direction: "desc" }],
      })
      .all()

    return records.map((record) => ({
      id: record.id,
      ...record.fields,
    }))
  } catch (error) {
    console.error(`Error fetching feedback for barber ${barberId}:`, error)
    return []
  }
}

/**
 * Get all barber slugs for static path generation
 * @returns {Promise<Array<string>>} Array of barber slugs
 */
export async function getAllBarberSlugs() {
  try {
    const barbers = await getBarbers()
    return barbers.map((barber) => barber.slug || "")
  } catch (error) {
    console.error("Error fetching barber slugs:", error)
    return []
  }
}

/**
 * Get a barber by email
 * @param {string} email - The barber's email
 * @returns {Promise<Barber|null>} Barber record or null
 */
export async function getBarberByEmail(email: string): Promise<Barber | null> {
  try {
    console.log(`Fetching barber with email: ${email}`)

    const records = await base("Barbers")
      .select({
        filterByFormula: `{Email}='${email}'`,
      })
      .firstPage()

    if (records.length === 0) {
      console.log("No barber found with this email")
      return null
    }

    // Log the fields to help debug
    console.log("Barber record fields:", records[0].fields)

    return {
      id: records[0].id,
      name: records[0].fields.Name as string,
      email: records[0].fields.Email as string,
      passwordHash: records[0].fields.PasswordHash as string,
      isAdmin: !!records[0].fields.isAdmin, // Ensure boolean conversion
      createdAt: (records[0].fields.createdAt as string) || new Date().toISOString(),
    }
  } catch (error) {
    console.error(`Error fetching barber with email ${email}:`, error)
    throw error // Re-throw to allow proper error handling upstream
  }
}

/**
 * Get stores by barber ID
 * @param {string} barberId - The barber's ID
 * @returns {Promise<Store[]>} Array of store records
 */
export async function getStoresByBarberId(barberId: string): Promise<Store[]> {
  try {
    const records = await base("Stores")
      .select({
        filterByFormula: `{Barber}='${barberId}'`,
      })
      .all()

    return records.map((record) => ({
      id: record.id,
      name: record.fields.Name as string,
      slug: record.fields.Slug as string,
      logo: record.fields.Logo ? (record.fields.Logo as any)[0].url : undefined,
      primaryColor: (record.fields.PrimaryColor as string) || "#0057D9",
      accentColor: (record.fields.AccentColor as string) || "#FFD339",
      barber: record.fields.Barber as string,
    }))
  } catch (error) {
    console.error(`Error fetching stores for barber ${barberId}:`, error)
    return []
  }
}

/**
 * Get a store by slug
 * @param {string} slug - The store's slug
 * @returns {Promise<Store|null>} Store record or null
 */
export async function getStoreBySlug(slug: string): Promise<Store | null> {
  try {
    const records = await base("Stores")
      .select({
        filterByFormula: `{Slug}='${slug}'`,
      })
      .firstPage()

    if (records.length === 0) {
      return null
    }

    return {
      id: records[0].id,
      name: records[0].fields.Name as string,
      slug: records[0].fields.Slug as string,
      logo: records[0].fields.Logo ? (records[0].fields.Logo as any)[0].url : undefined,
      primaryColor: (records[0].fields.PrimaryColor as string) || "#0057D9",
      accentColor: (records[0].fields.AccentColor as string) || "#FFD339",
      barber: records[0].fields.Barber as string,
    }
  } catch (error) {
    console.error(`Error fetching store with slug ${slug}:`, error)
    return null
  }
}

/**
 * Get feedback by store ID
 * @param {string} storeId - The store's ID
 * @returns {Promise<Feedback[]>} Array of feedback records
 */
export async function getFeedbackByStoreId(storeId: string): Promise<Feedback[]> {
  try {
    const records = await base("Feedback")
      .select({
        filterByFormula: `{Store}='${storeId}'`,
        sort: [{ field: "CreatedTime", direction: "desc" }],
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
      createdTime: (record.fields.CreatedTime as string) || new Date().toISOString(),
    }))
  } catch (error) {
    console.error(`Error fetching feedback for store ${storeId}:`, error)
    return []
  }
}

/**
 * Create feedback in Airtable
 * @param {FeedbackInput} data - Feedback data
 * @returns {Promise<Feedback|null>} Created feedback record or null
 */
export async function createFeedback(data: FeedbackInput): Promise<Feedback | null> {
  try {
    const record = await base("Feedback").create({
      Store: [data.store],
      CustomerName: data.customerName,
      Rating: data.rating,
      VisitAgain: data.visitAgain,
      Contact: data.contact || "",
      OptIn: data.optIn,
      Comments: data.comments || "",
    })

    return {
      id: record.id,
      store: record.fields.Store as string,
      customerName: record.fields.CustomerName as string,
      rating: record.fields.Rating as number,
      visitAgain: record.fields.VisitAgain as "Yes" | "Maybe" | "No",
      contact: record.fields.Contact as string,
      optIn: record.fields.OptIn as boolean,
      comments: record.fields.Comments as string,
      privateNote: record.fields.PrivateNote as string,
      createdTime: (record.fields.CreatedTime as string) || new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error creating feedback:", error)
    return null
  }
}

/**
 * Update feedback note
 * @param {string} feedbackId - Feedback ID
 * @param {string} note - Note text
 * @returns {Promise<boolean>} Success status
 */
export async function updateFeedbackNote(feedbackId: string, note: string): Promise<boolean> {
  try {
    await base("Feedback").update(feedbackId, {
      PrivateNote: note,
    })
    return true
  } catch (error) {
    console.error(`Error updating note for feedback ${feedbackId}:`, error)
    return false
  }
}

/**
 * Create a new barber
 * @param {Object} data - Barber data
 * @returns {Promise<Barber|null>} Created barber record or null
 */
export async function createBarber(data: {
  name: string
  email: string
  passwordHash: string
  isAdmin: boolean
}): Promise<Barber | null> {
  try {
    const record = await base("Barbers").create({
      Name: data.name,
      Email: data.email,
      PasswordHash: data.passwordHash,
      isAdmin: data.isAdmin,
    })

    return {
      id: record.id,
      name: record.fields.Name as string,
      email: record.fields.Email as string,
      passwordHash: record.fields.PasswordHash as string,
      isAdmin: record.fields.isAdmin as boolean,
    }
  } catch (error) {
    console.error("Error creating barber:", error)
    return null
  }
}

/**
 * Create a new store
 * @param {Object} data - Store data
 * @returns {Promise<Store|null>} Created store record or null
 */
export async function createStore(data: {
  name: string
  slug: string
  primaryColor: string
  accentColor: string
  barber: string
}): Promise<Store | null> {
  try {
    const record = await base("Stores").create({
      Name: data.name,
      Slug: data.slug,
      PrimaryColor: data.primaryColor,
      AccentColor: data.accentColor,
      Barber: [data.barber],
    })

    return {
      id: record.id,
      name: record.fields.Name as string,
      slug: record.fields.Slug as string,
      primaryColor: record.fields.PrimaryColor as string,
      accentColor: record.fields.AccentColor as string,
      barber: record.fields.Barber as string,
    }
  } catch (error) {
    console.error("Error creating store:", error)
    return null
  }
}

/**
 * Get all barbers
 * @returns {Promise<Barber[]>} Array of barber records
 */
export async function getAllBarbers(): Promise<Barber[]> {
  try {
    const records = await base("Barbers").select().all()

    return records.map((record) => ({
      id: record.id,
      name: record.fields.Name as string,
      email: record.fields.Email as string,
      passwordHash: record.fields.PasswordHash as string,
      isAdmin: record.fields.isAdmin as boolean,
    }))
  } catch (error) {
    console.error("Error fetching all barbers:", error)
    return []
  }
}

/**
 * Get all stores
 * @returns {Promise<Store[]>} Array of store records
 */
export async function getAllStores(): Promise<Store[]> {
  try {
    const records = await base("Stores").select().all()

    return records.map((record) => ({
      id: record.id,
      name: record.fields.Name as string,
      slug: record.fields.Slug as string,
      logo: record.fields.Logo ? (record.fields.Logo as any)[0].url : undefined,
      primaryColor: (record.fields.PrimaryColor as string) || "#0057D9",
      accentColor: (record.fields.AccentColor as string) || "#FFD339",
      barber: record.fields.Barber as string,
    }))
  } catch (error) {
    console.error("Error fetching all stores:", error)
    return []
  }
}

/**
 * Get all feedback
 * @returns {Promise<Feedback[]>} Array of feedback records
 */
export async function getAllFeedback(): Promise<Feedback[]> {
  try {
    const records = await base("Feedback").select().all()

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
      createdTime: (record.fields.CreatedTime as string) || new Date().toISOString(),
    }))
  } catch (error) {
    console.error("Error fetching all feedback:", error)
    return []
  }
}
