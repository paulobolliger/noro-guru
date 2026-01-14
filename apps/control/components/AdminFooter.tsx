import packageJson from '@/package.json';
import Link from 'next/link';

export default function AdminFooter() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || packageJson.version;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-surface px-8 py-1 text-center text-xs border-t border-default">
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-footer opacity-60 hover:opacity-100 transition-opacity">
        <span>&copy; {currentYear} NORO. Todos os direitos reservados.</span>
        <span className="text-footer-separator">|</span>
        <Link href="/admin/sobre-noro" className="footer-link">
          Sobre o NORO
        </Link>
        <span className="text-footer-separator">|</span>
        <span>Versao {version}</span>
      </div>
    </footer>
  );
}
