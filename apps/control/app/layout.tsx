import RouteProgress from "@/components/layout/RouteProgress";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Brand config for Tailwind CDN */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Lato:wght@400;500&display=swap" rel="stylesheet" />
        <script dangerouslySetInnerHTML={{__html: `
          window.tailwind = window.tailwind || {};
          window.tailwind.config = {
            theme: {
              extend: {
                colors: {
                  primary: { DEFAULT: '#5053C4', dark: '#342CA4' },
                  secondary: { light: '#333176', DEFAULT: '#232452' },
                  core: { DEFAULT: '#1DD3C0' },
                  neutral: { dark: '#12152C' }
                },
                boxShadow: {
                  card: '0 6px 18px rgba(0,0,0,0.06)'
                }
              }
            }
          };
        `}} />
        {/* Tailwind via CDN to bypass local PostCSS/Tailwind issues */}
        <script src="https://cdn.tailwindcss.com"></script>
        <style suppressHydrationWarning>{`
          :root{
            --noro-primary:#5053C4; --noro-primary-dark:#342CA4; --noro-core:#1DD3C0;
          }
          /* Theme tokens */
          [data-theme="dark"]{
            --bg:#0B1220;              /* app background */
            --surface:#0F1629;         /* cards, panels */
            --header-bg:rgba(0,0,0,0.2);
            --text:#E5E7EB;            /* slate-200 */
            --muted:#94A3B8;           /* slate-400 */
            --border:rgba(255,255,255,0.08);
            /* Semantics */
            --success:#22C55E; /* emerald-500 */
            --warning:#F59E0B; /* amber-500 */
            --error:#EF4444;   /* red-500 */
            --info:#38BDF8;    /* sky-400 */
            --success-rgb:34,197,94;
            --warning-rgb:245,158,11;
            --error-rgb:239,68,68;
            --info-rgb:56,189,248;
            --ring: rgba(80,83,196,0.45);
            --ring-strong: rgba(80,83,196,0.65);
          }
          [data-theme="light"]{
            --bg:#F8FAFC;              /* slate-50 */
            --surface:#FFFFFF;         /* white */
            --header-bg:rgba(255,255,255,0.6);
            --text:#0F172A;            /* slate-900 */
            --muted:#475569;           /* slate-600 */
            --border:rgba(15,23,42,0.08);
            /* Semantics */
            --success:#16A34A; /* emerald-600 */
            --warning:#D97706; /* amber-600 */
            --error:#DC2626;   /* red-600 */
            --info:#0EA5E9;    /* sky-500 */
            --success-rgb:22,163,74;
            --warning-rgb:217,119,6;
            --error-rgb:220,38,38;
            --info-rgb:14,165,233;
            --ring: rgba(80,83,196,0.35);
            --ring-strong: rgba(80,83,196,0.55);
          }

          /* Utility surfaces bound to tokens */
          .surface-app{ background:var(--bg); color:var(--text); }
          .surface-card{ background:var(--surface); color:var(--text); border-color:var(--border); }
          .surface-header{ background:var(--header-bg); border-color:var(--border); }
          .surface-sidebar{ background:var(--bg); color:var(--text); }
          .text-primary{ color:var(--text); }
          .text-muted{ color:var(--muted); }
          .border-default{ border-color:var(--border); }
          .theme-transition{ transition: background-color .2s ease, color .2s ease, border-color .2s ease; }
          /* Badges */
          .badge{ display:inline-flex; align-items:center; gap:.375rem; font-size:.75rem; line-height:1; padding:.25rem .5rem; border-radius:9999px; border:1px solid var(--border); background:rgba(255,255,255,0.05); color:var(--text); }
          [data-theme="light"] .badge{ background:rgba(0,0,0,0.03); }
          .badge-success{ color:var(--success); }
          .badge-warning{ color:var(--warning); }
          .badge-error{ color:var(--error); }
          .badge-info{ color:var(--info); }
          /* Alerts */
          .alert{ background:var(--surface); color:var(--text); border:1px solid var(--border); border-radius:12px; padding:12px 14px; display:flex; align-items:flex-start; gap:.5rem; }
          .alert-success{ border-color: rgba(var(--success-rgb),0.35); }
          .alert-warning{ border-color: rgba(var(--warning-rgb),0.35); }
          .alert-error{ border-color: rgba(var(--error-rgb),0.35); }
          .alert-info{ border-color: rgba(var(--info-rgb),0.35); }
          /* Fonts */
          /* Titles/Logo: Coplette Bold (fallback to Inter Bold) */
          @font-face {
            font-family: 'Coplette';
            src: local('Coplette Bold');
            font-weight: 700;
            font-style: normal;
            font-display: swap;
          }
          body { font-family: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-weight: 400; }
          h1,h2,h3,.heading-title,.logo-text { font-family: 'Coplette','Inter', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-weight: 700; }
          /* Subtitles/Buttons: Inter Medium/SemiBold */
          .btn-primary, .link-primary, .subtitle { font-family: 'Inter', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-weight: 600; }
          /* Reports */
          .report-text { font-family: 'Lato', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; font-weight: 400; }
          .btn-primary{ background:#5053C4; color:#fff; }
          .btn-primary:hover{ background:#342CA4; }
          .link-primary{ color:#5053C4 }
          .link-primary:hover{ color:#342CA4 }
          .chip-core{ background:#1DD3C0; color:#0b1f1d }
          /* Sidebar scrollbar styling */
          .noro-sidebar nav{ scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.25) #342CA4; }
          .noro-sidebar nav::-webkit-scrollbar{ width:8px; }
          .noro-sidebar nav::-webkit-scrollbar-track{ background:#342CA4; }
          .noro-sidebar nav::-webkit-scrollbar-thumb{ background: rgba(255,255,255,0.25); border-radius:8px; border:2px solid #342CA4; }
        `}</style>
      </head>
      <body className="surface-app">
        <RouteProgress />
        {children}
      </body>
    </html>
  );
}

