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
  /** True when a single immediate retry is worthwhile (reset mid-flight). */
  retryable: boolean;
  constructor(code: string, message: string, retryable = false) {
    super(message);
    this.name = 'SafeNetworkError';
    this.code = code;
    this.retryable = retryable;
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

function parseIpv6Words(ip: string): number[] | null {
  let address = ip.toLowerCase().split('%')[0];
  if (!address) return null;

  // Expand a dotted IPv4 tail (for example ::ffff:192.0.2.1) into two words.
  if (address.includes('.')) {
    const lastColon = address.lastIndexOf(':');
    const ipv4Tail = address.slice(lastColon + 1);
    if (!net.isIPv4(ipv4Tail)) return null;
    const [a, b, c, d] = ipv4Tail.split('.').map(Number);
    const high = ((a << 8) | b).toString(16);
    const low = ((c << 8) | d).toString(16);
    address = `${address.slice(0, lastColon)}:${high}:${low}`;
  }

  const compression = address.indexOf('::');
  let parts: string[];
  if (compression >= 0) {
    const left = address.slice(0, compression).split(':').filter(Boolean);
    const right = address.slice(compression + 2).split(':').filter(Boolean);
    const missing = 8 - left.length - right.length;
    if (missing < 1) return null;
    parts = [...left, ...Array(missing).fill('0'), ...right];
  } else {
    parts = address.split(':');
    if (parts.length !== 8) return null;
  }

  if (parts.length !== 8 || parts.some((part) => !/^[0-9a-f]{1,4}$/i.test(part))) return null;
  return parts.map((part) => Number.parseInt(part, 16));
}

export function isIpBlocked(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const parts = ip.split('.').map(Number);
    return ipv4Blocked(parts[0], parts[1], parts[2], parts[3]);
  }
  if (!net.isIPv6(ip)) return true;

  const words = parseIpv6Words(ip);
  if (!words || words.length !== 8) return true;
  const allZeroPrefix = (length: number) => words.slice(0, length).every((word) => word === 0);

  // Unspecified, loopback and deprecated IPv4-compatible addresses.
  if (allZeroPrefix(8) || (allZeroPrefix(7) && words[7] === 1)) return true;
  if (allZeroPrefix(6)) return true;

  // IPv4-mapped IPv6: check the embedded IPv4 address in both dotted and
  // hexadecimal forms, e.g. ::ffff:127.0.0.1 and ::ffff:7f00:1.
  if (allZeroPrefix(5) && words[5] === 0xffff) {
    const embeddedV4 = [
      (words[6] >> 8) & 0xff,
      words[6] & 0xff,
      (words[7] >> 8) & 0xff,
      words[7] & 0xff
    ];
    return ipv4Blocked(embeddedV4[0], embeddedV4[1], embeddedV4[2], embeddedV4[3]);
  }

  const first = words[0];
  // Unique-local fc00::/7, link-local fe80::/10, deprecated site-local fec0::/10.
  if ((first & 0xfe00) === 0xfc00) return true;
  if ((first & 0xffc0) === 0xfe80) return true;
  if ((first & 0xffc0) === 0xfec0) return true;
  // Multicast ff00::/8.
  if ((first & 0xff00) === 0xff00) return true;

  // Special-purpose / translation ranges that should not be probed as public
  // website destinations (IANA IPv6 special-purpose address space).
  if (first === 0x0064 && words[1] === 0xff9b && words[2] === 0 && words[3] === 0 && words[4] === 0 && words[5] === 0) return true; // 64:ff9b::/96 NAT64
  if (first === 0x0064 && words[1] === 0xff9b && words[2] === 1) return true; // 64:ff9b:1::/48 local-use NAT64
  if (first === 0x0100 && words[1] === 0 && words[2] === 0 && words[3] === 0) return true; // 100::/64 discard-only
  if (first === 0x2001 && words[1] <= 0x01ff) return true; // 2001::/23 protocol assignments
  if (first === 0x2001 && words[1] === 0x0db8) return true; // 2001:db8::/32 documentation
  if (first === 0x2002) return true; // 2002::/16 6to4
  // Only global-unicast 2000::/3 is accepted; other unicast ranges are
  // reserved, unspecified for public routing, or special-purpose.
  if ((first & 0xe000) !== 0x2000) return true;

  return false;
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
  (err: Error | null, address: string, family: number): void;
  (err: Error | null, addresses: Array<{ address: string; family: number }>): void;
  (err: Error): void;
}

/**
 * Returns a `lookup` function for `http.request` that pins DNS to a single
 * verified address. Because the lookup is invoked for every connection a
 * request chain makes, redirects to other hosts are validated too.
 *
 * Node's default `autoSelectFamily` (Happy Eyeballs) invokes `lookup` with
 * `{ all: true }` and expects an array of `{ address, family }`. We honour
 * that contract exactly, while still returning only the single address we
 * already validated — so DNS pinning / SSRF protection is preserved.
 */
function createPinnedLookup(cache: Map<string, Promise<string>>) {
  const emit = (
    options: unknown,
    callback: LookupCallback,
    address: string
  ): void => {
    const family = net.isIPv4(address) ? 4 : 6;
    if (options && typeof options === 'object' && (options as { all?: boolean }).all) {
      (callback as (err: Error | null, addresses: Array<{ address: string; family: number }>) => void)(
        null,
        [{ address, family }]
      );
      return;
    }
    (callback as (err: Error | null, address: string, family: number) => void)(null, address, family);
  };

  return (hostname: string, options: unknown, callback: LookupCallback) => {
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
      emit(options, callback, h);
      return;
    }

    let pending = cache.get(h);
    if (!pending) {
      pending = resolveAndValidate(h);
      cache.set(h, pending);
    }
    pending.then(
      (address) => emit(options, callback, address),
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
      } else if (code === 'ECONNRESET' || code === 'EPIPE') {
        reject(new SafeNetworkError('ERR_CONNECTION', 'The connection was reset.', true));
      } else {
        reject(new SafeNetworkError('ERR_NETWORK', 'The site could not be reached.', true));
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

/** Strips IPv6 brackets ("[::1]" -> "::1") so isIP()/blocking work. */
function stripBrackets(hostname: string): string {
  return hostname.startsWith('[') && hostname.endsWith(']') ? hostname.slice(1, -1) : hostname;
}

/**
 * Authoritative per-hop SSRF guard. `net.connect` does NOT invoke the custom
 * `lookup` for IP-literal hosts, so private/loopback/metadata IPs written
 * directly (e.g. http://169.254.169.254/) would otherwise be connected to.
 * This blocks them before any socket is opened.
 */
function assertDestinationAllowed(url: URL): void {
  const raw = stripBrackets(url.hostname.toLowerCase().replace(/\.$/, ''));
  if (isBlockedHostname(raw)) {
    throw new SafeNetworkError('ERR_BLOCKED', 'This destination is not allowed.');
  }
  if (net.isIP(raw) && shouldBlockIp(raw)) {
    throw new SafeNetworkError('ERR_BLOCKED', 'This destination is not allowed.');
  }
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
  // Block private/loopback/metadata IP literals before any socket is opened
  // (the custom lookup only guards DNS names, not literal IPs).
  assertDestinationAllowed(currentUrl);
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

    // Re-assert on every hop so a redirect to a literal private IP is blocked.
    assertDestinationAllowed(currentUrl);
    let response;
    try {
      response = await requestOnce(currentUrl, method, headers, hopTimeout, maxBytes, lookup);
    } catch (err) {
      // A single retry covers flaky first connections (keep-alive race, TLS
      // blip, Happy-Eyeballs attempt) so reachable sites are not misreported.
      const retryable = err instanceof SafeNetworkError && err.retryable && Date.now() + 1500 < deadline;
      if (!retryable) throw err;
      await new Promise((resolve) => setTimeout(resolve, 400));
      response = await requestOnce(currentUrl, method, headers, Math.max(1000, deadline - Date.now()), maxBytes, lookup);
    }
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

