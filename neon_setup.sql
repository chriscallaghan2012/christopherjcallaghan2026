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

CREATE TABLE IF NOT EXISTS blog_posts (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  meta_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  ai_prompt TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at
  ON contact_submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_created_at
  ON consultation_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_blueprints_created_at
  ON ai_blueprints (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at
  ON blog_posts (published_at DESC) WHERE status = 'published';