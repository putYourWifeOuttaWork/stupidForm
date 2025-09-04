import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      forms: {
        Row: {
          id: string
          stakeholder_email: string | null
          company_name: string | null
          completion_status: 'draft' | 'partial' | 'complete'
          current_step: number
          created_at: string
          updated_at: string
          metadata: {
            step_progress?: number
            // ... other metadata properties
            visitor?: {
              ip_address?: string
              country?: string
              region?: string
              city?: string
              timezone?: string
              user_agent?: string
              screen_resolution?: string
              referrer?: string
              session_id?: string
            }
            performance?: {
              start_time?: string
              total_duration?: number
              step_durations?: { [stepId: string]: number }
            }
            assessment?: {
              revision_count?: number
              last_question_answered?: string
              completion_percentage?: number
            }
          }
          facility_docs: string[] | null
          financial_docs: string[] | null
          readout_url: string | null
        }
        Insert: {
          id?: string
          stakeholder_email?: string | null
          company_name?: string | null
          completion_status?: 'draft' | 'partial' | 'complete'
          current_step?: number
          created_at?: string
          updated_at?: string
          metadata?: {
            step_progress?: number
            visitor?: {
              ip_address?: string
              country?: string
              region?: string
              city?: string
              timezone?: string
              user_agent?: string
              screen_resolution?: string
              referrer?: string
              session_id?: string
            }
            performance?: {
              start_time?: string
              total_duration?: number
              step_durations?: { [stepId: string]: number }
            }
            assessment?: {
              revision_count?: number
              last_question_answered?: string
              completion_percentage?: number
            }
          }
          facility_docs?: string[] | null
          financial_docs?: string[] | null
          readout_url?: string | null
        }
        Update: {
          id?: string
          stakeholder_email?: string | null
          company_name?: string | null
          completion_status?: 'draft' | 'partial' | 'complete'
          current_step?: number
          created_at?: string
          updated_at?: string
          metadata?: {
            step_progress?: number
            visitor?: {
              ip_address?: string
              country?: string
              region?: string
              city?: string
              timezone?: string
              user_agent?: string
              screen_resolution?: string
              referrer?: string
              session_id?: string
            }
            performance?: {
              start_time?: string
              total_duration?: number
              step_durations?: { [stepId: string]: number }
            }
            assessment?: {
              revision_count?: number
              last_question_answered?: string
              completion_percentage?: number
            }
          }
          facility_docs?: string[] | null
          financial_docs?: string[] | null
          readout_url?: string | null
        }
      }
      rooms: {
        Row: {
          id: string
          form_id: string
          room_number: number
          length_ft: number | null
          width_ft: number | null
          sq_footage: number | null
          purpose: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          form_id: string
          room_number: number
          length_ft?: number | null
          width_ft?: number | null
          purpose?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          form_id?: string
          room_number?: number
          length_ft?: number | null
          width_ft?: number | null
          purpose?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      basic_info_responses: {
        Row: {
          id: string
          form_id: string
          role: string | null
          facility_location: string[] | null
          years_operation: number | null
          business_model: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          form_id: string
          role?: string | null
          facility_location?: string[] | null
          years_operation?: number | null
          business_model?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          form_id?: string
          role?: string | null
          facility_location?: string[] | null
          years_operation?: number | null
          business_model?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}