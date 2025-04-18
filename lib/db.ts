// This is a stub file to satisfy imports while we migrate from Supabase to Airtable
// It provides empty implementations of previously used functions

// Create a dummy supabase client that does nothing
export const supabase = {
  auth: {
    signInWithPassword: async () => ({ error: new Error("Supabase auth is not implemented") }),
    signUp: async () => ({ error: new Error("Supabase auth is not implemented") }),
    resetPasswordForEmail: async () => ({ error: new Error("Supabase auth is not implemented") }),
    getSession: async () => ({ data: { session: null } }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => null,
        order: () => ({
          all: async () => [],
        }),
      }),
      order: () => ({
        all: async () => [],
      }),
      all: async () => [],
      firstPage: async () => [],
    }),
    insert: () => ({
      select: () => ({
        single: async () => null,
      }),
    }),
  }),
}

// Define types that might be used elsewhere
export type Barber = {
  id: string
  created_at: string
  email: string
  name: string
  shop_name: string
  primary_color: string
  accent_color: string
  logo_url?: string
  phone?: string
  slug: string
}

export type Feedback = {
  id: string
  created_at: string
  barber_id: string
  customer_name: string
  rating: number
  visit_again: "yes" | "maybe" | "no"
  contact: string
  comments?: string
  opt_in: boolean
}

// Stub functions that return empty data
export async function getBarberBySlug(slug: string): Promise<Barber | null> {
  console.warn("getBarberBySlug is using the stub implementation. Please use lib/airtable.js instead.")
  return null
}

export async function getBarberById(id: string): Promise<Barber | null> {
  console.warn("getBarberById is using the stub implementation. Please use lib/airtable.js instead.")
  return null
}

export async function getFeedbackForBarber(barberId: string): Promise<Feedback[]> {
  console.warn("getFeedbackForBarber is using the stub implementation. Please use lib/airtable.js instead.")
  return []
}

export async function createFeedback(feedback: Omit<Feedback, "id" | "created_at">): Promise<Feedback | null> {
  console.warn("createFeedback is using the stub implementation. Please use lib/airtable.js instead.")
  return null
}

export async function getAllBarberSlugs(): Promise<string[]> {
  console.warn("getAllBarberSlugs is using the stub implementation. Please use lib/airtable.js instead.")
  return []
}
