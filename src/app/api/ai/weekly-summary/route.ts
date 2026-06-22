import { NextRequest, NextResponse } from "next/server";
import { callOpenAI, AI_SAFETY_PREAMBLE } from "@/lib/ai/groq-client";
import type { DiaryEntry } from "@/types";

interface RequestBody {
  childName: string;
  diaryEntries: DiaryEntry[];
}

export async function POST(req: NextRequest) {
  try {
    const { childName, diaryEntries }: RequestBody = await req.json();

    if (!diaryEntries || diaryEntries.length === 0) {
      return NextResponse.json(
        { error: "Xülasə hazırlamaq üçün kifayət qədər gündəlik qeyd yoxdur." },
        { status: 400 }
      );
    }

    const summaryInput = diaryEntries
      .map(
        (e) =>
          `Tarix: ${e.date} | Yuxu: ${e.sleepQuality}/5 | Qidalanma: ${e.nutrition}/5 | ` +
          `Aqressiya: ${e.aggressionLevel}/5 | Meltdown sayı: ${e.meltdownCount} | ` +
          `Ünsiyyət: ${e.communicationLevel}/5 | Tapşırıq icrası: ${e.taskCompletion}/5` +
          (e.notes ? ` | Qeyd: ${e.notes}` : "")
      )
      .join("\n");

    const content = await callOpenAI([
      { role: "system", content: AI_SAFETY_PREAMBLE },
      {
        role: "user",
        content: `${childName} adlı uşaq üçün aşağıdakı son günlərin gündəlik qeydlərinə əsasən
həftəlik inkişaf xülasəsi hazırla. Müsbət dəyişiklikləri, diqqət çəkən tendensiyaları və
valideyn üçün 2-3 praktiki tövsiyəni qeyd et:\n\n${summaryInput}`,
      },
    ]);

    return NextResponse.json({ summary: content });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message ?? "Xəta baş verdi." },
      { status: 500 }
    );
  }
}
