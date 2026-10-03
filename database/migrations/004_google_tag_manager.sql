ALTER TABLE admin_google_snapshots
  DROP CONSTRAINT IF EXISTS admin_google_snapshots_source_check;

ALTER TABLE admin_google_snapshots
  ADD CONSTRAINT admin_google_snapshots_source_check
  CHECK (source IN ('ga4', 'gsc', 'gbp', 'gtm'));