-- ============================================================
-- Deepbloom Phase 4 Migration
-- Invoicing + Documents
-- Run in Supabase SQL editor
-- ============================================================

-- ── invoices: Stripe-ready columns ───────────────────────────
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS currency                 text NOT NULL DEFAULT 'gbp';
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS payment_link             text;

-- ── documents: metadata columns ──────────────────────────────
ALTER TABLE documents ADD COLUMN IF NOT EXISTS label       text;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS category    text NOT NULL DEFAULT 'other'
  CHECK (category IN ('consent_form', 'resource', 'agreement', 'programme_material', 'other'));
ALTER TABLE documents ADD COLUMN IF NOT EXISTS is_shared   boolean NOT NULL DEFAULT false;

-- ── Fix Phase 1 RLS policies to use is_practitioner() ────────
-- (Phase 1 migration used the recursive EXISTS pattern which can
--  cause infinite recursion; replace all of them here)

-- invoices
DROP POLICY IF EXISTS "Practitioners full access to invoices" ON invoices;
DROP POLICY IF EXISTS "Clients can view own invoices"         ON invoices;

CREATE POLICY "Practitioners full access to invoices"
  ON invoices FOR ALL
  USING (public.is_practitioner());

CREATE POLICY "Clients can view own invoices"
  ON invoices FOR SELECT
  USING (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

-- documents
DROP POLICY IF EXISTS "Practitioners full access to documents" ON documents;
DROP POLICY IF EXISTS "Clients can view own documents"         ON documents;

CREATE POLICY "Practitioners full access to documents"
  ON documents FOR ALL
  USING (public.is_practitioner());

CREATE POLICY "Clients can view own documents"
  ON documents FOR SELECT
  USING (
    client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid())
    AND is_shared = true
  );

-- mood_entries
DROP POLICY IF EXISTS "Practitioners full access to mood_entries" ON mood_entries;
DROP POLICY IF EXISTS "Clients can manage own mood_entries"       ON mood_entries;

CREATE POLICY "Practitioners full access to mood_entries"
  ON mood_entries FOR ALL
  USING (public.is_practitioner());

CREATE POLICY "Clients can manage own mood_entries"
  ON mood_entries FOR ALL
  USING (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

-- journal_entries
DROP POLICY IF EXISTS "Practitioners can read non-private journal entries" ON journal_entries;
DROP POLICY IF EXISTS "Practitioners can manage all journal entries"       ON journal_entries;
DROP POLICY IF EXISTS "Clients can manage own journal entries"             ON journal_entries;

CREATE POLICY "Practitioners can read journal entries"
  ON journal_entries FOR SELECT
  USING (is_private = false AND public.is_practitioner());

CREATE POLICY "Practitioners can manage all journal entries"
  ON journal_entries FOR ALL
  USING (public.is_practitioner());

CREATE POLICY "Clients can manage own journal entries"
  ON journal_entries FOR ALL
  USING (client_id IN (SELECT id FROM clients WHERE profile_id = auth.uid()));

-- audit_log
DROP POLICY IF EXISTS "Practitioners can view own audit log"  ON audit_log;
DROP POLICY IF EXISTS "Practitioners can insert audit log"    ON audit_log;

CREATE POLICY "Practitioners can view own audit log"
  ON audit_log FOR SELECT
  USING (public.is_practitioner());

CREATE POLICY "Practitioners can insert audit log"
  ON audit_log FOR INSERT
  WITH CHECK (public.is_practitioner());

-- ── Storage: documents bucket ─────────────────────────────────
-- NOTE: Create a storage bucket named "documents" in the Supabase
-- dashboard (Storage → New bucket → Name: documents, Public: false).
-- Then run the storage policies below.

-- Storage RLS (run after bucket is created)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false)
-- ON CONFLICT DO NOTHING;

CREATE POLICY "Practitioners can upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents'
    AND public.is_practitioner()
  );

CREATE POLICY "Practitioners can read documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents'
    AND public.is_practitioner()
  );

CREATE POLICY "Practitioners can delete documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'documents'
    AND public.is_practitioner()
  );

CREATE POLICY "Clients can read own documents"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'documents'
    AND (storage.foldername(name))[1] IN (
      SELECT id::text FROM clients WHERE profile_id = auth.uid()
    )
  );
