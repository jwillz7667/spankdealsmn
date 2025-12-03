export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      carts: {
        Row: {
          id: string
          user_id: string
          product_id: string
          quantity: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          quantity: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          quantity?: number
          created_at?: string
          updated_at?: string
        }
      }
      delivery_zones: {
        Row: {
          id: string
          name: string
          suburbs: string[]
          delivery_fee: number
          min_order: number
          estimated_minutes: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          suburbs: string[]
          delivery_fee?: number
          min_order?: number
          estimated_minutes?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          suburbs?: string[]
          delivery_fee?: number
          min_order?: number
          estimated_minutes?: number
          is_active?: boolean
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price_at_purchase: number
          product_title: string
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price_at_purchase: number
          product_title: string
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price_at_purchase?: number
          product_title?: string
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          status: Database['public']['Enums']['order_status']
          subtotal: number
          tax: number
          delivery_fee: number
          tip: number
          total: number
          delivery_address: Json
          delivery_slot: string
          delivery_instructions: string | null
          driver_id: string | null
          cova_order_id: string | null
          stripe_payment_intent_id: string | null
          created_at: string
          updated_at: string
          profiles?: {
            full_name: string | null
            email: string | null
            phone: string | null
          }
        }
        Insert: {
          id?: string
          user_id: string
          status?: Database['public']['Enums']['order_status']
          subtotal: number
          tax: number
          delivery_fee?: number
          tip?: number
          total: number
          delivery_address: Json
          delivery_slot: string
          delivery_instructions?: string | null
          driver_id?: string | null
          cova_order_id?: string | null
          stripe_payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          status?: Database['public']['Enums']['order_status']
          subtotal?: number
          tax?: number
          delivery_fee?: number
          tip?: number
          total?: number
          delivery_address?: Json
          delivery_slot?: string
          delivery_instructions?: string | null
          driver_id?: string | null
          cova_order_id?: string | null
          stripe_payment_intent_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          title: string
          description: string | null
          category: Database['public']['Enums']['product_category']
          strain_type: Database['public']['Enums']['strain_type'] | null
          thc_potency: number | null
          cbd_potency: number | null
          price: number
          compare_at_price: number | null
          stock: number
          batch_lot: string | null
          images: string[]
          weight_grams: number | null
          is_active: boolean
          is_featured: boolean
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category: Database['public']['Enums']['product_category']
          strain_type?: Database['public']['Enums']['strain_type'] | null
          thc_potency?: number | null
          cbd_potency?: number | null
          price: number
          compare_at_price?: number | null
          stock?: number
          batch_lot?: string | null
          images?: string[]
          weight_grams?: number | null
          is_active?: boolean
          is_featured?: boolean
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: Database['public']['Enums']['product_category']
          strain_type?: Database['public']['Enums']['strain_type'] | null
          thc_potency?: number | null
          cbd_potency?: number | null
          price?: number
          compare_at_price?: number | null
          stock?: number
          batch_lot?: string | null
          images?: string[]
          weight_grams?: number | null
          is_active?: boolean
          is_featured?: boolean
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          address: Json | null
          phone: string | null
          age_verified: boolean
          loyalty_points: number
          role: Database['public']['Enums']['user_role']
          notification_email: boolean
          notification_sms: boolean
          marketing_emails: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          address?: Json | null
          phone?: string | null
          age_verified?: boolean
          loyalty_points?: number
          role?: Database['public']['Enums']['user_role']
          notification_email?: boolean
          notification_sms?: boolean
          marketing_emails?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          address?: Json | null
          phone?: string | null
          age_verified?: boolean
          loyalty_points?: number
          role?: Database['public']['Enums']['user_role']
          notification_email?: boolean
          notification_sms?: boolean
          marketing_emails?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      promo_codes: {
        Row: {
          id: string
          code: string
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          min_order_amount: number | null
          max_uses: number | null
          current_uses: number
          expires_at: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          discount_type: 'percentage' | 'fixed'
          discount_value: number
          min_order_amount?: number | null
          max_uses?: number | null
          current_uses?: number
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          code?: string
          discount_type?: 'percentage' | 'fixed'
          discount_value?: number
          min_order_amount?: number | null
          max_uses?: number | null
          current_uses?: number
          expires_at?: string | null
          is_active?: boolean
          created_at?: string
        }
      }
      saved_addresses: {
        Row: {
          id: string
          user_id: string
          label: string
          street: string
          apt: string | null
          city: string
          state: string
          zip: string
          delivery_instructions: string | null
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          label: string
          street: string
          apt?: string | null
          city: string
          state?: string
          zip: string
          delivery_instructions?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          label?: string
          street?: string
          apt?: string | null
          city?: string
          state?: string
          zip?: string
          delivery_instructions?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      waitlist_entries: {
        Row: {
          id: string
          phone: string
          email: string | null
          source: string | null
          created_at: string
        }
        Insert: {
          id?: string
          phone: string
          email?: string | null
          source?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          phone?: string
          email?: string | null
          source?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: {
          user_id: string
        }
        Returns: string
      }
    }
    Enums: {
      order_status:
        | 'pending'
        | 'confirmed'
        | 'preparing'
        | 'out_for_delivery'
        | 'delivered'
        | 'cancelled'
      product_category:
        | 'flower'
        | 'edibles'
        | 'vapes'
        | 'concentrates'
        | 'prerolls'
        | 'accessories'
        | 'topicals'
      strain_type: 'indica' | 'sativa' | 'hybrid'
      user_role: 'customer' | 'admin' | 'driver'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types
export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

export type Order = Database['public']['Tables']['orders']['Row']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type OrderUpdate = Database['public']['Tables']['orders']['Update']

export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']
export type OrderItemUpdate = Database['public']['Tables']['order_items']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type Cart = Database['public']['Tables']['carts']['Row']
export type CartInsert = Database['public']['Tables']['carts']['Insert']
export type CartUpdate = Database['public']['Tables']['carts']['Update']

export type PromoCode = Database['public']['Tables']['promo_codes']['Row']
export type PromoCodeInsert = Database['public']['Tables']['promo_codes']['Insert']
export type PromoCodeUpdate = Database['public']['Tables']['promo_codes']['Update']

export type DeliveryZone = Database['public']['Tables']['delivery_zones']['Row']
export type DeliveryZoneInsert = Database['public']['Tables']['delivery_zones']['Insert']
export type DeliveryZoneUpdate = Database['public']['Tables']['delivery_zones']['Update']

export type SavedAddress = Database['public']['Tables']['saved_addresses']['Row']
export type SavedAddressInsert = Database['public']['Tables']['saved_addresses']['Insert']
export type SavedAddressUpdate = Database['public']['Tables']['saved_addresses']['Update']

export type WaitlistEntry = Database['public']['Tables']['waitlist_entries']['Row']
export type WaitlistEntryInsert = Database['public']['Tables']['waitlist_entries']['Insert']
export type WaitlistEntryUpdate = Database['public']['Tables']['waitlist_entries']['Update']

// Address JSON type
export interface AddressJson {
  street: string
  apt?: string
  city: string
  state: string
  zip: string
}
