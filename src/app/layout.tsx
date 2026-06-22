import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "AN Valideyn Akademiyası",
  description:
    "Autizm, DEHB, nitq gecikməsi və davranış çətinlikləri olan uşaqların valideynləri üçün sistemli onlayn təlim platforması.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
