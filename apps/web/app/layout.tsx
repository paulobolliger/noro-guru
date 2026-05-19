import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces, JetBrains_Mono } from "next/font/google";
import "./global.css";
import "../styles/theme.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ModalProvider } from "@/components/providers/modal-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import Analytics from "@/components/Analytics";
import CookieConsent from "@/components/CookieConsent";
import StructuredData from "@/components/StructuredData";
import { getOrganizationSchema, getWebsiteSchema } from "@/lib/schema";

const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: '--font-display',
  display: 'swap',
  axes: ['opsz', 'WONK'],
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "NORO – Gestão Empresarial Completa com IA",
  description: "CRM, ERP, Financeiro e Automação em uma única plataforma. Aumente produtividade, reduza custos e escale seu negócio com inteligência artificial.",
  openGraph: {
    title: "NORO – Gestão Empresarial Completa com IA",
    description: "A plataforma que une CRM, ERP e Automação com IA para transformar sua gestão.",
    images: ["/og-noro.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable}`}>
      <head>
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
        <StructuredData
          data={[
            getOrganizationSchema(),
            getWebsiteSchema(),
          ]}
        />
      </head>
      <body className="bg-white font-sans text-[#1f2433] min-h-screen overflow-x-hidden antialiased" style={{ fontFamily: 'var(--font-sans, system-ui)' }}>
        <ToastProvider>
          <ModalProvider>
            <div className="relative flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
            <CookieConsent />
          </ModalProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
