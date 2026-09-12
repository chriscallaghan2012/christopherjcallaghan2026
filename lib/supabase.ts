import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 
  process.env.NEXT_PUBLIC_SUPABASE_URL || 
  process.env.VITE_SUPABASE_URL || 
  'https://demo-placeholder.supabase.co';

const SUPABASE_ANON_KEY = 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  process.env.VITE_SUPABASE_ANON_KEY || 
  'demo-placeholder-anon-key';

export const isSupabaseConfigured = Boolean(
  (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL) &&
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY) &&
  !SUPABASE_URL.includes('demo-placeholder')
);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface ContactSubmission {
  name: string;
  email: string;
  project_type: string;
  budget: string;
  timeline: string;
  message: string;
}

export interface ConsultationSubmission {
  name: string;
  email: string;
  package_scope: string;
  funding_goal: string;
  timeline: string;
  details: string;
}

export interface AiBlueprintSubmission {
  title: string;
  domain: string;
  user_prompt: string;
  model_used?: string;
  blueprint_json: object;
}

/**
 * Stores contact form submission in Supabase with local fallback
 */
export async function submitContactForm(data: ContactSubmission) {
  const refCode = 'REF-' + Math.random().toString(36).substring(2, 9).toUpperCase();

  if (!isSupabaseConfigured) {
    // Fallback: Save to LocalStorage / Console when Supabase keys are not set
    try {
      const existing = JSON.parse(localStorage.getItem('cjc_contact_submissions') || '[]');
      existing.push({ ...data, refCode, created_at: new Date().toISOString() });
      localStorage.setItem('cjc_contact_submissions', JSON.stringify(existing));
    } catch {
      // LocalStorage fallback error handle
    }
    return { success: true, isLocalFallback: true, refCode };
  }

  try {
    const { data: inserted, error } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name: data.name,
          email: data.email,
          project_type: data.project_type,
          budget: data.budget,
          timeline: data.timeline,
          message: data.message,
          ref_code: refCode,
          status: 'pending'
        }
      ])
      .select();

    if (error) throw error;
    return { success: true, isLocalFallback: false, refCode, inserted };
  } catch (err: any) {
    console.warn('Supabase submission failed, using local storage fallback:', err.message);
    return { success: true, isLocalFallback: true, refCode, error: err.message };
  }
}

/**
 * Stores consultation request in Supabase with local fallback
 */
export async function submitConsultationRequest(data: ConsultationSubmission) {
  const refCode = 'CNS-' + Math.random().toString(36).substring(2, 9).toUpperCase();

  if (!isSupabaseConfigured) {
    try {
      const existing = JSON.parse(localStorage.getItem('cjc_consultations') || '[]');
      existing.push({ ...data, refCode, created_at: new Date().toISOString() });
      localStorage.setItem('cjc_consultations', JSON.stringify(existing));
    } catch {
      // Ignore local storage write errors
    }
    return { success: true, isLocalFallback: true, refCode };
  }

  try {
    const { data: inserted, error } = await supabase
      .from('consultation_requests')
      .insert([
        {
          name: data.name,
          email: data.email,
          package_scope: data.package_scope,
          funding_goal: data.funding_goal,
          timeline: data.timeline,
          details: data.details,
          ref_code: refCode,
          status: 'pending'
        }
      ])
      .select();

    if (error) throw error;
    return { success: true, isLocalFallback: false, refCode, inserted };
  } catch (err: any) {
    console.warn('Supabase consultation failed, using local storage fallback:', err.message);
    return { success: true, isLocalFallback: true, refCode, error: err.message };
  }
}

/**
 * Archives an AI Architecture Studio blueprint alongside the consultation lead.
 */
export async function submitAiBlueprint(data: AiBlueprintSubmission) {
  if (!isSupabaseConfigured) {
    try {
      const existing = JSON.parse(localStorage.getItem('cjc_ai_blueprints') || '[]');
      existing.push({ ...data, created_at: new Date().toISOString() });
      localStorage.setItem('cjc_ai_blueprints', JSON.stringify(existing));
    } catch {
      // Ignore local storage write errors
    }
    return { success: true, isLocalFallback: true };
  }

  try {
    const { data: inserted, error } = await supabase
      .from('ai_blueprints')
      .insert([
        {
          title: data.title,
          domain: data.domain,
          user_prompt: data.user_prompt,
          model_used: data.model_used || 'Gemini 2.0 Flash',
          blueprint_json: data.blueprint_json
        }
      ])
      .select();

    if (error) throw error;
    return { success: true, isLocalFallback: false, inserted };
  } catch (err: any) {
    console.warn('Supabase ai_blueprints insert failed, using local storage fallback:', err.message);
    return { success: true, isLocalFallback: true, error: err.message };
  }
}
