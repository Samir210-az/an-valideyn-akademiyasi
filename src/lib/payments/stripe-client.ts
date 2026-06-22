import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY tapılmadı. .env.local-a əlavə edin.");
    stripeInstance = new Stripe(key);
  }
  return stripeInstance;
}
