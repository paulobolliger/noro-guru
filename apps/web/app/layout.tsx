import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./global.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ModalProvider } from "@/components/providers/modal-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: "700",
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "NORO - Intelligent Core",
  description: "O cérebro por trás do seu negócio. Um hub de inteligência, automação e dados para negócios modernos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="bg-noro-dark font-sans text-noro-gray-light min-h-screen overflow-x-hidden">
        <ModalProvider>
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-20%] left-[-20%] w-[60vw] h-[60vw] bg-noro-purple/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-[-20%] right-[-20%] w-[50vw] h-[50vw] bg-noro-turquoise/10 rounded-full filter blur-3xl animate-pulse-slow animation-delay-2000"></div>
          </div>
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ModalProvider>
      </body>
    </html>
  );
}
