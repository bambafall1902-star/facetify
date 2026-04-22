import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-03-25.basil' as any
})

export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID!