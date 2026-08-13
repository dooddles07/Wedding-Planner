-- Planning state per user (replaces localStorage for authenticated users)
CREATE TABLE user_state (
  user_id    UUID REFERENCES auth.users ON DELETE CASCADE,
  key        TEXT    NOT NULL,
  value      TEXT    NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, key)
);
ALTER TABLE user_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_state_self" ON user_state
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Leads from all contact/newsletter forms
CREATE TABLE leads (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT,
  email        TEXT NOT NULL,
  wedding_date TEXT,
  location     TEXT,
  guest_count  INT,
  message      TEXT,
  source       TEXT NOT NULL,
  context      JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads_insert" ON leads FOR INSERT WITH CHECK (true);

-- Venue/vendor enquiries
CREATE TABLE inquiries (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  target_slug  TEXT NOT NULL,
  target_type  TEXT NOT NULL CHECK (target_type IN ('venue', 'vendor')),
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  wedding_date TEXT,
  message      TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inquiries_insert" ON inquiries FOR INSERT WITH CHECK (true);

-- Published couple wedding sites
CREATE TABLE wedding_sites (
  slug         TEXT PRIMARY KEY,
  user_id      UUID REFERENCES auth.users ON DELETE SET NULL,
  data         JSONB    NOT NULL,
  published    BOOLEAN  NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE wedding_sites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sites_write_own" ON wedding_sites
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sites_read_published" ON wedding_sites
  FOR SELECT USING (published = true);

-- RSVP submissions
CREATE TABLE rsvps (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_slug  TEXT REFERENCES wedding_sites(slug) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  email      TEXT,
  attending  BOOLEAN NOT NULL,
  guests     INT NOT NULL DEFAULT 1,
  message    TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rsvps_insert" ON rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "rsvps_read_own" ON rsvps FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM wedding_sites ws
      WHERE ws.slug = rsvps.site_slug AND ws.user_id = auth.uid()
    )
  );
