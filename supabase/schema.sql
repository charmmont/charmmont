-- ============================================================
-- Deepbloom — Supabase Database Schema
-- Run this in the Supabase SQL editor to set up all tables.
-- ============================================================

-- Profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name   text,
  email       text,
  role        text NOT NULL DEFAULT 'client' CHECK (role IN ('practitioner', 'client')),
  avatar_url  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Automatically create a profile row on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'client')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Clients (extended info for client users)
CREATE TABLE IF NOT EXISTS clients (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id  uuid REFERENCES profiles(id) ON DELETE CASCADE,
  programme   text,
  start_date  date,
  status      text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Sessions
CREATE TABLE IF NOT EXISTS sessions (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id             uuid REFERENCES clients(id) ON DELETE CASCADE,
  session_date          date NOT NULL,
  duration_minutes      int NOT NULL DEFAULT 60,
  notes_practitioner    text,
  notes_shared          text,
  next_steps            text,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- Practitioner notes (private, per client)
CREATE TABLE IF NOT EXISTS practitioner_notes (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   uuid REFERENCES clients(id) ON DELETE CASCADE,
  content     text,
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE(client_id)
);

-- Tools
CREATE TABLE IF NOT EXISTS tools (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  description text,
  type        text NOT NULL,
  questions   jsonb NOT NULL DEFAULT '[]',
  status      text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Tool assignments
CREATE TABLE IF NOT EXISTS tool_assignments (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id      uuid REFERENCES tools(id) ON DELETE CASCADE,
  client_id    uuid REFERENCES clients(id) ON DELETE CASCADE,
  assigned_by  uuid REFERENCES profiles(id),
  due_date     date,
  note         text,
  status       text NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_progress', 'completed')),
  assigned_at  timestamptz NOT NULL DEFAULT now()
);

-- Tool responses
CREATE TABLE IF NOT EXISTS tool_responses (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id   uuid REFERENCES tool_assignments(id) ON DELETE CASCADE,
  client_id       uuid REFERENCES clients(id) ON DELETE CASCADE,
  responses       jsonb NOT NULL DEFAULT '{}',
  submitted_at    timestamptz NOT NULL DEFAULT now()
);

-- Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  email       text NOT NULL,
  message     text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Blog posts (optional — use markdown files instead if preferred)
CREATE TABLE IF NOT EXISTS posts (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  slug            text UNIQUE NOT NULL,
  excerpt         text,
  body            text,
  category        text,
  published       boolean NOT NULL DEFAULT false,
  featured_image  text,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE practitioner_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update own profile; practitioner can read all
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Practitioners can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'practitioner'
    )
  );

-- Clients: practitioners can do everything; clients can read own
CREATE POLICY "Practitioners full access to clients"
  ON clients FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'practitioner'
    )
  );

CREATE POLICY "Clients can view own record"
  ON clients FOR SELECT USING (profile_id = auth.uid());

-- Sessions: practitioners full access; clients can read own
CREATE POLICY "Practitioners full access to sessions"
  ON sessions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'practitioner'
    )
  );

CREATE POLICY "Clients can view own sessions"
  ON sessions FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.uid()
    )
  );

-- Practitioner notes: practitioner only
CREATE POLICY "Practitioners only for notes"
  ON practitioner_notes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'practitioner'
    )
  );

-- Tools: practitioners manage; clients can read published
CREATE POLICY "Practitioners full access to tools"
  ON tools FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'practitioner'
    )
  );

CREATE POLICY "Clients can view published tools"
  ON tools FOR SELECT USING (status = 'published');

-- Tool assignments: practitioners full; clients can see own
CREATE POLICY "Practitioners full access to assignments"
  ON tool_assignments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'practitioner'
    )
  );

CREATE POLICY "Clients can view own assignments"
  ON tool_assignments FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Clients can update own assignment status"
  ON tool_assignments FOR UPDATE
  USING (
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.uid()
    )
  );

-- Tool responses: practitioners full; clients can insert/view own
CREATE POLICY "Practitioners full access to responses"
  ON tool_responses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'practitioner'
    )
  );

CREATE POLICY "Clients can insert own responses"
  ON tool_responses FOR INSERT
  WITH CHECK (
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Clients can view own responses"
  ON tool_responses FOR SELECT
  USING (
    client_id IN (
      SELECT id FROM clients WHERE profile_id = auth.uid()
    )
  );

-- Contact submissions: service role only (no client access)
CREATE POLICY "No public access to contact submissions"
  ON contact_submissions FOR ALL USING (false);
