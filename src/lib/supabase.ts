import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string
          category: string
          created_at: string
          description: string | null
        }
        Insert: {
          id?: string
          category: string
          created_at?: string
          description?: string | null
        }
        Update: {
          id?: string
          category?: string
          created_at?: string
          description?: string | null
        }
      }
      participants: {
        Row: {
          user_id: string
          session_id: string
          user_name: string
          avatar: string | null
          mood: string | null
          is_speaking: boolean
          is_muted: boolean
          joined_at: string
        }
        Insert: {
          user_id: string
          session_id: string
          user_name: string
          avatar?: string | null
          mood?: string | null
          is_speaking?: boolean
          is_muted?: boolean
          joined_at?: string
        }
        Update: {
          user_id?: string
          session_id?: string
          user_name?: string
          avatar?: string | null
          mood?: string | null
          is_speaking?: boolean
          is_muted?: boolean
          joined_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          session_id: string
          sender: string
          text: string
          timestamp: string
          user_id: string
          userName: string
          avatar: string | null
          content: string
          type: string
          reactions: any | null
          is_edited: boolean
          reply_to: string | null
        }
        Insert: {
          id?: string
          session_id: string
          sender: string
          text: string
          timestamp?: string
          user_id: string
          userName: string
          avatar?: string | null
          content: string
          type?: string
          reactions?: any | null
          is_edited?: boolean
          reply_to?: string | null
        }
        Update: {
          id?: string
          session_id?: string
          sender?: string
          text?: string
          timestamp?: string
          user_id?: string
          userName?: string
          avatar?: string | null
          content?: string
          type?: string
          reactions?: any | null
          is_edited?: boolean
          reply_to?: string | null
        }
      }
      persona: {
        Row: {
          id: number
          persona_id: string
          created_at: string | null
          replica_id: string | null
        }
        Insert: {
          id?: number
          persona_id: string
          created_at?: string | null
          replica_id?: string | null
        }
        Update: {
          id?: number
          persona_id?: string
          created_at?: string | null
          replica_id?: string | null
        }
      }
    }
  }
}