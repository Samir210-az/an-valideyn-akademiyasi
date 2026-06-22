import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/payments/stripe-client";
import { getPackageByTier } from "@/lib/payments/packages";
import type { PackageTier } from "@/types";

interface RequestBody {
  tier: PackageTier;
  parentId: string;
  parentEmail: string;
}

export async function POST(req: NextRequest) {
  try {
    const { tier, parentId, parentEmail }: RequestBody = await req.json();
    const pkg = getPackageByTier(tier);

    if (!pkg) {
      return NextResponse.json({ error: "Naməlum paket." }, { status: 400 });
    }

    const priceId = process.env[pkg.stripePriceEnvKey];
    if (!priceId) {
      return NextResponse.json(
        { error: `${pkg.stripePriceEnvKey} env dəyişəni təyin olunmayıb.` },
        { status: 500 }
      );
    }

    const stripe = getStripe();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: parentEmail,
      client_reference_id: parentId,
      metadata: { parentId, tier },
      success_url: `${baseUrl}/parent/dashboard?payment=success`,
      cancel_url: `${baseUrl}/parent/dashboard?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message ?? "Ödəniş sessiyası yaradıla bilmədi." },
      { status: 500 }
    );
  }
}
