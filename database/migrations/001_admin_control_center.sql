CREATE TABLE IF NOT EXISTS admin_social_drafts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  channels TEXT[] NOT NULL DEFAULT '{}',
  copy_by_channel JSONB NOT NULL DEFAULT '{}'::jsonb,
  image_prompt TEXT NOT NULL DEFAULT '',
  scheduled_at TIMESTAMP WITHOUT TIME ZONE,
  time_zone TEXT NOT NULL DEFAULT 'Europe/London',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_social_drafts_updated_at
  ON admin_social_drafts (updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_social_drafts_scheduled_at
  ON admin_social_drafts (scheduled_at) WHERE scheduled_at IS NOT NULL;

CREATE TABLE IF NOT EXISTS admin_research_tracks (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  query_text TEXT NOT NULL,
  scopes TEXT[] NOT NULL DEFAULT '{}',
  cadence TEXT NOT NULL DEFAULT 'manual' CHECK (cadence IN ('manual', 'daily', 'weekly', 'monthly')),
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_research_tracks_updated_at
  ON admin_research_tracks (updated_at DESC);