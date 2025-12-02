export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          address: AddressJson | null;
          phone: string | null;
          age_verified: boolean;
          loyalty_points: number;
          role: 'customer' | 'admin' | 'driver';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          address?: AddressJson | null;
          phone?: string | null;
          age_verified?: boolean;
          loyalty_points?: number;
          role?: 'customer' | 'admin' | 'driver';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          address?: AddressJson | null;
          phone?: string | null;
          age_verified?: boolean;
          loyalty_points?: number;
          role?: 'customer' | 'admin' | 'driver';
          updated_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          category: ProductCategory;
          strain_type: StrainType | null;
          thc_potency: number | null;
          cbd_potency: number | null;
          price: number;
          compare_at_price: number | null;
          stock: number;
          batch_lot: string | null;
          images: string[];
          weight_grams: number | null;
          is_active: boolean;
          is_featured: boolean;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          category: ProductCategory;
          strain_type?: StrainType | null;
          thc_potency?: number | null;
          cbd_potency?: number | null;
          price: number;
          compare_at_price?: number | null;
          stock?: number;
          batch_lot?: string | null;
          images?: string[];
          weight_grams?: number | null;
          is_active?: boolean;
          is_featured?: boolean;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          category?: ProductCategory;
          strain_type?: StrainType | null;
          thc_potency?: number | null;
          cbd_potency?: number | null;
          price?: number;
          compare_at_price?: number | null;
          stock?: number;
          batch_lot?: string | null;
          images?: string[];
          weight_grams?: number | null;
          is_active?: boolean;
          is_featured?: boolean;
          tags?: string[];
          updated_at?: string;
        };
        Relationships: [];
      };
      carts: {
        Row: {
          id: string;
          user_id: string;
          product_id: string;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          product_id: string;
          quantity: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          product_id?: string;
          quantity?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'carts_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'carts_product_id_fkey';
            columns: ['product_id'];
            referencedRelation: 'products';
            referencedColumns: ['id'];
          }
        ];
      };
      orders: {
        Row: {
          id: string;
          user_id: string;
          status: OrderStatus;
          subtotal: number;
          tax: number;
          delivery_fee: number;
          tip: number;
          total: number;
          delivery_address: AddressJson;
          delivery_slot: string;
          delivery_instructions: string | null;
          driver_id: string | null;
          cova_order_id: string | null;
          stripe_payment_intent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          status?: OrderStatus;
          subtotal: number;
          tax: number;
          delivery_fee?: number;
          tip?: number;
          total: number;
          delivery_address: AddressJson;
          delivery_slot: string;
          delivery_instructions?: string | null;
          driver_id?: string | null;
          cova_order_id?: string | null;
          stripe_payment_intent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          status?: OrderStatus;
          subtotal?: number;
          tax?: number;
          delivery_fee?: number;
          tip?: number;
          total?: number;
          delivery_address?: AddressJson;
          delivery_slot?: string;
          delivery_instructions?: string | null;
          driver_id?: string | null;
          cova_order_id?: string | null;
          stripe_payment_intent_id?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'orders_user_id_fkey';
            columns: ['user_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'orders_driver_id_fkey';
            columns: ['driver_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price_at_purchase: number;
          product_title: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          price_at_purchase: number;
          product_title: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          price_at_purchase?: number;
          product_title?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey';
            columns: ['order_id'];
            referencedRelation: 'orders';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'order_items_product_id_fkey';
            columns: ['product_id'];
            referencedRelation: 'products';
            referencedColumns: ['id'];
          }
        ];
      };
      promo_codes: {
        Row: {
          id: string;
          code: string;
          discount_type: 'percentage' | 'fixed';
          discount_value: number;
          min_order_amount: number | null;
          max_uses: number | null;
          current_uses: number;
          expires_at: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          discount_type: 'percentage' | 'fixed';
          discount_value: number;
          min_order_amount?: number | null;
          max_uses?: number | null;
          current_uses?: number;
          expires_at?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          code?: string;
          discount_type?: 'percentage' | 'fixed';
          discount_value?: number;
          min_order_amount?: number | null;
          max_uses?: number | null;
          current_uses?: number;
          expires_at?: string | null;
          is_active?: boolean;
        };
        Relationships: [];
      };
      delivery_zones: {
        Row: {
          id: string;
          name: string;
          suburbs: string[];
          delivery_fee: number;
          min_order: number;
          estimated_minutes: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          suburbs: string[];
          delivery_fee?: number;
          min_order?: number;
          estimated_minutes?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          suburbs?: string[];
          delivery_fee?: number;
          min_order?: number;
          estimated_minutes?: number;
          is_active?: boolean;
        };
        Relationships: [];
      };
      waitlist_entries: {
        Row: {
          id: string;
          phone: string;
          email: string | null;
          source: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          phone: string;
          email?: string | null;
          source?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          phone?: string;
          email?: string | null;
          source?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      get_user_role: {
        Args: { user_id: string };
        Returns: string;
      };
      search_products: {
        Args: { search_query: string };
        Returns: Database['public']['Tables']['products']['Row'][];
      };
    };
    Enums: {
      product_category: ProductCategory;
      order_status: OrderStatus;
      strain_type: StrainType;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type ProductCategory = 'flower' | 'edibles' | 'vapes' | 'concentrates' | 'prerolls' | 'accessories' | 'topicals';

export type StrainType = 'indica' | 'sativa' | 'hybrid';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface AddressJson {
  street: string;
  city: string;
  state: string;
  zip: string;
  lat?: number;
  lng?: number;
  apt?: string;
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

export type Product = Tables<'products'>;
export type Profile = Tables<'profiles'>;
export type Order = Tables<'orders'>;
export type OrderItem = Tables<'order_items'>;
export type CartItem = Tables<'carts'>;
export type PromoCode = Tables<'promo_codes'>;
export type DeliveryZone = Tables<'delivery_zones'>;

export interface CartItemWithProduct extends CartItem {
  products: Product;
}

export interface OrderWithItems extends Order {
  order_items: (OrderItem & { products: Product })[];
}

// Enterprise feature types (from migration 004)
export interface AuditLog {
  id: string;
  table_name: string;
  record_id: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  user_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: string;
  notes: string | null;
  changed_by: string | null;
  created_at: string;
}

export interface ProductReview {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  content: string | null;
  is_verified_purchase: boolean;
  is_approved: boolean;
  is_featured: boolean;
  helpful_count: number;
  created_at: string;
  updated_at: string;
}

export interface SavedAddress {
  id: string;
  user_id: string;
  label: string;
  street: string;
  apt: string | null;
  city: string;
  state: string;
  zip: string;
  lat: number | null;
  lng: number | null;
  is_default: boolean;
  delivery_instructions: string | null;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export interface PromoCodeUsage {
  id: string;
  promo_code_id: string;
  user_id: string;
  order_id: string | null;
  discount_amount: number;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'order_update' | 'promotion' | 'system' | 'review_approved';
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  is_read: boolean;
  created_at: string;
}

export interface InventoryTransaction {
  id: string;
  product_id: string;
  quantity_change: number;
  previous_stock: number;
  new_stock: number;
  reason: 'order' | 'return' | 'adjustment' | 'restock' | 'damage' | 'expiry';
  reference_id: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

export interface ProductAnalytics {
  product_id: string;
  title: string;
  category: ProductCategory;
  total_orders: number;
  total_units_sold: number;
  total_revenue: number;
  avg_rating: number;
  review_count: number;
  current_stock: number;
  is_active: boolean;
  created_at: string;
}

export interface CustomerLTV {
  user_id: string;
  email: string;
  full_name: string | null;
  customer_since: string;
  total_orders: number;
  lifetime_value: number;
  avg_order_value: number;
  last_order_date: string | null;
  loyalty_points: number;
}
