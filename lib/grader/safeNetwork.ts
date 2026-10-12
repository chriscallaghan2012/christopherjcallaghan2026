/**
 * SSRF-safe HTTP fetching for the Website Grader.
 *
 * All outbound requests go through this module so that submitted URLs and
 * any redirects are treated as untrusted input:
 *  - Only http/https destinations.
 *  - Hostnames are resolved with `dns.lookup` and every resolved address is
 *    checked against private, loopback, link-local, reserved and cloud
 *    metadata ranges. If ANY address is blocked, the request is refused.
 *  - The resolved (verified) address is pinned via a custom `lookup` so DNS
 *    rebinding cannot redirect the connection to a different host.
 *  - Every redirect hop is re-validated against the same rules.
 *  - Response size is capped, compressed bodies are decoded safely, and each
 *    request has a hard timeout.
 */

import http from 'node:http';
import https from 'node:https';
import dns from 'node:dns/promises';
import net from 'node:net';
import zlib from 'node:zlib';
import { promisify } from 'node:util';
import { normalizeTargetUrl, validateTargetUrl } from './validate';

const gunzip = promisify(zlib.gunzip);
const inflate = promisify(zlib.inflate);
const inflateRaw = promisify(zlib.inflateRaw);
const brotliDecompress = promisify(zlib.brotliDecompress);

export class SafeNetworkError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = 'SafeNetworkError';
    this.code = code;
  }
}

/** Test/local development escape hatch. Defaults OFF everywhere. */
function allowPrivateNetworks(): boolean {
  return process.env.ALLOW_PRIVATE_NETWORK_SCANS === 'true';
}

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'localhost.localdomain',
  'broadcasthost',
  'ip6-localhost',
  'ip6-loopback',
  'ip6-localnet',
  'ip6-mcastprefix',
  'ip6-allnodes',
  'ip6-allrouters'
]);
const BLOCKED_HOST_SUFFIXES = ['.localhost', '.local', '.internal', '.home.arpa', '.lan'];

export function isBlockedHostname(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/\.$/, '');
  if (BLOCKED_HOSTNAMES.has(h)) return true;
  if (BLOCKED_HOST_SUFFIXES.some((suffix) => h.endsWith(suffix))) return true;
  // Numeric hostnames are validated separately as IPs.
  return false;
}

function ipv4Blocked(a: number, b: number, c: number, d: number): boolean {
  const v = ((a << 24) | (b << 16) | (c << 8) | d) >>> 0;
  const inRange = (lo: number, hi: number) => v >= (lo >>> 0) && v <= (hi >>> 0);
  // 0.0.0.0/8
  if (inRange(0x00000000, 0x00ffffff)) return true;
  // 10.0.0.0/8
  if (inRange(0x0a000000, 0x0affffff)) return true;
  // 100.64.0.0/10 (CGNAT)
  if (inRange(0x64400000, 0x647fffff)) return true;
  // 127.0.0.0/8 (loopback)
  if (inRange(0x7f000000, 0x7fffffff)) return true;
  // 169.254.0.0/16 (link-local, includes cloud metadata 169.254.169.254)
  if (inRange(0xa9fe0000, 0xa9feffff)) return true;
  // 172.16.0.0/12
  if (inRange(0xac100000, 0xac1fffff)) return true;
  // 192.0.0.0/24 (IETF protocol assignments)
  if (inRange(0xc0000000, 0xc00000ff)) return true;
  // 192.0.2.0/24 (TEST-NET-1)
  if (inRange(0xc0000200, 0xc00002ff)) return true;
  // 192.168.0.0/16
  if (inRange(0xc0a80000, 0xc0a8ffff)) return true;
  // 198.18.0.0/15 (benchmarking)
  if (inRange(0xc6120000, 0xc633ffff)) return true;
  // 198.51.100.0/24 (TEST-NET-2)
  if (inRange(0xc6336400, 0xc63364ff)) return true;
  // 203.0.113.0/24 (TEST-NET-3)
  if (inRange(0xcb007100, 0xcb0071ff)) return true;
  // 224.0.0.0/4 multicast, 240.0.0.0/4 reserved, 255.255.255.255 broadcast
  if (inRange(0xe0000000, 0xffffffff)) return true;
  return false;
}

export function isIpBlocked(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const parts = ip.split('.').map(Number);
    return ipv4Blocked(parts[0], parts[1], parts[2], parts[3]);
  }
  if (net.isIPv6(ip)) {
    const lower = ip.toLowerCase();
    // Unspecified and loopback
    if (lower === '::' || lower === '::1') return true;
    // IPv4-mapped IPv6 (::ffff:a.b.c.d) — check embedded IPv4
    const v4mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    if (v4mapped) {
      const parts = v4mapped[1].split('.').map(Number);
      return ipv4Blocked(parts[0], parts[1], parts[2], parts[3]);
    }
    // link-local fe80::/10
    if (lower.startsWith('fe80:')) return true;
    // unique local fc00::/7
    if (lower.startsWith('fc') || lower.startsWith('fd')) return true;
    // multicast ff00::/8
    if (lower.startsWith('ff')) return true;
    // site-local fec0::/10 (deprecated)
    if (lower.startsWith('fec0:')) return true;
    // documentation 2001:db8::/32
    if (lower.startsWith('2001:db8:')) return true;
    return false;
  }
  return true; // unparseable → treat as blocked
}

async function resolveAndValidate(hostname: string): Promise<string> {
  if (isBlockedHostname(hostname)) {
    throw new SafeNetworkError('ERR_BLOCKED', 'This destination is not allowed.');
  }
  if (net.isIP(hostname)) {
    if (shouldBlockIp(hostname)) {
      throw new SafeNetworkError('ERR_BLOCKED', 'This destination is not allowed.');
    }
    return hostname;
  }

  let records: Array<{ address: string; family: number }>;
  try {
    records = await dns.lookup(hostname, { all: true, verbatim: true });
  } catch {
    throw new SafeNetworkError('ERR_DNS', 'The domain could not be resolved.');
  }
  if (!records.length) {
    throw new SafeNetworkError('ERR_DNS', 'The domain could not be resolved.');
  }

  for (const record of records) {
    if (shouldBlockIp(record.address)) {
      throw new SafeNetworkError('ERR_BLOCKED', 'This destination is not allowed.');
    }
  }
  // Prefer IPv4 for connection stability, otherwise the first verified address.
  const chosen = records.find((r) => net.isIPv4(r.address)) ?? records[0];
  return chosen.address;
}
interface LookupCallback {
  (err: Error | null, address?: string, family?: number): void;
}

/**
 * Returns a `lookup` function for `http.request` that pins DNS to a single
 * verified address. Because the lookup is invoked for every connection a
 * request chain makes, redirects to other hosts are validated too.
 */
function createPinnedLookup(cache: Map<string, Promise<string>>) {
  return (hostname: string, _options: unknown, callback: LookupCallback) => {
    const h = hostname.toLowerCase().replace(/\.$/, '');
    if (isBlockedHostname(h)) {
      callback(new SafeNetworkError('ERR_BLOCKED', 'This destination is not allowed.'));
      return;
    }
    if (net.isIP(h)) {
      if (shouldBlockIp(h)) {
        callback(new SafeNetworkError('ERR_BLOCKED', 'This destination is not allowed.'));
        return;
      }
      callback(null, h, net.isIPv4(h) ? 4 : 6);
      return;
    }

    let pending = cache.get(h);
    if (!pending) {
      pending = resolveAndValidate(h);
      cache.set(h, pending);
    }
    pending.then(
      (address) => callback(null, address, net.isIPv4(address) ? 4 : 6),
      (err) => callback(err instanceof Error ? err : new Error(String(err)))
    );
  };
}

export interface SafeResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: Buffer;
  finalUrl: string;
  redirectChain: string[];
  errorCode?: string;
}

export interface SafeRequestOptions {
  method?: 'GET' | 'HEAD';
  timeoutMs?: number;
  maxRedirects?: number;
  maxBytes?: number;
  headers?: Record<string, string>;
  userAgent?: string;
  /** When true, redirect responses (3xx with Location) are followed. */
  followRedirects?: boolean;
}

const DEFAULT_USER_AGENT = 'Mozilla/5.0 (compatible; CJCSiteGrader/1.0; +https://christopherjcallaghan.com/tools/website-grader)';

function requestOnce(
  currentUrl: URL,
  method: 'GET' | 'HEAD',
  headers: Record<string, string>,
  timeoutMs: number,
  maxBytes: number,
  lookup: ReturnType<typeof createPinnedLookup>
): Promise<{ status: number; statusText: string; headers: Record<string, string>; body: Buffer }> {
  return new Promise((resolve, reject) => {
    const isHttps = currentUrl.protocol === 'https:';
    const lib = isHttps ? https : http;
    const options: https.RequestOptions = {
      hostname: currentUrl.hostname,
      port: currentUrl.port || (isHttps ? 443 : 80),
      path: currentUrl.pathname + currentUrl.search,
      method,
      headers: { ...headers, Host: currentUrl.host },
      lookup: lookup as https.RequestOptions['lookup'],
      servername: isHttps ? currentUrl.hostname : undefined,
      rejectUnauthorized: true,
      timeout: timeoutMs
    };

    const req = lib.request(options, (res) => {
      const headers: Record<string, string> = {};
      for (const [key, value] of Object.entries(res.headers)) {
        if (typeof value === 'string') headers[key.toLowerCase()] = value;
        else if (Array.isArray(value)) headers[key.toLowerCase()] = value.join(', ');
      }

      if (method === 'HEAD') {
        res.resume();
        resolve({ status: res.statusCode ?? 0, statusText: res.statusMessage ?? '', headers, body: Buffer.alloc(0) });
        return;
      }

      const chunks: Buffer[] = [];
      let total = 0;
      let aborted = false;
      res.on('data', (chunk: Buffer) => {
        total += chunk.length;
        if (total > maxBytes) {
          aborted = true;
          req.destroy(new SafeNetworkError('ERR_TOO_LARGE', 'The page is too large to analyse.'));
          return;
        }
        chunks.push(chunk);
      });
      res.on('end', () => {
        if (aborted) return;
        resolve({ status: res.statusCode ?? 0, statusText: res.statusMessage ?? '', headers, body: Buffer.concat(chunks) });
      });
      res.on('error', (err) => reject(err));
    });

    req.on('timeout', () => {
      req.destroy(new SafeNetworkError('ERR_TIMEOUT', 'The request timed out.'));
    });
    req.on('error', (err) => {
      const code = (err as NodeJS.ErrnoException).code || '';
      if (code === 'ERR_TOO_LARGE') {
        reject(err);
      } else if (code === 'ERR_BLOCKED') {
        reject(new SafeNetworkError('ERR_BLOCKED', 'This destination is not allowed.'));
      } else if (code === 'ERR_TIMEOUT' || code === 'ETIMEDOUT') {
        reject(new SafeNetworkError('ERR_TIMEOUT', 'The request timed out.'));
      } else if (code === 'ENOTFOUND' || code === 'EAI_AGAIN') {
        reject(new SafeNetworkError('ERR_DNS', 'The domain could not be resolved.'));
      } else if (
        code === 'DEPTH_ZERO_SELF_SIGNED_CERT' ||
        code === 'SELF_SIGNED_CERT_IN_CHAIN' ||
        code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE' ||
        code === 'CERT_HAS_EXPIRED' ||
        code === 'ERR_TLS_CERT_ALTNAME_INVALID' ||
        code.startsWith('CERT_') ||
        code.startsWith('ERR_TLS_')
      ) {
        reject(new SafeNetworkError('ERR_TLS', 'The site has a TLS/certificate problem.'));
      } else if (code === 'ECONNREFUSED') {
        reject(new SafeNetworkError('ERR_CONNECTION', 'The site refused the connection.'));
      } else if (code === 'ECONNRESET') {
        reject(new SafeNetworkError('ERR_CONNECTION', 'The connection was reset.'));
      } else {
        reject(new SafeNetworkError('ERR_NETWORK', 'The site could not be reached.'));
      }
    });

    req.end();
  });
}
function decodeBody(body: Buffer, contentEncoding: string | undefined): Promise<Buffer> {
  const encoding = (contentEncoding || '').toLowerCase().trim();
  try {
    if (encoding.includes('br')) return brotliDecompress(body) as Promise<Buffer>;
    if (encoding.includes('gzip')) return gunzip(body) as Promise<Buffer>;
    if (encoding.includes('deflate')) {
      return inflate(body).catch(() => inflateRaw(body)) as Promise<Buffer>;
    }
  } catch {
    // fall through to raw body
  }
  return Promise.resolve(body);
}

/** True when the IP must be refused; honours the private-network test flag. */
function shouldBlockIp(ip: string): boolean {
  return allowPrivateNetworks() ? false : isIpBlocked(ip);
}

/**
 * Fetches a URL safely. Redirects are followed with a fresh validation on
 * every hop (the pinned lookup re-runs for each destination host).
 */
export async function safeFetch(rawUrl: string, options: SafeRequestOptions = {}): Promise<SafeResponse> {
  const validationError = validateTargetUrl(rawUrl);
  if (validationError) throw new SafeNetworkError('ERR_INVALID', validationError);
  const normalized = normalizeTargetUrl(rawUrl);
  if (!normalized) throw new SafeNetworkError('ERR_INVALID', 'Invalid URL.');

  const timeoutMs = options.timeoutMs ?? 12000;
  const maxRedirects = options.maxRedirects ?? 5;
  const maxBytes = options.maxBytes ?? 3 * 1024 * 1024;
  const method = options.method ?? 'GET';
  const followRedirects = options.followRedirects ?? true;
  const cache = new Map<string, Promise<string>>();
  const lookup = createPinnedLookup(cache);
  const userAgent = options.userAgent || DEFAULT_USER_AGENT;

  const headers: Record<string, string> = {
    'User-Agent': userAgent,
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-GB,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    Connection: 'close',
    ...(options.headers || {})
  };

  let currentUrl = new URL(normalized.url);
  const redirectChain: string[] = [currentUrl.toString()];
  let redirects = 0;

  // Apply an overall deadline for the whole request chain.
  const deadline = Date.now() + Math.max(timeoutMs, 8000) * 2;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (Date.now() > deadline) {
      throw new SafeNetworkError('ERR_TIMEOUT', 'The request timed out.');
    }
    const remaining = Math.max(1000, deadline - Date.now());
    const hopTimeout = Math.min(timeoutMs, remaining);

    const response = await requestOnce(currentUrl, method, headers, hopTimeout, maxBytes, lookup);
    const location = (response.headers['location'] || '').trim();

    const isRedirect = response.status >= 300 && response.status < 400 && location;
    if (isRedirect && followRedirects) {
      if (redirects >= maxRedirects) {
        throw new SafeNetworkError('ERR_REDIRECTS', 'Too many redirects.');
      }
      let next: URL;
      try {
        next = new URL(location, currentUrl);
      } catch {
        throw new SafeNetworkError('ERR_REDIRECT', 'The site returned an invalid redirect.');
      }
      if (next.protocol !== 'http:' && next.protocol !== 'https:') {
        throw new SafeNetworkError('ERR_REDIRECT', 'The site redirected to an unsupported protocol.');
      }
      // Re-validate the redirect destination (private IPs, localhost etc.)
      const destError = validateTargetUrl(next.toString());
      if (destError) throw new SafeNetworkError('ERR_REDIRECT', 'The site redirected to an invalid destination.');
      await resolveAndValidate(next.hostname).catch(() => {
        throw new SafeNetworkError('ERR_REDIRECT', 'The site redirected to a blocked or unresolvable destination.');
      });

      currentUrl = next;
      redirectChain.push(next.toString());
      redirects += 1;
      continue;
    }

    const body = await decodeBody(response.body, response.headers['content-encoding']);
    return {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      body,
      finalUrl: currentUrl.toString(),
      redirectChain,
      ...(response.status >= 400 ? { errorCode: `HTTP_${response.status}` } : {})
    };
  }
}

/** Convenience: HEAD-style link check that tolerates most failures. */
export async function checkLinkStatus(url: string, options: SafeRequestOptions = {}): Promise<{ url: string; status: number | null; ok: boolean; error?: string }> {
  try {
    const res = await safeFetch(url, {
      method: 'HEAD',
      timeoutMs: 5000,
      maxBytes: 64 * 1024,
      maxRedirects: 3,
      followRedirects: false,
      ...options
    });
    // HEAD may not be supported; fall back to a tiny GET if 405/501/403.
    if (res.status === 405 || res.status === 501 || res.status === 403) {
      const get = await safeFetch(url, {
        method: 'GET',
        timeoutMs: 5000,
        maxBytes: 32 * 1024,
        maxRedirects: 3,
        followRedirects: false,
        ...options
      });
      return { url, status: get.status, ok: get.status >= 200 && get.status < 400, ...(get.status >= 400 ? { error: `HTTP_${get.status}` } : {}) };
    }
    return { url, status: res.status, ok: res.status >= 200 && res.status < 400, ...(res.status >= 400 ? { error: `HTTP_${res.status}` } : {}) };
  } catch (err) {
    const code = err instanceof SafeNetworkError ? err.code : 'ERR_NETWORK';
    return { url, status: null, ok: false, error: code };
  }
}


export interface TlsProbeResult {
  valid: boolean;
  error?: string;
  issuedTo?: string;
  issuer?: string;
  validFrom?: string;
  validTo?: string;
  daysToExpiry?: number;
}

/**
 * Probes the TLS certificate of an https URL. First tries a strict
 * (certificate-validating) connection; if that fails for a TLS reason, it
 * reconnects with validation disabled ONLY to read the peer certificate so
 * the audit can report expiry/hostname details. No page content is used.
 */
export async function probeTls(rawUrl: string, timeoutMs = 5000): Promise<TlsProbeResult> {
  const normalized = normalizeTargetUrl(rawUrl);
  if (!normalized || !normalized.url.startsWith('https://')) {
    return { valid: false, error: 'Not an HTTPS URL.' };
  }
  const url = new URL(normalized.url);
  if (isBlockedHostname(url.hostname)) return { valid: false, error: 'Blocked destination.' };

  const readCertificate = (strict: boolean) => new Promise<{ ok: boolean; error?: string; cert?: any }>((resolve) => {
    const cache = new Map<string, Promise<string>>();
    const lookup = createPinnedLookup(cache);
    const req = https.request({
      hostname: url.hostname,
      port: url.port || 443,
      path: '/',
      method: 'HEAD',
      headers: { Host: url.host },
      lookup: lookup as http.RequestOptions['lookup'],
      servername: url.hostname,
      rejectUnauthorized: strict,
      timeout: timeoutMs
    }, (res) => {
      const socket = res.socket as import('node:tls').TLSSocket | undefined;
      const cert = socket?.getPeerCertificate();
      res.resume();
      resolve({ ok: true, cert });
    });
    req.on('timeout', () => req.destroy(new Error('timeout')));
    req.on('error', (err) => {
      const code = (err as NodeJS.ErrnoException).code || '';
      const isTls = code === 'DEPTH_ZERO_SELF_SIGNED_CERT'
        || code === 'SELF_SIGNED_CERT_IN_CHAIN'
        || code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE'
        || code === 'CERT_HAS_EXPIRED'
        || code === 'ERR_TLS_CERT_ALTNAME_INVALID'
        || code.startsWith('CERT_')
        || code.startsWith('ERR_TLS_');
      resolve({ ok: false, error: isTls ? 'invalid certificate' : (err instanceof Error ? err.message : 'error'), cert: undefined });
    });
    req.end();
  });

  // Strict check first.
  const strict = await readCertificate(true);
  if (strict.ok) {
    const cert = strict.cert;
    const validTo = cert?.valid_to ? new Date(cert.valid_to) : null;
    const daysToExpiry = validTo && !Number.isNaN(validTo.getTime())
      ? Math.max(0, Math.round((validTo.getTime() - Date.now()) / 86400000))
      : undefined;
    return {
      valid: true,
      issuedTo: cert?.subject?.CN,
      issuer: cert?.issuer?.CN,
      validFrom: cert?.valid_from,
      validTo: cert?.valid_to,
      daysToExpiry
    };
  }

  // TLS problem: connect leniently just to read the certificate details.
  if (strict.error === 'invalid certificate') {
    const lenient = await readCertificate(false);
    if (lenient.ok && lenient.cert && lenient.cert.valid_to) {
      return {
        valid: false,
        error: 'Certificate could not be validated (expired, wrong host, or untrusted chain).',
        issuedTo: lenient.cert.subject?.CN,
        issuer: lenient.cert.issuer?.CN,
        validFrom: lenient.cert.valid_from,
        validTo: lenient.cert.valid_to
      };
    }
    return { valid: false, error: 'Certificate could not be validated.' };
  }
  return { valid: false, error: strict.error ?? 'TLS probe failed.' };
}

/** Probes whether the plain-HTTP version of a URL redirects to HTTPS. */
export async function probeHttpRedirect(rawUrl: string, timeoutMs = 5000): Promise<{ status: number | null; redirected: boolean; error?: string }> {
  const normalized = normalizeTargetUrl(rawUrl);
  if (!normalized) return { status: null, redirected: false, error: 'invalid URL' };
  const url = new URL(normalized.url);
  url.protocol = 'http:';
  url.port = '';
  try {
    const res = await safeFetch(url.toString(), {
      method: 'GET',
      timeoutMs,
      maxBytes: 64 * 1024,
      maxRedirects: 0,
      followRedirects: false
    });
    const location = (res.headers['location'] || '').toLowerCase();
    const redirected = res.status >= 300 && res.status < 400 && (location.includes('https://') || location.startsWith('//'));
    return { status: res.status, redirected };
  } catch (err) {
    const code = err instanceof SafeNetworkError ? err.code : 'ERR_NETWORK';
    return { status: null, redirected: false, error: code };
  }
}

