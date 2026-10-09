import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { recordPaidCustomerPurchase } from '@/lib/customerAccounts';

export async function POST(request: Request) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secretKey || !webhookSecret) {
    return NextResponse.json({ error: 'Stripe webhook is not configured.' }, { status: 503 });
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json({ error: 'Stripe signature is required.' }, { status: 400 });
  }

  const stripe = new Stripe(secretKey);
  let event: Stripe.Event;
  try {
    const payload = await request.text();
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error('Stripe webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid Stripe webhook signature.' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    try {
      await recordPaidCustomerPurchase(event.data.object as Stripe.Checkout.Session);
    } catch (error) {
      console.error('Could not record Stripe Checkout purchase:', error);
      return NextResponse.json({ error: 'Purchase could not be recorded.' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
