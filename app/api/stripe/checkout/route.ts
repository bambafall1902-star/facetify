import { NextResponse } from 'next/server'
import { stripe, STRIPE_PRICE_ID } from '@/lib/stripe'

export async function POST() {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
      subscription_data: {
        trial_period_days: 7,
      },
      success_url: `https://improved-garbanzo-69qj75qgwjjpcxrw9-3000.app.github.dev/dashboard?success=true`,
      cancel_url: `https://improved-garbanzo-69qj75qgwjjpcxrw9-3000.app.github.dev/dashboard`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}