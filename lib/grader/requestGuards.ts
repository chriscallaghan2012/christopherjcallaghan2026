/**
 * Bounded, per-process guards for public URL-analysis endpoints.
 *
 * These controls reduce bursts and duplicate work within a single server
 * instance. They are not a replacement for distributed rate limiting when
 * the deployment runs multiple instances.
 */
type RateBucket = { timestamps: number[]; touchedAt: number };
type CacheEntry = { expiresAt: number; value: unknown };

const MAX_RATE_BUCKETS = 2_000;
const MAX_CACHE_ENTRIES = 100;
const rateBuckets = new Map<string, RateBucket>();
const activeRequests = new Map<string, number>();
const responseCache = new Map<string, CacheEntry>();

function evictOldest<K, V>(map: Map<K, V>): void {
  const oldest = map.keys().next();
  if (!oldest.done) map.delete(oldest.value);
}

/** Returns true when this scope/IP has reached its sliding-window request limit. */
export function isPublicScanRateLimited(
  scope: string,
  ip: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const key = `${scope}:${ip || 'unknown'}`;
  const previous = rateBuckets.get(key);
  const timestamps = (previous?.timestamps ?? []).filter((time) => now - time < windowMs);
  if (timestamps.length >= limit) {
    rateBuckets.delete(key);
    rateBuckets.set(key, { timestamps, touchedAt: now });
    return true;
  }
  timestamps.push(now);
  if (!previous && rateBuckets.size >= MAX_RATE_BUCKETS) evictOldest(rateBuckets);
  rateBuckets.delete(key);
  rateBuckets.set(key, { timestamps, touchedAt: now });
  return false;
}

/** Acquire an immediate per-instance concurrency slot, or return null if full. */
export function acquirePublicScanSlot(scope: string, maxConcurrent: number): (() => void) | null {
  const active = activeRequests.get(scope) ?? 0;
  if (active >= maxConcurrent) return null;
  activeRequests.set(scope, active + 1);
  let released = false;
  return () => {
    if (released) return;
    released = true;
    const current = activeRequests.get(scope) ?? 0;
    if (current <= 1) activeRequests.delete(scope);
    else activeRequests.set(scope, current - 1);
  };
}

/** Read a short-lived analysis result, removing expired entries as encountered. */
export function getPublicScanCache<T>(scope: string, url: string): T | null {
  const key = `${scope}:${url}`;
  const entry = responseCache.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    responseCache.delete(key);
    return null;
  }
  // Refresh insertion order so the least recently used item is evicted first.
  responseCache.delete(key);
  responseCache.set(key, entry);
  return entry.value as T;
}

/** Cache successful public-page analysis only; never cache errors or contact data. */
export function setPublicScanCache(
  scope: string,
  url: string,
  value: unknown,
  ttlMs = 30_000
): void {
  const now = Date.now();
  for (const [key, entry] of responseCache) {
    if (entry.expiresAt <= now) responseCache.delete(key);
  }
  const key = `${scope}:${url}`;
  if (!responseCache.has(key) && responseCache.size >= MAX_CACHE_ENTRIES) evictOldest(responseCache);
  responseCache.delete(key);
  responseCache.set(key, { expiresAt: now + ttlMs, value });
}
