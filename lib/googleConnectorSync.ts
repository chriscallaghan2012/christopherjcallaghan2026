import type { AdminGoogleSnapshotInput, GoogleDataSource } from './database';

interface GoogleResponse {
  [key: string]: unknown;
}

export interface GoogleSyncResult {
  snapshots: AdminGoogleSnapshotInput[];
  sources: Partial<Record<GoogleDataSource, { count: number; error?: string }>>;
  periodStart: string;
  periodEnd: string;
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function reportWindow() {
  const today = new Date();
  const end = new Date(today);
  end.setUTCDate(end.getUTCDate() - 1);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 27);
  return { periodStart: isoDate(start), periodEnd: isoDate(end) };
}

async function googleJson(url: string, accessToken: string, body?: object): Promise<GoogleResponse> {
  const response = await fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      ...(body ? { 'Content-Type': 'application/json' } : {})
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(15000)
  });
  if (!response.ok) throw new Error(`Google API request failed (${response.status}).`);
  return await response.json() as GoogleResponse;
}

function queryParamList(base: string, key: string, values: string[]): string {
  const url = new URL(base);
  for (const value of values) url.searchParams.append(key, value);
  return url.toString();
}

async function syncGa4(accessToken: string, periodStart: string, periodEnd: string): Promise<AdminGoogleSnapshotInput[]> {
  const summaries = await googleJson('https://analyticsadmin.googleapis.com/v1beta/accountSummaries?pageSize=200', accessToken);
  const properties = (summaries.accountSummaries as Array<{ account?: string; displayName?: string; propertySummaries?: Array<{ property?: string; displayName?: string }> }> | undefined)
    ?.flatMap((account) => (account.propertySummaries ?? []).map((property) => ({
      id: property.property ?? '',
      name: property.displayName || account.displayName || property.property || 'GA4 property'
    })))
    .filter((property) => property.id.startsWith('properties/')) ?? [];

  const snapshots: AdminGoogleSnapshotInput[] = [];
  for (const property of properties) {
    const streamsResult = await googleJson(`https://analyticsadmin.googleapis.com/v1beta/${property.id}/dataStreams?pageSize=200`, accessToken);
    const streams = (streamsResult.dataStreams as Array<{ webStreamData?: { measurementId?: string } }> | undefined) ?? [];
    const measurementIds = streams.flatMap((stream) => stream.webStreamData?.measurementId ? [stream.webStreamData.measurementId] : []);
    const report = await googleJson(`https://analyticsdata.googleapis.com/v1beta/${property.id}:runReport`, accessToken, {
      dateRanges: [{ startDate: '28daysAgo', endDate: 'yesterday' }],
      dimensions: [{ name: 'date' }, { name: 'pagePath' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'conversions' },
        { name: 'totalRevenue' }
      ],
      limit: '10000'
    });
    snapshots.push({
      source: 'ga4',
      resourceId: property.id,
      resourceName: property.name,
      periodStart,
      periodEnd,
      data: { measurementIds, report }
    });
  }
  return snapshots;
}

async function syncTagManager(accessToken: string, periodStart: string, periodEnd: string): Promise<AdminGoogleSnapshotInput[]> {
  const accountsResult = await googleJson('https://tagmanager.googleapis.com/tagmanager/v2/accounts', accessToken);
  const accounts = (accountsResult.account as Array<{ name?: string; accountId?: string }> | undefined) ?? [];
  const snapshots: AdminGoogleSnapshotInput[] = [];

  for (const account of accounts) {
    if (!account.name) continue;
    const containersResult = await googleJson(`https://tagmanager.googleapis.com/tagmanager/v2/${account.name}/containers`, accessToken);
    const containers = (containersResult.container as Array<Record<string, unknown> & { containerId?: string; name?: string; publicId?: string }> | undefined) ?? [];
    for (const container of containers) {
      const publicId = container.publicId ?? container.containerId ?? '';
      snapshots.push({
        source: 'gtm',
        resourceId: publicId,
        resourceName: container.name || publicId || 'Tag Manager container',
        periodStart,
        periodEnd,
        data: { accountId: account.accountId, ...container }
      });
    }
  }

  return snapshots;
}

async function syncSearchConsole(accessToken: string, periodStart: string, periodEnd: string): Promise<AdminGoogleSnapshotInput[]> {
  const siteList = await googleJson('https://www.googleapis.com/webmasters/v3/sites', accessToken);
  const sites = (siteList.siteEntry as Array<{ siteUrl?: string; permissionLevel?: string }> | undefined) ?? [];
  const snapshots: AdminGoogleSnapshotInput[] = [];
  for (const site of sites) {
    if (!site.siteUrl) continue;
    const encodedSite = encodeURIComponent(site.siteUrl);
    const report = await googleJson(`https://www.googleapis.com/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`, accessToken, {
      startDate: periodStart,
      endDate: periodEnd,
      dimensions: ['query', 'page', 'device', 'country'],
      rowLimit: 25000,
      dataState: 'final'
    });
    snapshots.push({
      source: 'gsc',
      resourceId: site.siteUrl,
      resourceName: site.siteUrl,
      periodStart,
      periodEnd,
      data: { permissionLevel: site.permissionLevel, report }
    });
  }
  return snapshots;
}

function addRepeatedQueryValues(url: URL, key: string, values: string[]) {
  for (const value of values) url.searchParams.append(key, value);
}

async function syncBusinessProfile(accessToken: string, periodStart: string, periodEnd: string): Promise<AdminGoogleSnapshotInput[]> {
  const accountsResponse = await googleJson('https://mybusinessaccountmanagement.googleapis.com/v1/accounts', accessToken);
  const accounts = (accountsResponse.accounts as Array<{ name?: string; accountName?: string }> | undefined) ?? [];
  const snapshots: AdminGoogleSnapshotInput[] = [];
  const start = new Date(`${periodStart}T00:00:00Z`);
  const end = new Date(`${periodEnd}T00:00:00Z`);
  const metrics = [
    'BUSINESS_IMPRESSIONS_DESKTOP_MAPS',
    'BUSINESS_IMPRESSIONS_DESKTOP_SEARCH',
    'BUSINESS_IMPRESSIONS_MOBILE_MAPS',
    'BUSINESS_IMPRESSIONS_MOBILE_SEARCH',
    'BUSINESS_DIRECTION_REQUESTS',
    'CALL_CLICKS',
    'WEBSITE_CLICKS'
  ];

  for (const account of accounts) {
    if (!account.name) continue;
    const accountId = account.name.split('/').pop();
    if (!accountId) continue;
    const locationUrl = new URL(`https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${encodeURIComponent(accountId)}/locations`);
    locationUrl.searchParams.set('readMask', 'name,title,storeCode,websiteUri,phoneNumbers,metadata');
    locationUrl.searchParams.set('pageSize', '100');
    const locationResponse = await googleJson(locationUrl.toString(), accessToken);
    const locations = (locationResponse.locations as Array<{ name?: string; title?: string; websiteUri?: string; storeCode?: string }> | undefined) ?? [];

    for (const location of locations) {
      if (!location.name) continue;
      const locationId = location.name.split('/').pop();
      if (!locationId) continue;
      const metricsUrl = new URL(`https://businessprofileperformance.googleapis.com/v1/locations/${encodeURIComponent(locationId)}:fetchMultiDailyMetricsTimeSeries`);
      addRepeatedQueryValues(metricsUrl, 'dailyMetrics', metrics);
      for (const [prefix, date] of [['dailyRange.startDate', start], ['dailyRange.endDate', end]] as const) {
        metricsUrl.searchParams.set(`${prefix}.year`, String(date.getUTCFullYear()));
        metricsUrl.searchParams.set(`${prefix}.month`, String(date.getUTCMonth() + 1));
        metricsUrl.searchParams.set(`${prefix}.day`, String(date.getUTCDate()));
      }
      let performance: GoogleResponse;
      try {
        performance = await googleJson(metricsUrl.toString(), accessToken);
      } catch (error) {
        performance = { unavailable: error instanceof Error ? error.message : 'Performance data unavailable.' };
      }
      snapshots.push({
        source: 'gbp',
        resourceId: location.name,
        resourceName: location.title || location.name,
        periodStart,
        periodEnd,
        data: { accountName: account.accountName, location, performance }
      });
    }
  }
  return snapshots;
}

export async function syncGoogleConnectorData(accessToken: string): Promise<GoogleSyncResult> {
  const { periodStart, periodEnd } = reportWindow();
  const sources: GoogleSyncResult['sources'] = {};
  const snapshots: AdminGoogleSnapshotInput[] = [];
  const providers: Array<[GoogleDataSource, () => Promise<AdminGoogleSnapshotInput[]>]> = [
    ['ga4', () => syncGa4(accessToken, periodStart, periodEnd)],
    ['gtm', () => syncTagManager(accessToken, periodStart, periodEnd)],
    ['gsc', () => syncSearchConsole(accessToken, periodStart, periodEnd)],
    ['gbp', () => syncBusinessProfile(accessToken, periodStart, periodEnd)]
  ];

  for (const [source, sync] of providers) {
    try {
      const results = await sync();
      snapshots.push(...results);
      sources[source] = { count: results.length };
    } catch (error) {
      sources[source] = { count: 0, error: error instanceof Error ? error.message : 'Provider sync failed.' };
    }
  }

  return { snapshots, sources, periodStart, periodEnd };
}
