CREATE TABLE IF NOT EXISTS contact_submissions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  project_type TEXT NOT NULL,
  budget TEXT NOT NULL DEFAULT 'Not Specified',
  timeline TEXT NOT NULL DEFAULT 'Flexible',
  message TEXT NOT NULL DEFAULT '',
  ref_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS consultation_requests (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  package_scope TEXT NOT NULL,
  funding_goal TEXT NOT NULL DEFAULT 'N/A',
  timeline TEXT NOT NULL DEFAULT 'Flexible',
  details TEXT NOT NULL DEFAULT '',
  ref_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_blueprints (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  domain TEXT NOT NULL,
  user_prompt TEXT NOT NULL,
  model_used TEXT NOT NULL DEFAULT 'Gemini 2.0 Flash',
  blueprint_json JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at
  ON contact_submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_created_at
  ON consultation_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_blueprints_created_at
  ON ai_blueprints (created_at DESC);