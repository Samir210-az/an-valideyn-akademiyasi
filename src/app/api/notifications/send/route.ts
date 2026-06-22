import { NextRequest, NextResponse } from "next/server";
import { sendPushToTokens } from "@/lib/firebase/send-push";
import { getAdminDb } from "@/lib/firebase/admin";

interface RequestBody {
  title: string;
  body: string;
  target: "all" | "parent" | "specialist";
}

/**
 * Admin tərəfindən göndərilən bildirişi uyğun rola malik bütün istifadəçilərin
 * FCM token-lərinə (əgər varsa) push notification olaraq çatdırır.
 */
export async function POST(req: NextRequest) {
  try {
    const { title, body, target }: RequestBody = await req.json();
    const db = getAdminDb();

    let usersQuery = db.collection("users") as FirebaseFirestore.Query;
    if (target !== "all") {
      usersQuery = usersQuery.where("role", "==", target);
    }

    const snap = await usersQuery.get();
    const tokens = snap.docs
      .map((d) => d.data().fcmToken as string | undefined)
      .filter((t): t is string => Boolean(t));

    const result = await sendPushToTokens(tokens, title, body);

    return NextResponse.json({
      sentTo: tokens.length,
      successCount: result.successCount,
      failureCount: result.failureCount,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message ?? "Bildiriş göndərilmədi." },
      { status: 500 }
    );
  }
}
