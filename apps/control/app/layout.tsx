import "./globals.css";
import RouteProgress from "@/components/layout/RouteProgress";
import { ToastContainer } from "@/components/ui/ToastContainer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="surface-app">
        <RouteProgress />
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}

