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
  options?: string[]
  min?: number
  max?: number
}

// ── Tool content structures (stored in tools.content JSONB) ──────────────────

export interface QuestionnaireContent {
  questions: Question[]
}

export interface ValuesExerciseContent {
  values_library: string[]
  allow_custom: boolean
  rank_top: number
  reflection_prompts: string[]
}

export interface WheelOfLifeContent {
  areas: string[]
}

export interface BeliefMappingContent {
  prompts: string[]
}

export interface MoodTrackerContent {
  frequency: 'daily' | 'weekly'
  duration_days: number
  custom_question: string | null
}

export interface ReflectionJournalContent {
  prompt: string
  is_private: boolean
}

export interface ChallengeDay {
  day: number
  title: string
  description: string
}

export interface GamifiedChallengeContent {
  duration_days: number
  days: ChallengeDay[]
  completion_message: string
}

export type ToolContent =
  | QuestionnaireContent
  | ValuesExerciseContent
  | WheelOfLifeContent
  | BeliefMappingContent
  | MoodTrackerContent
  | ReflectionJournalContent
  | GamifiedChallengeContent

// ── Tool response structures (stored in tool_responses.responses JSONB) ──────

export interface QuestionnaireResponse {
  [questionId: string]: string | number | string[]
}

export interface ValuesResponse {
  selected: string[]
  ranked: string[]
  reflections: Record<string, string>
}

export interface WheelOfLifeResponse {
  scores: Record<string, number>
  notes: Record<string, string>
}

export interface BeliefMappingResponse {
  answers: Record<number, string>
}

export interface ChallengeResponse {
  completed_days: number[]
  notes: Record<number, string>
}

// ── Mood & journal entries (separate tables for time-series) ─────────────────

export interface MoodEntry {
  id: string
  assignment_id: string
  client_id: string
  mood_rating: number
  energy_rating: number | null
  one_word: string | null
  reflection: string | null
  custom_response: string | null
  entry_date: string
  created_at: string
}

export interface JournalEntry {
  id: string
  assignment_id: string
  client_id: string
  content: string
  is_private: boolean
  created_at: string
}

// ── Domain models ─────────────────────────────────────────────────────────────

export interface Tool {
  id: string
  name: string
  description: string
  type: ToolType
  content: ToolContent | null
  questions: Question[] // legacy field — kept for backwards compat
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
  responses: QuestionnaireResponse | ValuesResponse | WheelOfLifeResponse | BeliefMappingResponse | ChallengeResponse
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
