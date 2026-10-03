CREATE TABLE IF NOT EXISTS admin_rank_observations (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  track_id BIGINT NOT NULL REFERENCES admin_research_tracks(id) ON DELETE CASCADE,
  source TEXT NOT NULL CHECK (source IN ('google', 'local', 'ai_search')),
  position SMALLINT CHECK (position IS NULL OR position BETWEEN 1 AND 100),
  is_present BOOLEAN NOT NULL DEFAULT TRUE,
  result_url TEXT NOT NULL DEFAULT '',
  evidence TEXT NOT NULL DEFAULT '',
  observed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_rank_observations_track_date
  ON admin_rank_observations (track_id, observed_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_rank_observations_date
  ON admin_rank_observations (observed_at DESC);