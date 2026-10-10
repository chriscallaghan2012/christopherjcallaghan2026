import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;
const sql = databaseUrl ? neon(databaseUrl) : null;

export const isDatabaseConfigured = Boolean(databaseUrl);

export type BlogPostStatus = 'draft' | 'published';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  contentMarkdown: string;
  metaTitle: string;
  metaDescription: string;
  aiPrompt: string;
  status: BlogPostStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

export type BlogPostInput = Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt' | 'publishedAt'> & { id?: string };

export type SocialChannel = 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'youtube' | 'pinterest' | 'x' | 'threads';
export type SocialDraftStatus = 'draft' | 'approved';

export interface AdminSocialDraft {
  id: string;
  title: string;
  prompt: string;
  channels: SocialChannel[];
  copyByChannel: Partial<Record<SocialChannel, string>>;
  imagePrompt: string;
  scheduledAt: string | null;
  timeZone: string;
  status: SocialDraftStatus;
  createdAt: string;
  updatedAt: string;
}

export type AdminSocialDraftInput = Omit<AdminSocialDraft, 'id' | 'createdAt' | 'updatedAt'> & { id?: string };

export type ResearchScope = 'google' | 'local' | 'ai_search' | 'competitors';
export type ResearchCadence = 'manual' | 'daily' | 'weekly' | 'monthly';

export interface AdminResearchTrack {
  id: string;
  name: string;
  query: string;
  scopes: ResearchScope[];
  cadence: ResearchCadence;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AdminResearchTrackInput = Omit<AdminResearchTrack, 'id' | 'createdAt' | 'updatedAt'> & { id?: string };

export type AdminSubmissionKind = 'contact' | 'consultation';
export type AdminSubmissionStatus = 'pending' | 'reviewed';

export interface AdminSubmission {
  id: string;
  kind: AdminSubmissionKind;
  name: string;
  email: string;
  subject: string;
  budget: string;
  timeline: string;
  message: string;
  reference: string;
  status: AdminSubmissionStatus;
  createdAt: string;
}

export type RankingSource = 'google' | 'local' | 'ai_search';

export interface AdminRankObservation {
  id: string;
  trackId: string;
  trackName: string;
  query: string;
  source: RankingSource;
  position: number | null;
  isPresent: boolean;
  resultUrl: string;
  evidence: string;
  observedAt: string;
}

export interface AdminRankObservationInput {
  trackId: string;
  source: RankingSource;
  position: number | null;
  isPresent: boolean;
  resultUrl: string;
  evidence: string;
}

export interface AdminGoogleConnection {
  accountEmail: string;
  encryptedRefreshToken: string;
  grantedScopes: string[];
  connectedAt: string;
  lastSyncedAt: string | null;
  lastSyncStatus: string;
}

export type GoogleDataSource = 'ga4' | 'gsc' | 'gbp' | 'gtm';

export interface AdminGoogleSnapshotInput {
  source: GoogleDataSource;
  resourceId: string;
  resourceName: string;
  periodStart: string;
  periodEnd: string;
  data: unknown;
}

export interface AdminGoogleSnapshot {
  id: string;
  source: GoogleDataSource;
  resourceId: string;
  resourceName: string;
  periodStart: string;
  periodEnd: string;
  data: unknown;
  syncedAt: string;
}

const SOCIAL_DRAFT_COLUMNS = `
  id::text AS id,
  title,
  prompt,
  channels,
  copy_by_channel AS "copyByChannel",
  image_prompt AS "imagePrompt",
  scheduled_at::text AS "scheduledAt",
  time_zone AS "timeZone",
  status,
  created_at::text AS "createdAt",
  updated_at::text AS "updatedAt"
`;

const RESEARCH_TRACK_COLUMNS = `
  id::text AS id,
  name,
  query_text AS query,
  scopes,
  cadence,
  enabled,
  created_at::text AS "createdAt",
  updated_at::text AS "updatedAt"
`;

const BLOG_POST_COLUMNS = `
  id::text AS id,
  title,
  slug,
  excerpt,
  content_markdown AS "contentMarkdown",
  meta_title AS "metaTitle",
  meta_description AS "metaDescription",
  ai_prompt AS "aiPrompt",
  status,
  created_at::text AS "createdAt",
  updated_at::text AS "updatedAt",
  published_at::text AS "publishedAt"
`;

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

export async function listPublishedBlogPosts(): Promise<BlogPost[]> {
  if (!sql) return [];
  try {
    const rows = await sql`
      SELECT ${sql.unsafe(BLOG_POST_COLUMNS)}
      FROM blog_posts
      WHERE status = 'published'
      ORDER BY published_at DESC
      LIMIT 200
    `;
    return rows as unknown as BlogPost[];
  } catch (error) {
    console.error('Could not read published blog posts:', error);
    return [];
  }
}

export async function getPublishedBlogPost(slug: string): Promise<BlogPost | null> {
  if (!sql) return null;
  try {
    const rows = await sql`
      SELECT ${sql.unsafe(BLOG_POST_COLUMNS)}
      FROM blog_posts
      WHERE slug = ${slug} AND status = 'published'
      LIMIT 1
    `;
    return (rows[0] as unknown as BlogPost | undefined) ?? null;
  } catch (error) {
    console.error('Could not read published blog post:', error);
    return null;
  }
}

export async function listAdminBlogPosts(): Promise<BlogPost[]> {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  const rows = await sql`
    SELECT ${sql.unsafe(BLOG_POST_COLUMNS)}
    FROM blog_posts
    ORDER BY updated_at DESC
  `;
  return rows as unknown as BlogPost[];
}

export async function saveBlogPost(data: BlogPostInput): Promise<BlogPost> {
  if (!sql) throw new Error('DATABASE_URL is not configured.');

  const rows = data.id
    ? await sql`
        UPDATE blog_posts SET
          title = ${data.title},
          slug = ${data.slug},
          excerpt = ${data.excerpt},
          content_markdown = ${data.contentMarkdown},
          meta_title = ${data.metaTitle},
          meta_description = ${data.metaDescription},
          ai_prompt = ${data.aiPrompt},
          status = ${data.status},
          updated_at = NOW(),
          published_at = CASE WHEN ${data.status} = 'published' THEN COALESCE(published_at, NOW()) ELSE NULL END
        WHERE id = ${data.id}::bigint
        RETURNING ${sql.unsafe(BLOG_POST_COLUMNS)}
      `
    : await sql`
        INSERT INTO blog_posts (title, slug, excerpt, content_markdown, meta_title, meta_description, ai_prompt, status, published_at)
        VALUES (
          ${data.title}, ${data.slug}, ${data.excerpt}, ${data.contentMarkdown}, ${data.metaTitle}, ${data.metaDescription}, ${data.aiPrompt}, ${data.status},
          CASE WHEN ${data.status} = 'published' THEN NOW() ELSE NULL END
        )
        RETURNING ${sql.unsafe(BLOG_POST_COLUMNS)}
      `;

  const saved = rows[0] as unknown as BlogPost | undefined;
  if (!saved) throw new Error('Blog post could not be saved.');
  return saved;
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  const rows = await sql`DELETE FROM blog_posts WHERE id = ${id}::bigint RETURNING id`;
  return rows.length > 0;
}

export async function listAdminSocialDrafts(): Promise<AdminSocialDraft[]> {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  const rows = await sql`
    SELECT ${sql.unsafe(SOCIAL_DRAFT_COLUMNS)}
    FROM admin_social_drafts
    ORDER BY updated_at DESC
    LIMIT 200
  `;
  return rows as unknown as AdminSocialDraft[];
}

export async function saveAdminSocialDraft(data: AdminSocialDraftInput): Promise<AdminSocialDraft> {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  const contentJson = JSON.stringify(data.copyByChannel);
  const rows = data.id
    ? await sql`
        UPDATE admin_social_drafts SET
          title = ${data.title},
          prompt = ${data.prompt},
          channels = ${data.channels},
          copy_by_channel = ${contentJson}::jsonb,
          image_prompt = ${data.imagePrompt},
          scheduled_at = ${data.scheduledAt},
          time_zone = ${data.timeZone},
          status = ${data.status},
          updated_at = NOW()
        WHERE id = ${data.id}::bigint
        RETURNING ${sql.unsafe(SOCIAL_DRAFT_COLUMNS)}
      `
    : await sql`
        INSERT INTO admin_social_drafts (title, prompt, channels, copy_by_channel, image_prompt, scheduled_at, time_zone, status)
        VALUES (${data.title}, ${data.prompt}, ${data.channels}, ${contentJson}::jsonb, ${data.imagePrompt}, ${data.scheduledAt}, ${data.timeZone}, ${data.status})
        RETURNING ${sql.unsafe(SOCIAL_DRAFT_COLUMNS)}
      `;
  const saved = rows[0] as unknown as AdminSocialDraft | undefined;
  if (!saved) throw new Error('Social draft could not be saved.');
  return saved;
}

export async function deleteAdminSocialDraft(id: string): Promise<boolean> {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  const rows = await sql`DELETE FROM admin_social_drafts WHERE id = ${id}::bigint RETURNING id`;
  return rows.length > 0;
}

export async function listAdminResearchTracks(): Promise<AdminResearchTrack[]> {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  const rows = await sql`
    SELECT ${sql.unsafe(RESEARCH_TRACK_COLUMNS)}
    FROM admin_research_tracks
    ORDER BY updated_at DESC
    LIMIT 200
  `;
  return rows as unknown as AdminResearchTrack[];
}

export async function saveAdminResearchTrack(data: AdminResearchTrackInput): Promise<AdminResearchTrack> {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  const rows = data.id
    ? await sql`
        UPDATE admin_research_tracks SET
          name = ${data.name},
          query_text = ${data.query},
          scopes = ${data.scopes},
          cadence = ${data.cadence},
          enabled = ${data.enabled},
          updated_at = NOW()
        WHERE id = ${data.id}::bigint
        RETURNING ${sql.unsafe(RESEARCH_TRACK_COLUMNS)}
      `
    : await sql`
        INSERT INTO admin_research_tracks (name, query_text, scopes, cadence, enabled)
        VALUES (${data.name}, ${data.query}, ${data.scopes}, ${data.cadence}, ${data.enabled})
        RETURNING ${sql.unsafe(RESEARCH_TRACK_COLUMNS)}
      `;
  const saved = rows[0] as unknown as AdminResearchTrack | undefined;
  if (!saved) throw new Error('Research monitor could not be saved.');
  return saved;
}

export async function deleteAdminResearchTrack(id: string): Promise<boolean> {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  const rows = await sql`DELETE FROM admin_research_tracks WHERE id = ${id}::bigint RETURNING id`;
  return rows.length > 0;
}

export async function listAdminSubmissions(): Promise<AdminSubmission[]> {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  const rows = await sql`
    SELECT * FROM (
      SELECT
        id::text AS id,
        'contact'::text AS kind,
        name,
        email,
        project_type AS subject,
        budget,
        timeline,
        message,
        ref_code AS reference,
        CASE WHEN status = 'reviewed' THEN 'reviewed' ELSE 'pending' END AS status,
        created_at::text AS "createdAt"
      FROM contact_submissions
      UNION ALL
      SELECT
        id::text AS id,
        'consultation'::text AS kind,
        name,
        email,
        package_scope AS subject,
        funding_goal AS budget,
        timeline,
        details AS message,
        ref_code AS reference,
        CASE WHEN status = 'reviewed' THEN 'reviewed' ELSE 'pending' END AS status,
        created_at::text AS "createdAt"
      FROM consultation_requests
    ) AS submissions
    ORDER BY "createdAt" DESC
  `;
  return rows as unknown as AdminSubmission[];
}

export async function updateAdminSubmissionStatus(
  kind: AdminSubmissionKind,
  id: string,
  status: AdminSubmissionStatus
): Promise<boolean> {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  const rows = kind === 'contact'
    ? await sql`UPDATE contact_submissions SET status = ${status} WHERE id = ${id}::bigint RETURNING id`
    : await sql`UPDATE consultation_requests SET status = ${status} WHERE id = ${id}::bigint RETURNING id`;
  return rows.length > 0;
}

export async function deleteAdminSubmission(kind: AdminSubmissionKind, id: string): Promise<boolean> {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  const rows = kind === 'contact'
    ? await sql`DELETE FROM contact_submissions WHERE id = ${id}::bigint RETURNING id`
    : await sql`DELETE FROM consultation_requests WHERE id = ${id}::bigint RETURNING id`;
  return rows.length > 0;
}

export async function listAdminRankObservations(): Promise<AdminRankObservation[]> {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  const rows = await sql`
    SELECT
      observations.id::text AS id,
      observations.track_id::text AS "trackId",
      tracks.name AS "trackName",
      tracks.query_text AS query,
      observations.source,
      observations.position,
      observations.is_present AS "isPresent",
      observations.result_url AS "resultUrl",
      observations.evidence,
      observations.observed_at::text AS "observedAt"
    FROM admin_rank_observations AS observations
    INNER JOIN admin_research_tracks AS tracks ON tracks.id = observations.track_id
    ORDER BY observations.observed_at DESC
    LIMIT 500
  `;
  return rows as unknown as AdminRankObservation[];
}

export async function saveAdminRankObservation(data: AdminRankObservationInput): Promise<AdminRankObservation | null> {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  const rows = await sql`
    INSERT INTO admin_rank_observations (track_id, source, position, is_present, result_url, evidence)
    VALUES (${data.trackId}::bigint, ${data.source}, ${data.position}, ${data.isPresent}, ${data.resultUrl}, ${data.evidence})
    RETURNING id::text AS id, track_id::text AS "trackId", source, position, is_present AS "isPresent", result_url AS "resultUrl", evidence, observed_at::text AS "observedAt"
  `;
  const saved = rows[0] as unknown as Omit<AdminRankObservation, 'trackName' | 'query'> | undefined;
  if (!saved) return null;
  const tracks = await sql`SELECT name, query_text AS query FROM admin_research_tracks WHERE id = ${saved.trackId}::bigint LIMIT 1`;
  const track = tracks[0] as { name: string; query: string } | undefined;
  return track ? { ...saved, trackName: track.name, query: track.query } : null;
}

export async function deleteAdminRankObservation(id: string): Promise<boolean> {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  const rows = await sql`DELETE FROM admin_rank_observations WHERE id = ${id}::bigint RETURNING id`;
  return rows.length > 0;
}

export async function getAdminGoogleConnection(): Promise<AdminGoogleConnection | null> {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  const rows = await sql`
    SELECT account_email AS "accountEmail",
      encrypted_refresh_token AS "encryptedRefreshToken",
      granted_scopes AS "grantedScopes",
      connected_at::text AS "connectedAt",
      last_synced_at::text AS "lastSyncedAt",
      last_sync_status AS "lastSyncStatus"
    FROM admin_google_connection
    WHERE id = 1
    LIMIT 1
  `;
  return (rows[0] as unknown as AdminGoogleConnection | undefined) ?? null;
}

export async function saveAdminGoogleConnection(data: Omit<AdminGoogleConnection, 'connectedAt' | 'lastSyncedAt' | 'lastSyncStatus'>): Promise<void> {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  await sql`
    INSERT INTO admin_google_connection (id, account_email, encrypted_refresh_token, granted_scopes)
    VALUES (1, ${data.accountEmail}, ${data.encryptedRefreshToken}, ${data.grantedScopes})
    ON CONFLICT (id) DO UPDATE SET
      account_email = EXCLUDED.account_email,
      encrypted_refresh_token = EXCLUDED.encrypted_refresh_token,
      granted_scopes = EXCLUDED.granted_scopes,
      connected_at = NOW(),
      last_synced_at = NULL,
      last_sync_status = ''
  `;
}

export async function disconnectAdminGoogle(): Promise<void> {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  await sql`DELETE FROM admin_google_connection WHERE id = 1`;
}

export async function recordAdminGoogleSync(status: string): Promise<void> {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  await sql`UPDATE admin_google_connection SET last_synced_at = NOW(), last_sync_status = ${status} WHERE id = 1`;
}

export async function saveAdminGoogleSnapshots(snapshots: AdminGoogleSnapshotInput[]): Promise<void> {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  for (const snapshot of snapshots) {
    await sql`
      INSERT INTO admin_google_snapshots (source, resource_id, resource_name, period_start, period_end, data_json)
      VALUES (${snapshot.source}, ${snapshot.resourceId}, ${snapshot.resourceName}, ${snapshot.periodStart}::date, ${snapshot.periodEnd}::date, ${JSON.stringify(snapshot.data)}::jsonb)
    `;
  }
}

export async function listAdminGoogleSnapshots(limit = 60): Promise<AdminGoogleSnapshot[]> {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  const safeLimit = Math.max(1, Math.min(Math.floor(limit), 200));
  const rows = await sql`
    SELECT id::text AS id,
      source,
      resource_id AS "resourceId",
      resource_name AS "resourceName",
      period_start::text AS "periodStart",
      period_end::text AS "periodEnd",
      data_json AS data,
      synced_at::text AS "syncedAt"
    FROM admin_google_snapshots
    ORDER BY synced_at DESC
    LIMIT ${safeLimit}
  `;
  return rows as unknown as AdminGoogleSnapshot[];
}