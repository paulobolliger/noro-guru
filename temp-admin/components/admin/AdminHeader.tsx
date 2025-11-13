// components/admin/AdminHeader.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-blue-800 px-6 text-white shadow-md">
      <Link href="/admin" className="flex items-center gap-2 font-semibold">
        <div className="relative h-10 w-36">
          <Image
            src="https://res.cloudinary.com/dhqvjxgue/image/upload/v1714736404/logo_branco_sem_fundo_rucnug.png"
            alt="Logo Nomade Guru"
            fill
            className="object-contain"
            sizes="144px"
            priority
          />
        </div>
      </Link>
    </header>
  );
}