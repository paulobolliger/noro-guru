// components/admin/AdminFooter.tsx
import packageJson from '@/package.json';
import Link from 'next/link';

export default function AdminFooter() {
  // Lê a versão do build do Vercel, ou usa a versão do package.json como fallback
  const version = process.env.NEXT_PUBLIC_APP_VERSION || packageJson.version;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="surface-card border-t border-default px-8 py-2 text-center text-xs text-muted">
      <div className="flex justify-center items-center gap-x-2">
        <span>&copy; {currentYear} Nomade Guru. Todos os direitos reservados.</span>
        <span className="text-muted">|</span>
        <Link href="/admin/sobre-noro" className="hover:text-blue-600 hover:underline">
          Sobre o NORO
        </Link>
        <span className="text-muted">|</span>
        <span>Versão {version}</span>
      </div>
    </footer>
  );
}
