import assert from 'node:assert/strict';
import {
  acquirePublicScanSlot,
  getPublicScanCache,
  isPublicScanRateLimited,
  setPublicScanCache
} from '../lib/grader/requestGuards';

const scope = `request-guards-test-${process.pid}`;

assert.equal(isPublicScanRateLimited(scope, '192.0.2.10', 2, 60_000), false);
assert.equal(isPublicScanRateLimited(scope, '192.0.2.10', 2, 60_000), false);
assert.equal(isPublicScanRateLimited(scope, '192.0.2.10', 2, 60_000), true);
assert.equal(isPublicScanRateLimited(scope, '192.0.2.11', 2, 60_000), false, 'rate limits are isolated by IP');

const release = acquirePublicScanSlot(scope, 1);
assert.equal(typeof release, 'function');
assert.equal(acquirePublicScanSlot(scope, 1), null, 'rejects concurrency beyond the configured cap');
release?.();
release?.();
assert.equal(typeof acquirePublicScanSlot(scope, 1), 'function', 'released slots can be reused');
const finalRelease = acquirePublicScanSlot(`${scope}-second`, 1);
finalRelease?.();

const cachedValue = { success: true, findings: 3 };
setPublicScanCache(scope, 'https://example.com', cachedValue, 30_000);
assert.deepEqual(getPublicScanCache(scope, 'https://example.com'), cachedValue);
assert.equal(getPublicScanCache(scope, 'https://other.example'), null, 'cache keys include the URL');
setPublicScanCache(scope, 'https://expired.example', { success: true }, 0);
assert.equal(getPublicScanCache(scope, 'https://expired.example'), null, 'expired entries are not returned');

console.log('Public scan request guard tests passed.');
