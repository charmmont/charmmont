-- ============================================================
-- Deepbloom Phase 1 Migration
-- Run in Supabase SQL editor AFTER the initial schema.sql
-- ============================================================

-- ── clients: add missing columns ─────────────────────────────
ALTER TABLE clients ADD COLUMN IF NOT EXISTS summary_note     text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS emergency_contact text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS flags             text;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS invited_at        timestamptz;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS invite_accepted_at timestamptz;

-- Update status to include 'paused' (drop old constraint, add new)
ALTER TABLE clients DROP CONSTRAINT IF EXISTS clients_status_check;
ALTER TABLE clients ADD CONSTRAINT clients_status_check
  CHECK (status IN ('active', 'paused', 'completed'));

-- ── sessions: add missing columns ────────────────────────────
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS session_type   text DEFAULT 'video'
  CHECK (session_type IN ('video', 'phone', 'in_person'));
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS homework       text;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS flag_followup  boolean NOT NULL DEFAULT false;
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS status         text NOT NULL DEFAULT 'complete'
  CHECK (status IN ('draft', 'complete'));

-- ── tools: add missing columns ───────────────────────────────
ALTER TABLE tools ADD COLUMN IF NOT EXISTS content       jsonb NOT NULL DEFAULT '{}';
ALTER TABLE tools ADD COLUMN IF NOT EXISTS settings      jsonb NOT NULL DEFAULT '{}';
ALTER TABLE tools ADD COLUMN IF NOT EXISTS times_assigned int NOT NULL DEFAULT 0;

-- Rename questions → keep for backwards compat, content is the new structure
-- (questions stays, content will hold type-specific builder output)

-- ── tool_assignments: add missing columns ────────────────────
ALTER TABLE tool_assignments ADD COLUMN IF NOT EXISTS personal_note text;
ALTER TABLE tool_assignments ADD COLUMN IF NOT EXISTS completed_at  timestamptz;

-- ── invoices ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id      uuid REFERENCES clients(id) ON DELETE CASCADE,
  invoice_number text UNIQUE NOT NULL,
  invoice_date   date NOT NULL DEFAULT CURRENT_DATE,
  due_date       date,
  line_items     jsonb NOT NULL DEFAULT '[]',
  subtotal       numeric NOT NULL DEFAULT 0,
  vat_rate       numeric NOT NULL DEFAULT 0,
  total          numeric NOT NULL DEFAULT 0,
  notes          text,
  status         text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'sent', 'paid', 'overdue')),
  paid_at        timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- ── documents ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id    uuid REFERENCES clients(id) ON DELETE CASCADE,
  file_name    text NOT NULL,
  file_url     text NOT NULL,
  file_type    text,
  file_size    int,
  uploaded_by  uuid REFERENCES profiles(id),
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ── mood_entries ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mood_entries (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id   uuid REFERENCES tool_assignments(id) ON DELETE CASCADE,
  client_id       uuid REFERENCES clients(id) ON DELETE CASCADE,
  mood_rating     int CHECK (mood_rating BETWEEN 1 AND 10),
  energy_rating   int CHECK (energy_rating BETWEEN 1 AND 10),
  one_word        text,
  reflection      text,
  custom_response text,
  entry_date      date NOT NULL DEFAULT CURRENT_DATE,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ── journal_entries ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS journal_entries (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id  uuid REFERENCES tool_assignments(id) ON DELETE CASCADE,
  client_id      uuid REFERENCES clients(id) ON DELETE CASCADE,
  content        text,
  is_private     boolean NOT NULL DEFAULT false,
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- ── audit_log ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  practitioner_id  uuid REFERENCES profiles(id),
  action           text NOT NULL,
  entity_type      text,
  entity_id        uuid,
  metadata         jsonb,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- ── Row Level Security for new tables ────────────────────────

ALTER TABLE invoices      ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents     ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries  ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log     ENABLE ROW LEVEL SECURITY;

-- invoices
CREATE POLICY "Practitioners full access to invoices"
  ON invoices FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'practitioner'));

CREATE POLICY "Clients can view own invoices"
  ON invoices FOR SELECT
  USING (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

-- documents
CREATE POLICY "Practitioners full access to documents"
  ON documents FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'practitioner'));

CREATE POLICY "Clients can view own documents"
  ON documents FOR SELECT
  USING (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

-- mood_entries
CREATE POLICY "Practitioners full access to mood_entries"
  ON mood_entries FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'practitioner'));

CREATE POLICY "Clients can manage own mood_entries"
  ON mood_entries FOR ALL
  USING (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

-- journal_entries
CREATE POLICY "Practitioners can read non-private journal entries"
  ON journal_entries FOR SELECT
  USING (
    is_private = false AND
    EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'practitioner')
  );

CREATE POLICY "Practitioners can manage all journal entries"
  ON journal_entries FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'practitioner'));

CREATE POLICY "Clients can manage own journal entries"
  ON journal_entries FOR ALL
  USING (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

-- audit_log (practitioner read-only)
CREATE POLICY "Practitioners can view own audit log"
  ON audit_log FOR SELECT
  USING (practitioner_id = auth.uid());

CREATE POLICY "Practitioners can insert audit log"
  ON audit_log FOR INSERT
  WITH CHECK (practitioner_id = auth.uid());
