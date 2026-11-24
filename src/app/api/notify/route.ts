import { NextRequest, NextResponse } from "next/server";
import { SITE_URL, field, sendTelegram } from "@/lib/telegram";

const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 5;

/**
 * Yeni valideyn qeydiyyatını Telegram-a bildirir. Mətni server qurur, brauzer yalnız
 * sahələri göndərir; eyni origin və IP başına limit spam-ın qarşısını alır.
 */
export async function POST(req: NextRequest) {
  const origin = req.headers.get("origin") ?? "";
  const host = req.headers.get("host") ?? "";
  if (!origin || origin !== `https://${host}`) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }

  const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "x";
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }
  recent.push(now);
  hits.set(ip, recent);

  const body = await req.json().catch(() => ({}));
  const fullName = String(body.fullName ?? "").trim();
  if (!fullName) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const text =
    "👨‍👩‍👧 Yeni qeydiyyat — AN Valideyn Akademiyası\n" +
    field("Ad", fullName) +
    field("Email", body.email) +
    field("Telefon", body.phone) +
    `Link: ${SITE_URL}`;

  const ok = await sendTelegram(text);
  return NextResponse.json({ ok }, { status: ok ? 200 : 502 });
}
