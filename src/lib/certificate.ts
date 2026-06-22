import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import QRCode from "qrcode";

export function generateCertificateNumber(childId: string): string {
  const year = new Date().getFullYear();
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `AN-${year}-${childId.slice(0, 4).toUpperCase()}-${random}`;
}

interface CertificateData {
  childName: string;
  certificateNumber: string;
  issuedDate: string;
  verifyUrl: string;
}

/**
 * Sertifikat PDF-i generasiya edir, QR kodu daxil edir.
 * Qaytarılan dəyər: PDF-in bytes (Uint8Array) formatı.
 */
export async function generateCertificatePdf(data: CertificateData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 landscape

  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Çərçivə
  page.drawRectangle({
    x: 20,
    y: 20,
    width: 802,
    height: 555,
    borderColor: rgb(0.31, 0.27, 0.9),
    borderWidth: 3,
  });

  page.drawText("SERTİFİKAT", {
    x: 320,
    y: 480,
    size: 32,
    font,
    color: rgb(0.31, 0.27, 0.9),
  });

  page.drawText("AN Valideyn Akademiyası", {
    x: 320,
    y: 440,
    size: 14,
    font: regularFont,
    color: rgb(0.4, 0.4, 0.4),
  });

  page.drawText(`Bu sertifikat təsdiq edir ki,`, {
    x: 280,
    y: 370,
    size: 13,
    font: regularFont,
  });

  page.drawText(data.childName, {
    x: 280,
    y: 335,
    size: 24,
    font,
    color: rgb(0.1, 0.1, 0.1),
  });

  page.drawText("12 həftəlik Valideyn Akademiyası proqramını uğurla tamamlamışdır.", {
    x: 200,
    y: 300,
    size: 13,
    font: regularFont,
  });

  page.drawText(`Sertifikat №: ${data.certificateNumber}`, {
    x: 60,
    y: 90,
    size: 11,
    font: regularFont,
    color: rgb(0.4, 0.4, 0.4),
  });

  page.drawText(`Tarix: ${data.issuedDate}`, {
    x: 60,
    y: 70,
    size: 11,
    font: regularFont,
    color: rgb(0.4, 0.4, 0.4),
  });

  // QR kod
  const qrDataUrl = await QRCode.toDataURL(data.verifyUrl, { margin: 0, width: 160 });
  const qrImageBytes = Buffer.from(qrDataUrl.split(",")[1], "base64");
  const qrImage = await pdfDoc.embedPng(qrImageBytes);
  page.drawImage(qrImage, { x: 680, y: 50, width: 100, height: 100 });

  return pdfDoc.save();
}
