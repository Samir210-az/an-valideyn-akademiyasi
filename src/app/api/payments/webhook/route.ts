import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/payments/stripe-client";
import { adminDb } from "@/lib/firebase/admin";
import type Stripe from "stripe";

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Webhook konfiqurasiyası tamamlanmayıb." }, { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return NextResponse.json({ error: `Webhook imza xətası: ${(err as Error).message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const parentId = session.metadata?.parentId;
        const tier = session.metadata?.tier;

        if (parentId && tier) {
          const expiresAt = new Date();
          expiresAt.setMonth(expiresAt.getMonth() + 1);

          await adminDb.collection("subscriptions").doc(parentId).set(
            {
              parentId,
              tier,
              status: "active",
              startedAt: new Date().toISOString(),
              expiresAt: expiresAt.toISOString(),
              stripeSubscriptionId: session.subscription,
            },
            { merge: true }
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const parentId = subscription.metadata?.parentId;
        if (parentId) {
          await adminDb.collection("subscriptions").doc(parentId).update({
            status: "cancelled",
          });
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
