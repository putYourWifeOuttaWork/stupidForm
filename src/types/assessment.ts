export interface FormResponse {
  id: string
  stakeholder_email?: string
  company_name?: string
  completion_status: 'draft' | 'partial' | 'complete'
  current_step: number
  created_at: string
  updated_at: string
  metadata: ResponseMetadata
  facility_docs?: string[]
  financial_docs?: string[]
}

export interface RoomData {
  id?: string
  room_number: number
  length_ft: number
  width_ft: number
  sq_footage?: number
  purpose: string
}

export interface ResponseMetadata {
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

export interface FormAnswer {
  id: string
  response_id: string
  section_id: string
  question_id: string
  answer_value?: string
  additional_context?: string
  answered_at: string
}

export interface Question {
  id: string
  type: 'text' | 'email' | 'select' | 'multiselect' | 'slider' | 'radio' | 'checkbox' | 'textarea' | 'file'
  label: string
  placeholder?: string
  options?: string[]
  min?: number
  max?: number
  step?: number
  required?: boolean
  tooltip?: string
  validation?: {
    pattern?: string
    message?: string
  }
  disableContext?: boolean
}

export interface FormSection {
  id: string
  title: string
  description: string
  progress: number
  questions: Question[]
}

export interface WizardStep {
  id: string
  title: string
  subtitle: string
  sections: FormSection[]
}