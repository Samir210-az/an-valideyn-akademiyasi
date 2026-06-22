// OpenAI API ilə server-side əlaqə.
// VACİB: AI heç vaxt diaqnoz qoymur, yalnız müşahidə əsaslı icmal/tövsiyə verir.

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export const AI_SAFETY_PREAMBLE = `
Sən "AN Valideyn Akademiyası" platformasının köməkçi AI analitikasısan.
QAYDALAR (mütləq riayət et):
1. HEÇ VAXT diaqnoz qoyma, diaqnozu təsdiq/inkar etmə.
2. Yalnız valideynin daxil etdiyi məlumatlar (gündəlik qeydlər, tapşırıq icrası) əsasında
   təsviri/müşahidə xarakterli xülasə ver.
3. Tibbi termin işlətmə, "bu simptomdur" kimi ifadələrdən çəkin.
4. Hər zaman valideynə mütəxəssislə əlaqə saxlamağı tövsiyə et, əgər narahatedici tendensiya varsa.
5. Cavabı Azərbaycan dilində, sadə və isti tonda yaz.
`.trim();

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callOpenAI(messages: ChatMessage[]): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY tapılmadı. .env.local-a əlavə edin.");
  }

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.4,
      max_tokens: 700,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API xətası: ${response.status} ${errText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? "";
}
