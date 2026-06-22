import { NextRequest, NextResponse } from "next/server";
import { generateCertificateNumber, generateCertificatePdf } from "@/lib/certificate";

interface RequestBody {
  childId: string;
  childName: string;
}

export async function POST(req: NextRequest) {
  try {
    const { childId, childName }: RequestBody = await req.json();

    if (!childId || !childName) {
      return NextResponse.json({ error: "childId və childName tələb olunur." }, { status: 400 });
    }

    const certificateNumber = generateCertificateNumber(childId);
    const issuedDate = new Date().toLocaleDateString("az-AZ");
    const verifyUrl = `https://an-valideyn-akademiyasi.example.com/verify/${certificateNumber}`;

    const pdfBytes = await generateCertificatePdf({
      childName,
      certificateNumber,
      issuedDate,
      verifyUrl,
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="sertifikat-${certificateNumber}.pdf"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message ?? "Sertifikat generasiyasında xəta." },
      { status: 500 }
    );
  }
}
