-- Website Grader: persisted scan reports.
-- Stores only report metadata + JSON (never raw page content or user emails).
-- Applied to Neon when DATABASE_URL is configured. The tool also works without
-- this table (reports fall back to an in-memory store).

CREATE TABLE IF NOT EXISTS website_grader_scans (
  id TEXT PRIMARY KEY,
  target_url TEXT NOT NULL,
  final_url TEXT NOT NULL,
  status TEXT NOT NULL,
  overall_score INTEGER,
  report_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS website_grader_scans_created_at_idx ON website_grader_scans (created_at DESC);
