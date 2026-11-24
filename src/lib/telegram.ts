export const SITE_URL = "https://akademiya.aze-ai.az";

function clean(value: unknown, max = 120): string {
  return String(value ?? "")
    .replace(/[\u0000-\u0009\u000b-\u001f]/g, " ")
    .trim()
    .slice(0, max);
}

export function field(label: string, value: unknown): string {
  const v = clean(value);
  return v ? `${label}: ${v}\n` : "";
}

export async function sendTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: text.slice(0, 1000) }),
  });
  return res.ok;
}
