import { NextRequest, NextResponse } from "next/server";
import { callOpenAI, AI_SAFETY_PREAMBLE } from "@/lib/ai/groq-client";
import type { DiaryEntry } from "@/types";

interface RequestBody {
  childName: string;
  diaryEntries: DiaryEntry[];
}

// Bu endpoint diaqnoz qoymur — yalnız davranış nümunələrindəki dəyişiklikləri
// (məs. meltdown sayının artması, ünsiyyətin azalması) qeyd edir və
// mütəxəssislə əlaqəyə yönləndirir.
export async function POST(req: NextRequest) {
  try {
    const { childName, diaryEntries }: RequestBody = await req.json();

    if (!diaryEntries || diaryEntries.length < 3) {
      return NextResponse.json(
        { error: "Tendensiya aşkarlamaq üçün ən azı 3 günlük qeyd lazımdır." },
        { status: 400 }
      );
    }

    const summaryInput = diaryEntries
      .map(
        (e) =>
          `${e.date}: Aqressiya ${e.aggressionLevel}/5, Meltdown ${e.meltdownCount}, ` +
          `Ünsiyyət ${e.communicationLevel}/5, Yuxu ${e.sleepQuality}/5`
      )
      .join("\n");

    const content = await callOpenAI([
      { role: "system", content: AI_SAFETY_PREAMBLE },
      {
        role: "user",
        content: `${childName} üçün aşağıdakı son qeydlərdə diqqət çəkməli ola biləcək
tendensiyaları (məs. göstəricilərin pisləşməsi) müşahidə xarakterli şəkildə qeyd et.
Əgər ciddi narahatlıq yaradan bir trend varsa, valideynə mütəxəssislə əlaqə saxlamağı
aydın şəkildə tövsiyə et. Diaqnoz qoyma, yalnız müşahidələri təsvir et:\n\n${summaryInput}`,
      },
    ]);

    return NextResponse.json({ riskNotes: content });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message ?? "Xəta baş verdi." },
      { status: 500 }
    );
  }
}
