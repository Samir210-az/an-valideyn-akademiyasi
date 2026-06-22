import { NextRequest, NextResponse } from "next/server";
import { createPayriffOrder } from "@/lib/payments/payriff-client";
import { getPackageByTier } from "@/lib/payments/packages";
import type { PackageTier } from "@/types";

interface RequestBody {
  tier: PackageTier;
  parentId: string;
}

export async function POST(req: NextRequest) {
  try {
    const { tier, parentId }: RequestBody = await req.json();
    const pkg = getPackageByTier(tier);

    if (!pkg) {
      return NextResponse.json({ error: "Naməlum paket." }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    const order = await createPayriffOrder({
      amount: pkg.priceAzn,
      description: `AN Valideyn Akademiyası — ${pkg.name} paketi (aylıq abunəlik)`,
      callbackUrl: `${baseUrl}/api/payments/callback`,
      metadata: { parentId, tier },
    });

    return NextResponse.json({
      paymentUrl: order.payload.paymentUrl,
      orderId: order.payload.orderId,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message ?? "Ödəniş sifarişi yaradıla bilmədi." },
      { status: 500 }
    );
  }
}
