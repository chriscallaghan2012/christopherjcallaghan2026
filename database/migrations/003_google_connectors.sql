CREATE TABLE IF NOT EXISTS admin_google_connection (
  id SMALLINT PRIMARY KEY CHECK (id = 1),
  account_email TEXT NOT NULL,
  encrypted_refresh_token TEXT NOT NULL,
  granted_scopes TEXT[] NOT NULL DEFAULT '{}',
  connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_synced_at TIMESTAMPTZ,
  last_sync_status TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS admin_google_snapshots (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  source TEXT NOT NULL CHECK (source IN ('ga4', 'gsc', 'gbp')),
  resource_id TEXT NOT NULL,
  resource_name TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  data_json JSONB NOT NULL,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_google_snapshots_source_date
  ON admin_google_snapshots (source, synced_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_google_snapshots_resource_date
  ON admin_google_snapshots (resource_id, synced_at DESC);