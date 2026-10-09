import { createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { neon } from '@neondatabase/serverless';
import type Stripe from 'stripe';
import { WEBSITE_CLASS_OFFERS, type WebsiteClassOfferId } from '@/lib/websiteClassOffer';

const databaseUrl = process.env.DATABASE_URL;
const sql = databaseUrl ? neon(databaseUrl) : null;

export const CUSTOMER_SESSION_COOKIE = 'cjc_customer_session';
export const CUSTOMER_SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export interface CustomerAccount {
  id: string;
  name: string;
  email: string;
}

export interface CustomerPurchase {
  id: string;
  offerId: WebsiteClassOfferId;
  offerName: string;
  amount: number;
  currency: string;
  status: 'paid';
  createdAt: string;
}

function requireDatabase() {
  if (!sql) throw new Error('DATABASE_URL is not configured.');
  return sql;
}

function getSessionSecret(): string {
  const secret = process.env.CUSTOMER_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('CUSTOMER_SESSION_SECRET must contain at least 32 characters.');
  }
  return secret;
}

export function isCustomerAuthConfigured(): boolean {
  return Boolean(databaseUrl && process.env.CUSTOMER_SESSION_SECRET && process.env.CUSTOMER_SESSION_SECRET.length >= 32);
}

function derivePasswordHash(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const hash = await derivePasswordHash(password, salt);
  return `scrypt$${salt}$${hash.toString('hex')}`;
}

async function verifyPassword(password: string, encodedHash: string): Promise<boolean> {
  const [algorithm, salt, storedHash] = encodedHash.split('$');
  if (algorithm !== 'scrypt' || !salt || !/^[a-f0-9]{128}$/i.test(storedHash ?? '')) return false;

  const actualHash = await derivePasswordHash(password, salt);
  const expectedHash = Buffer.from(storedHash, 'hex');
  return actualHash.length === expectedHash.length && timingSafeEqual(actualHash, expectedHash);
}

export async function createCustomerAccount(input: {
  name: string;
  email: string;
  password: string;
}): Promise<CustomerAccount | null> {
  const database = requireDatabase();
  const passwordHash = await hashPassword(input.password);
  const rows = await database`
    INSERT INTO customer_accounts (name, email, password_hash)
    VALUES (${input.name}, ${input.email.toLowerCase()}, ${passwordHash})
    ON CONFLICT (email) DO NOTHING
    RETURNING id::text AS id, name, email
  `;
  return (rows[0] as CustomerAccount | undefined) ?? null;
}

export async function authenticateCustomer(email: string, password: string): Promise<CustomerAccount | null> {
  const database = requireDatabase();
  const rows = await database`
    SELECT id::text AS id, name, email, password_hash AS "passwordHash"
    FROM customer_accounts
    WHERE email = ${email.toLowerCase()}
    LIMIT 1
  `;
  const account = rows[0] as (CustomerAccount & { passwordHash: string }) | undefined;

  if (!account) {
    const dummyHash = await derivePasswordHash(password, 'cjc-customer-login-dummy-salt');
    timingSafeEqual(dummyHash, Buffer.alloc(dummyHash.length));
    return null;
  }

  return await verifyPassword(password, account.passwordHash)
    ? { id: account.id, name: account.name, email: account.email }
    : null;
}

export async function consumeCustomerLoginAttempt(email: string): Promise<boolean> {
  const database = requireDatabase();
  const emailDigest = createHmac('sha256', getSessionSecret()).update(email.toLowerCase()).digest('hex');
  const rows = await database`
    INSERT INTO customer_login_attempts (email_digest, attempts, window_started_at)
    VALUES (${emailDigest}, 1, NOW())
    ON CONFLICT (email_digest) DO UPDATE SET
      attempts = CASE
        WHEN customer_login_attempts.window_started_at <= NOW() - INTERVAL '15 minutes' THEN 1
        ELSE customer_login_attempts.attempts + 1
      END,
      window_started_at = CASE
        WHEN customer_login_attempts.window_started_at <= NOW() - INTERVAL '15 minutes' THEN NOW()
        ELSE customer_login_attempts.window_started_at
      END
    RETURNING attempts
  `;
  return Number(rows[0]?.attempts) <= 10;
}

export async function clearCustomerLoginAttempts(email: string): Promise<void> {
  const database = requireDatabase();
  const emailDigest = createHmac('sha256', getSessionSecret()).update(email.toLowerCase()).digest('hex');
  await database`DELETE FROM customer_login_attempts WHERE email_digest = ${emailDigest}`;
}

function signSession(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function createCustomerSessionToken(customerId: string): string {
  const expiry = String(Math.floor(Date.now() / 1000) + CUSTOMER_SESSION_MAX_AGE);
  const payload = `${customerId}.${expiry}`;
  return `${Buffer.from(payload).toString('base64url')}.${signSession(payload, getSessionSecret())}`;
}

function readCustomerIdFromSession(request: Request): string | null {
  let secret: string;
  try {
    secret = getSessionSecret();
  } catch {
    return null;
  }

  const cookieHeader = request.headers.get('cookie') || '';
  const cookie = cookieHeader.split(';').map((item) => item.trim()).find((item) => item.startsWith(`${CUSTOMER_SESSION_COOKIE}=`));
  if (!cookie) return null;

  try {
    const token = decodeURIComponent(cookie.slice(CUSTOMER_SESSION_COOKIE.length + 1));
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) return null;

    const payload = Buffer.from(encodedPayload, 'base64url').toString();
    const [customerId, expiry] = payload.split('.');
    if (!customerId || !expiry || !/^\d+$/.test(expiry) || Number(expiry) <= Date.now() / 1000) return null;

    const expected = Buffer.from(signSession(payload, secret));
    const received = Buffer.from(signature);
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null;
    return customerId;
  } catch {
    return null;
  }
}

export async function getCustomerSession(request: Request): Promise<CustomerAccount | null> {
  const customerId = readCustomerIdFromSession(request);
  if (!customerId) return null;

  const database = requireDatabase();
  const rows = await database`
    SELECT id::text AS id, name, email
    FROM customer_accounts
    WHERE id = ${customerId}::uuid
    LIMIT 1
  `;
  return (rows[0] as CustomerAccount | undefined) ?? null;
}

export async function listCustomerPurchases(customerId: string): Promise<CustomerPurchase[]> {
  const database = requireDatabase();
  const rows = await database`
    SELECT
      id::text AS id,
      offer_id AS "offerId",
      offer_name AS "offerName",
      amount,
      currency,
      status,
      created_at::text AS "createdAt"
    FROM customer_purchases
    WHERE customer_id = ${customerId}::uuid
    ORDER BY created_at DESC
    LIMIT 100
  `;
  return rows as unknown as CustomerPurchase[];
}

export async function recordPaidCustomerPurchase(session: Stripe.Checkout.Session): Promise<void> {
  if (session.payment_status !== 'paid') return;
  const customerId = session.metadata?.customerId;
  const offerId = session.metadata?.offerId;
  if (!customerId || (offerId !== 'session' && offerId !== 'bootcamp')) {
    throw new Error('Stripe Checkout session is missing valid customer or offer metadata.');
  }

  const offer = WEBSITE_CLASS_OFFERS[offerId as WebsiteClassOfferId];
  if (session.amount_total !== offer.unitAmount || session.currency !== offer.currency) {
    throw new Error('Stripe Checkout session amount does not match the configured offer.');
  }

  const database = requireDatabase();
  const paymentIntentId = typeof session.payment_intent === 'string'
    ? session.payment_intent
    : session.payment_intent?.id ?? null;
  await database`
    INSERT INTO customer_purchases (
      customer_id, stripe_checkout_session_id, stripe_payment_intent_id,
      offer_id, offer_name, amount, currency, status
    )
    VALUES (
      ${customerId}::uuid, ${session.id}, ${paymentIntentId},
      ${offerId}, ${offer.name}, ${session.amount_total}, ${session.currency}, 'paid'
    )
    ON CONFLICT (stripe_checkout_session_id) DO UPDATE SET
      status = 'paid',
      stripe_payment_intent_id = EXCLUDED.stripe_payment_intent_id,
      updated_at = NOW()
  `;
}
