-- ====================================================================
-- CHRISTOPHER J. CALLAGHAN - SUPABASE DATABASE SCHEMA SETUP
-- Run this SQL script in your Supabase SQL Editor to provision tables & security policies.
-- ====================================================================

-- 1. Contact Submissions Table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    project_type TEXT NOT NULL,
    budget TEXT,
    timeline TEXT,
    message TEXT NOT NULL,
    ref_code TEXT UNIQUE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Consultation Requests Table
CREATE TABLE IF NOT EXISTS public.consultation_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    package_scope TEXT NOT NULL,
    funding_goal TEXT,
    timeline TEXT,
    details TEXT,
    ref_code TEXT UNIQUE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'scheduled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. AI Architecture Blueprints Archive Table
CREATE TABLE IF NOT EXISTS public.ai_blueprints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    domain TEXT NOT NULL,
    user_prompt TEXT NOT NULL,
    model_used TEXT DEFAULT 'Gemini 2.0 Flash',
    blueprint_json JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_blueprints ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies: Allow Anonymous Insert (from Web App)
CREATE POLICY "Allow public insert to contact_submissions" 
    ON public.contact_submissions FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public insert to consultation_requests" 
    ON public.consultation_requests FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow public insert to ai_blueprints" 
    ON public.ai_blueprints FOR INSERT 
    WITH CHECK (true);

-- 6. Performance Indices
CREATE INDEX IF NOT EXISTS idx_contact_created ON public.contact_submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultation_created ON public.consultation_requests (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blueprints_created ON public.ai_blueprints (created_at DESC);

-- Output Confirmation
SELECT 'Supabase tables and security policies created successfully!' AS status;
