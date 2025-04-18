export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      barbers: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string
          shop_name: string
          primary_color: string
          accent_color: string
          logo_url: string | null
          phone: string | null
          slug: string
        }
        Insert: {
          id: string
          created_at?: string
          email: string
          name: string
          shop_name: string
          primary_color?: string
          accent_color?: string
          logo_url?: string | null
          phone?: string | null
          slug: string
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string
          shop_name?: string
          primary_color?: string
          accent_color?: string
          logo_url?: string | null
          phone?: string | null
          slug?: string
        }
      }
      feedback: {
        Row: {
          id: string
          created_at: string
          barber_id: string
          customer_name: string
          rating: number
          visit_again: string
          contact: string
          comments: string | null
          opt_in: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          barber_id: string
          customer_name: string
          rating: number
          visit_again: string
          contact: string
          comments?: string | null
          opt_in: boolean
        }
        Update: {
          id?: string
          created_at?: string
          barber_id?: string
          customer_name?: string
          rating?: number
          visit_again?: string
          contact?: string
          comments?: string | null
          opt_in?: boolean
        }
      }
    }
  }
}
