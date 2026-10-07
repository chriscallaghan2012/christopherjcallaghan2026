import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { WEBSITE_CLASS_OFFER } from '@/lib/websiteClassOffer';

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

  if (!body || typeof body !== 'object' || Object.keys(body).length !== 0) {
    return NextResponse.json({ error: 'Checkout request is invalid.' }, { status: 400 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: 'Online checkout is not configured yet. Please contact me to book.' }, { status: 503 });
  }

  try {
    const stripe = new Stripe(secretKey);
    const origin = new URL(request.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: WEBSITE_CLASS_OFFER.currency,
          unit_amount: WEBSITE_CLASS_OFFER.unitAmount,
          product_data: {
            name: WEBSITE_CLASS_OFFER.name,
            description: WEBSITE_CLASS_OFFER.description
          }
        },
        quantity: 1
      }],
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