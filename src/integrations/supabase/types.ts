export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      aggregated_products: {
        Row: {
          admin_certified: boolean | null
          category: Database["public"]["Enums"]["product_category"]
          created_at: string | null
          description: string | null
          farmer_count: number
          id: string
          image: string | null
          product_ids: string[] | null
          product_name: string
          quality_assured: boolean | null
          quality_grade: Database["public"]["Enums"]["quality_grade"]
          quantity_unit: string
          regions: string[] | null
          standard_price: number
          total_quantity: number
          updated_at: string | null
        }
        Insert: {
          admin_certified?: boolean | null
          category: Database["public"]["Enums"]["product_category"]
          created_at?: string | null
          description?: string | null
          farmer_count?: number
          id?: string
          image?: string | null
          product_ids?: string[] | null
          product_name: string
          quality_assured?: boolean | null
          quality_grade: Database["public"]["Enums"]["quality_grade"]
          quantity_unit?: string
          regions?: string[] | null
          standard_price: number
          total_quantity: number
          updated_at?: string | null
        }
        Update: {
          admin_certified?: boolean | null
          category?: Database["public"]["Enums"]["product_category"]
          created_at?: string | null
          description?: string | null
          farmer_count?: number
          id?: string
          image?: string | null
          product_ids?: string[] | null
          product_name?: string
          quality_assured?: boolean | null
          quality_grade?: Database["public"]["Enums"]["quality_grade"]
          quantity_unit?: string
          regions?: string[] | null
          standard_price?: number
          total_quantity?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      buyer_profiles: {
        Row: {
          business_license: string | null
          business_type: string | null
          company_name: string | null
          created_at: string | null
          id: string
          procurement_volume: string | null
          settings: Json | null
        }
        Insert: {
          business_license?: string | null
          business_type?: string | null
          company_name?: string | null
          created_at?: string | null
          id: string
          procurement_volume?: string | null
          settings?: Json | null
        }
        Update: {
          business_license?: string | null
          business_type?: string | null
          company_name?: string | null
          created_at?: string | null
          id?: string
          procurement_volume?: string | null
          settings?: Json | null
        }
        Relationships: []
      }
      farmer_profiles: {
        Row: {
          certification_documents: string[] | null
          created_at: string | null
          farm_location: string | null
          farm_size: string | null
          id: string
          primary_crops: string[] | null
          settings: Json | null
        }
        Insert: {
          certification_documents?: string[] | null
          created_at?: string | null
          farm_location?: string | null
          farm_size?: string | null
          id: string
          primary_crops?: string[] | null
          settings?: Json | null
        }
        Update: {
          certification_documents?: string[] | null
          created_at?: string | null
          farm_location?: string | null
          farm_size?: string | null
          id?: string
          primary_crops?: string[] | null
          settings?: Json | null
        }
        Relationships: []
      }
      feedback: {
        Row: {
          admin_response: string | null
          category: string
          created_at: string | null
          description: string
          id: string
          priority: string
          rating: number
          status: string
          subject: string
          updated_at: string | null
          user_id: string
          user_type: string
        }
        Insert: {
          admin_response?: string | null
          category: string
          created_at?: string | null
          description: string
          id?: string
          priority?: string
          rating?: number
          status?: string
          subject: string
          updated_at?: string | null
          user_id: string
          user_type: string
        }
        Update: {
          admin_response?: string | null
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          priority?: string
          rating?: number
          status?: string
          subject?: string
          updated_at?: string | null
          user_id?: string
          user_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          order_id: string | null
          product_id: string | null
          read: boolean | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          order_id?: string | null
          product_id?: string | null
          read?: boolean | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          order_id?: string | null
          product_id?: string | null
          read?: boolean | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          buyer_id: string
          created_at: string | null
          delivery_address: string | null
          delivery_date: string | null
          id: string
          notes: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          product_id: string
          product_name: string | null
          quantity_ordered: number
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          tracking_id: string | null
          updated_at: string | null
        }
        Insert: {
          buyer_id: string
          created_at?: string | null
          delivery_address?: string | null
          delivery_date?: string | null
          id?: string
          notes?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          product_id: string
          product_name?: string | null
          quantity_ordered: number
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount: number
          tracking_id?: string | null
          updated_at?: string | null
        }
        Update: {
          buyer_id?: string
          created_at?: string | null
          delivery_address?: string | null
          delivery_date?: string | null
          id?: string
          notes?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          product_id?: string
          product_name?: string | null
          quantity_ordered?: number
          status?: Database["public"]["Enums"]["order_status"] | null
          total_amount?: number
          tracking_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          buyer_id: string | null
          created_at: string | null
          farmer_amount: number
          farmer_id: string
          id: string
          order_id: string | null
          payment_direction: string | null
          payment_method: string | null
          payment_type: string | null
          platform_fee: number | null
          processed_at: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          buyer_id?: string | null
          created_at?: string | null
          farmer_amount: number
          farmer_id: string
          id?: string
          order_id?: string | null
          payment_direction?: string | null
          payment_method?: string | null
          payment_type?: string | null
          platform_fee?: number | null
          processed_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          buyer_id?: string | null
          created_at?: string | null
          farmer_amount?: number
          farmer_id?: string
          id?: string
          order_id?: string | null
          payment_direction?: string | null
          payment_method?: string | null
          payment_type?: string | null
          platform_fee?: number | null
          processed_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          admin_notes: string | null
          category: Database["public"]["Enums"]["product_category"]
          collection_date: string | null
          created_at: string | null
          description: string | null
          expiry_date: string | null
          farmer_id: string
          harvest_date: string | null
          id: string
          images: string[] | null
          location: string | null
          name: string
          organic_certified: boolean | null
          price_per_unit: number
          quality_grade: Database["public"]["Enums"]["quality_grade"]
          quantity_available: number
          quantity_unit: string
          status: Database["public"]["Enums"]["product_status"] | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          category: Database["public"]["Enums"]["product_category"]
          collection_date?: string | null
          created_at?: string | null
          description?: string | null
          expiry_date?: string | null
          farmer_id: string
          harvest_date?: string | null
          id?: string
          images?: string[] | null
          location?: string | null
          name: string
          organic_certified?: boolean | null
          price_per_unit: number
          quality_grade: Database["public"]["Enums"]["quality_grade"]
          quantity_available: number
          quantity_unit?: string
          status?: Database["public"]["Enums"]["product_status"] | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          category?: Database["public"]["Enums"]["product_category"]
          collection_date?: string | null
          created_at?: string | null
          description?: string | null
          expiry_date?: string | null
          farmer_id?: string
          harvest_date?: string | null
          id?: string
          images?: string[] | null
          location?: string | null
          name?: string
          organic_certified?: boolean | null
          price_per_unit?: number
          quality_grade?: Database["public"]["Enums"]["quality_grade"]
          quantity_available?: number
          quantity_unit?: string
          status?: Database["public"]["Enums"]["product_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_farmer_id_fkey"
            columns: ["farmer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          language: string | null
          phone: string | null
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          language?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          language?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      process_aggregated_order: {
        Args: {
          p_buyer_id: string
          p_aggregated_product_id: string
          p_quantity: number
          p_delivery_address: string
          p_phone?: string
          p_preferred_delivery_date?: string
          p_special_instructions?: string
        }
        Returns: string
      }
      process_order: {
        Args: {
          p_buyer_id: string
          p_product_id: string
          p_quantity: number
          p_delivery_address: string
        }
        Returns: string
      }
      send_notification: {
        Args: {
          p_user_id: string
          p_title: string
          p_message: string
          p_type?: Database["public"]["Enums"]["notification_type"]
          p_product_id?: string
          p_order_id?: string
        }
        Returns: string
      }
    }
    Enums: {
      app_role: "farmer" | "buyer" | "admin"
      notification_type:
        | "product_status"
        | "order_update"
        | "payment"
        | "collection"
        | "admin_message"
        | "general"
      order_status:
        | "pending"
        | "confirmed"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
      payment_status: "pending" | "paid_to_farmer" | "completed"
      product_category:
        | "grain"
        | "vegetable"
        | "fruit"
        | "pulse"
        | "spice"
        | "other"
      product_status:
        | "pending_review"
        | "admin_review"
        | "approved"
        | "rejected"
        | "scheduled_collection"
        | "collected"
        | "payment_processed"
      quality_grade: "A+" | "A" | "B+" | "B" | "C"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["farmer", "buyer", "admin"],
      notification_type: [
        "product_status",
        "order_update",
        "payment",
        "collection",
        "admin_message",
        "general",
      ],
      order_status: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      payment_status: ["pending", "paid_to_farmer", "completed"],
      product_category: [
        "grain",
        "vegetable",
        "fruit",
        "pulse",
        "spice",
        "other",
      ],
      product_status: [
        "pending_review",
        "admin_review",
        "approved",
        "rejected",
        "scheduled_collection",
        "collected",
        "payment_processed",
      ],
      quality_grade: ["A+", "A", "B+", "B", "C"],
    },
  },
} as const
