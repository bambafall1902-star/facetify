import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = (await headers()).get('stripe-signature')!

  let event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as any
      const customerId = session.customer

      // Trouver l'utilisateur via le customer Stripe
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (profile) {
        await supabaseAdmin.from('profiles').update({
          subscription_status: 'active',
          subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        }).eq('id', profile.id)
      }
      break
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object as any
      const customerId = sub.customer

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (profile) {
        await supabaseAdmin.from('profiles').update({
          subscription_status: sub.status,
          subscription_end_date: new Date(sub.current_period_end * 1000).toISOString()
        }).eq('id', profile.id)
      }
      break
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as any
      const customerId = sub.customer

      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single()

      if (profile) {
        await supabaseAdmin.from('profiles').update({
          subscription_status: 'inactive'
        }).eq('id', profile.id)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}