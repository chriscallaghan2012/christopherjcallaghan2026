import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const PRICE_ENV_KEYS = {
  one_to_one: 'STRIPE_PRICE_ONE_TO_ONE',
  build_together: 'STRIPE_PRICE_BUILD_TOGETHER'
} as const;

type ClassProduct = keyof typeof PRICE_ENV_KEYS;

export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Choose a class before continuing.' }, { status: 400 });
  }

  const product = body && typeof body === 'object' && 'product' in body ? body.product : null;
  if (product !== 'one_to_one' && product !== 'build_together') {
    return NextResponse.json({ error: 'Choose a valid class option.' }, { status: 400 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env[PRICE_ENV_KEYS[product as ClassProduct]];
  if (!secretKey || !priceId) {
    return NextResponse.json({ error: 'Online checkout is not configured yet. Please contact me to book.' }, { status: 503 });
  }

  try {
    const stripe = new Stripe(secretKey);
    const origin = new URL(request.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${origin}/classes?checkout=success`,
      cancel_url: `${origin}/classes?checkout=cancelled`
    });

    if (!session.url) {
      return NextResponse.json({ error: 'Stripe could not create a checkout link. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ url: session.url }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Stripe Checkout session creation failed:', error);
    return NextResponse.json({ error: 'Checkout could not be started. Please try again shortly.' }, { status: 502 });
  }
}