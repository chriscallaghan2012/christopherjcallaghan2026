import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { WEBSITE_CLASS_OFFERS } from '@/lib/websiteClassOffer';

export async function POST(request: Request) {
  if (request.headers.get('origin') !== new URL(request.url).origin) {
    return NextResponse.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Checkout request is invalid.' }, { status: 400 });
  }

  if (!body || typeof body !== 'object' || !('offerId' in body) || Object.keys(body).length !== 1) {
    return NextResponse.json({ error: 'Checkout request is invalid.' }, { status: 400 });
  }

  const offerId = body.offerId;
  if (offerId !== 'session' && offerId !== 'bootcamp') {
    return NextResponse.json({ error: 'Choose a valid class option.' }, { status: 400 });
  }
  const offer = WEBSITE_CLASS_OFFERS[offerId];

  const secretKey = process.env.STRIPE_SECRET_KEY;
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!secretKey || !publishableKey) {
    return NextResponse.json({ error: 'Online checkout is not configured yet. Please contact me to book.' }, { status: 503 });
  }

  try {
    const stripe = new Stripe(secretKey);
    const origin = new URL(request.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      ui_mode: 'embedded',
      line_items: [{
        price_data: {
          currency: offer.currency,
          unit_amount: offer.unitAmount,
          product_data: {
            name: offer.name,
            description: offer.description
          }
        },
        quantity: 1
      }],
      allow_promotion_codes: true,
      return_url: `${origin}/classes?checkout=success&session_id={CHECKOUT_SESSION_ID}`
    });

    if (!session.client_secret) {
      return NextResponse.json({ error: 'Stripe could not start embedded checkout. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ clientSecret: session.client_secret }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Stripe Checkout session creation failed:', error);
    return NextResponse.json({ error: 'Checkout could not be started. Please try again shortly.' }, { status: 502 });
  }
}