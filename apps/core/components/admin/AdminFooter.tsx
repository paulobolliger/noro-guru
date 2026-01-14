// components/admin/AdminFooter.tsx
import packageJson from '@/../package.json';
import Link from 'next/link';

interface AdminFooterProps {
  footerColor?: string;
}

export default function AdminFooter({ footerColor }: AdminFooterProps) {
  // Lê a versão do build do Vercel, ou usa a versão do package.json como fallback
  const version = process.env.NEXT_PUBLIC_APP_VERSION || packageJson.version;
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-white/10 px-8 py-3 text-center text-xs text-slate-300 font-medium"
      style={{ backgroundColor: footerColor || '#232452' }}
    >
      <div className="flex justify-center items-center gap-x-2">
        <span className="font-bold text-white">&copy; {currentYear} Noro Tecnologia. Todos os direitos reservados.</span>
        <span className="text-white/20">|</span>
        <Link href="/sobre-noro" className="hover:text-white hover:underline transition-colors font-bold">
          Sobre o NORO
        </Link>
        <span className="text-white/20">|</span>
        <span className="font-bold opacity-80">Versão {version}</span>
      </div>
    </footer>
  );
}