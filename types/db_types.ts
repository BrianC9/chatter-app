export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          isDeleted: boolean | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          isDeleted?: boolean | null
          user_id?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          isDeleted?: boolean | null
          user_id?: string
        }
      }
      profiles: {
        Row: {
          id: string
          raw_user_meta_data: Json | null
        }
        Insert: {
          id: string
          raw_user_meta_data?: Json | null
        }
        Update: {
          id?: string
          raw_user_meta_data?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
