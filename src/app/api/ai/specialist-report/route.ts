import { NextRequest, NextResponse } from "next/server";
import { callOpenAI, AI_SAFETY_PREAMBLE } from "@/lib/ai/groq-client";
import type { DiaryEntry, Assignment } from "@/types";

interface RequestBody {
  childName: string;
  diaryEntries: DiaryEntry[];
  assignments: Assignment[];
}

// Mütəxəssis üçün strukturlaşdırılmış hesabat layihəsi hazırlayır.
// Mütəxəssis bunu nəzərdən keçirib özü təsdiqləyir/redaktə edir — AI son sözü demir.
export async function POST(req: NextRequest) {
  try {
    const { childName, diaryEntries, assignments }: RequestBody = await req.json();

    const diaryText = diaryEntries
      .map((e) => `${e.date}: aqressiya ${e.aggressionLevel}/5, ünsiyyət ${e.communicationLevel}/5, meltdown ${e.meltdownCount}`)
      .join("\n");

    const assignmentText = assignments
      .map((a) => `Status: ${a.status}${a.score !== undefined ? `, bal: ${a.score}` : ""}`)
      .join("\n");

    const content = await callOpenAI([
      { role: "system", content: AI_SAFETY_PREAMBLE },
      {
        role: "user",
        content: `${childName} üçün mütəxəssisin nəzərdən keçirəcəyi hesabat layihəsi hazırla.
Bölmələr: 1) Ümumi icmal 2) Gündəlik qeydlərdən çıxan müşahidələr 3) Tapşırıq icrası göstəriciləri
4) Növbəti həftə üçün təklif olunan fokus sahələri. Diaqnoz qoyma, yalnız müşahidə təqdim et.

Gündəlik qeydlər:
${diaryText || "Qeyd yoxdur"}

Tapşırıqlar:
${assignmentText || "Tapşırıq yoxdur"}`,
      },
    ]);

    return NextResponse.json({ report: content });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message ?? "Xəta baş verdi." },
      { status: 500 }
    );
  }
}
