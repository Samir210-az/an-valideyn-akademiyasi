import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://an-valideyn-akademiyasi.vercel.app"),
  title: {
    default: "AN Valideyn Akademiyası",
    template: "%s | AN Valideyn Akademiyası",
  },
  description:
    "Autizm, DEHB, nitq gecikməsi və davranış çətinlikləri olan uşaqların valideynləri üçün sistemli onlayn təlim platforması.",
  keywords: [
    "valideyn akademiyası",
    "autizm təlimi",
    "DEHB valideyn dəstəyi",
    "nitq gecikməsi",
    "davranış çətinlikləri uşaq",
    "valideyn təlim platforması Azərbaycan",
    "onlayn psixoloji təlim Bakı",
    "AN Psixoloji Mərkəz",
  ],
  authors: [{ name: "AN Psixoloji Dəstək və Reabilitasiya Mərkəzi" }],
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "az_AZ",
    url: "https://an-valideyn-akademiyasi.vercel.app",
    siteName: "AN Valideyn Akademiyası",
    title: "AN Valideyn Akademiyası",
    description:
      "Autizm, DEHB, nitq gecikməsi və davranış çətinlikləri olan uşaqların valideynləri üçün sistemli onlayn təlim platforması.",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: "AN Valideyn Akademiyası",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AN Valideyn Akademiyası",
    description:
      "Autizm, DEHB, nitq gecikməsi və davranış çətinlikləri olan uşaqların valideynləri üçün sistemli onlayn təlim platforması.",
    images: ["/icon-512.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AN Akademiya",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "AN Valideyn Akademiyası",
              url: "https://an-valideyn-akademiyasi.vercel.app",
              description:
                "Autizm, DEHB, nitq gecikməsi və davranış çətinlikləri olan uşaqların valideynləri üçün sistemli onlayn təlim platforması.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Bakı",
                addressCountry: "AZ",
              },
              areaServed: "Azərbaycan",
            }),
          }}
        />
        <AuthProvider>
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
