import packageJson from '@/package.json';
import Link from 'next/link';

export default function AdminFooter() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || packageJson.version;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-surface px-8 py-4 text-center text-xs">
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-footer">
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
