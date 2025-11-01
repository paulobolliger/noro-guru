import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
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

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: '--font-poppins',
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
    <html lang="pt-BR" className={`dark ${inter.variable} ${poppins.variable}`}>
      <head>
        <Analytics />
        <StructuredData 
          data={[
            getOrganizationSchema(),
            getWebsiteSchema(),
          ]} 
        />
      </head>
      <body className="bg-[#0B1220] font-sans text-[#D1D5F0] min-h-screen overflow-x-hidden antialiased">
        <ToastProvider>
          <ModalProvider>
            {/* Background gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
              <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] bg-[#3B2CA4]/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
              <div className="absolute bottom-[-20%] right-[-20%] w-[50vw] h-[50vw] bg-[#1DD3C0]/10 rounded-full filter blur-3xl animate-pulse-slow animation-delay-2000"></div>
            </div>
            
            <div className="relative z-10 flex flex-col min-h-screen">
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
