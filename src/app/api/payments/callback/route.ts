import { NextRequest, NextResponse } from "next/server";
import { getPayriffOrderInfo } from "@/lib/payments/payriff-client";
import { getAdminDb } from "@/lib/firebase/admin";

/**
 * Payriff ödəniş tamamlandıqdan sonra bu endpoint-ə POST sorğusu göndərir.
 * Təhlükəsizlik üçün callback body-sinə etibar etmirik — orderId ilə
 * Payriff-dən rəsmi statusu yenidən soruşuruq (server-to-server doğrulama).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const orderId: string | undefined = body.orderId ?? body.orderID;

    if (!orderId) {
      return NextResponse.json({ error: "orderId tapılmadı." }, { status: 400 });
    }

    const orderInfo = await getPayriffOrderInfo(orderId);
    const { paymentStatus } = orderInfo.payload;

    // metadata createOrder zamanı göndərilib, lakin order-info cavabında
    // geri qayıtmaya bilər — ona görə callback body-dəki metadata-nı da yoxlayırıq
    const parentId: string | undefined = body.metadata?.parentId;
    const tier: string | undefined = body.metadata?.tier;

    if (paymentStatus === "PAID" && parentId && tier) {
      const db = getAdminDb();
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);

      await db.collection("subscriptions").doc(parentId).set(
        {
          parentId,
          tier,
          status: "active",
          startedAt: new Date().toISOString(),
          expiresAt: expiresAt.toISOString(),
          payriffOrderId: orderId,
        },
        { merge: true }
      );
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message ?? "Callback emal edilmədi." },
      { status: 500 }
    );
  }
}

/**
 * Payriff bəzən GET sorğusu ilə də yönləndirə bilər (uğurlu/uğursuz səhifəyə keçid).
 * Bu halda sadəcə valideyn panelinə yönləndiririk.
 */
export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return NextResponse.redirect(`${baseUrl}/parent/subscription?status=checking`);
}
