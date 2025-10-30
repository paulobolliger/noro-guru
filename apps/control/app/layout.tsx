import "./globals.css";
import RouteProgress from "@/components/layout/RouteProgress";

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
      </body>
    </html>
  );
}

