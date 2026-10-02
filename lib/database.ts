import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;
const sql = databaseUrl ? neon(databaseUrl) : null;

export const isDatabaseConfigured = Boolean(databaseUrl);

function createReferenceCode(prefix: 'REF' | 'CNS'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
}

export async function saveContactSubmission(data: {
  name: string;
  email: string;
  projectType: string;
  budget: string;
  timeline: string;
  message: string;
}) {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  const refCode = createReferenceCode('REF');

  await sql`
    INSERT INTO contact_submissions (name, email, project_type, budget, timeline, message, ref_code)
    VALUES (${data.name}, ${data.email}, ${data.projectType}, ${data.budget}, ${data.timeline}, ${data.message}, ${refCode})
  `;

  return { success: true, refCode };
}

export async function saveConsultationRequest(data: {
  name: string;
  email: string;
  packageScope: string;
  fundingGoal: string;
  timeline: string;
  details: string;
}) {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  const refCode = createReferenceCode('CNS');

  await sql`
    INSERT INTO consultation_requests (name, email, package_scope, funding_goal, timeline, details, ref_code)
    VALUES (${data.name}, ${data.email}, ${data.packageScope}, ${data.fundingGoal}, ${data.timeline}, ${data.details}, ${refCode})
  `;

  return { success: true, refCode };
}

export async function saveAiBlueprint(data: {
  title: string;
  domain: string;
  userPrompt: string;
  modelUsed: string;
  blueprint: object;
}) {
  if (!sql) throw new Error('DATABASE_URL is not configured.');

  await sql`
    INSERT INTO ai_blueprints (title, domain, user_prompt, model_used, blueprint_json)
    VALUES (${data.title}, ${data.domain}, ${data.userPrompt}, ${data.modelUsed}, ${JSON.stringify(data.blueprint)}::jsonb)
  `;

  return { success: true };
}