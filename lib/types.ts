export type UserRole = 'practitioner' | 'client'

export interface Profile {
  id: string
  full_name: string
  email: string
  role: UserRole
  avatar_url: string | null
  created_at: string
}

export interface Client {
  id: string
  profile_id: string
  programme: string | null
  start_date: string | null
  status: 'active' | 'inactive' | 'completed'
  created_at: string
  profile?: Profile
}

export interface Session {
  id: string
  client_id: string
  session_date: string
  duration_minutes: number
  notes_practitioner: string | null
  notes_shared: string | null
  next_steps: string | null
  created_at: string
  client?: Client & { profile: Profile }
}

export type ToolType =
  | 'onboarding_questionnaire'
  | 'self_discovery_questionnaire'
  | 'values_exercise'
  | 'wheel_of_life'
  | 'belief_mapping'
  | 'mood_tracker'
  | 'reflection_journal'
  | 'gamified_challenge'

export type QuestionType = 'short_text' | 'long_text' | 'multiple_choice' | 'slider' | 'date'

export interface Question {
  id: string
  text: string
  type: QuestionType
  required: boolean
  options?: string[] // for multiple_choice
  min?: number       // for slider
  max?: number       // for slider
}

export interface Tool {
  id: string
  name: string
  description: string
  type: ToolType
  questions: Question[]
  status: 'draft' | 'published'
  created_at: string
}

export interface ToolAssignment {
  id: string
  tool_id: string
  client_id: string
  assigned_by: string
  due_date: string | null
  note: string | null
  status: 'assigned' | 'in_progress' | 'completed'
  assigned_at: string
  tool?: Tool
  client?: Client & { profile: Profile }
}

export interface ToolResponse {
  id: string
  assignment_id: string
  client_id: string
  responses: Record<string, string | number | string[]>
  submitted_at: string
  assignment?: ToolAssignment
}

export interface BlogPost {
  id?: string
  title: string
  slug: string
  excerpt: string
  body: string
  category: string
  published: boolean
  featured_image: string | null
  created_at: string
  read_time?: number
}
