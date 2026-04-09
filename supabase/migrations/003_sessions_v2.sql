-- ============================================================
-- Deepbloom Phase 5 Migration
-- Sessions v2: programme type, richer status, scheduling,
-- Google Calendar sync support, per-practitioner OAuth tokens
-- ============================================================

-- ── sessions: programme type (First Root vs The Becoming) ────
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS programme text
  CHECK (programme IN ('first_root', 'becoming', 'in_full_bloom'));

-- ── sessions: scheduled datetime (for upcoming/booked sessions)
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS scheduled_at timestamptz;

-- ── sessions: expand status to cover the full lifecycle ──────
-- Drop old constraint and add new one
ALTER TABLE sessions DROP CONSTRAINT IF EXISTS sessions_status_check;
ALTER TABLE sessions ADD CONSTRAINT sessions_status_check
  CHECK (status IN ('booked', 'confirmed', 'cancelled', 'rescheduled', 'draft', 'complete'));

-- Migrate old 'complete' rows to 'confirmed' so billing logic is clear
UPDATE sessions SET status = 'confirmed' WHERE status = 'complete';

-- Update default for new rows
ALTER TABLE sessions ALTER COLUMN status SET DEFAULT 'booked';

-- ── sessions: Google Calendar event ID for two-way sync ──────
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS google_event_id text;

-- ── profiles: per-practitioner Google OAuth tokens ───────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS google_refresh_token text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS google_calendar_id   text DEFAULT 'primary';
