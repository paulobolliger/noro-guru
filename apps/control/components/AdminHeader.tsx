// components/admin/AdminHeader.tsx
import Image from 'next/image';
import Link from 'next/link';

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center border-b border-default border-default px-6 text-white shadow-md" style={{ backgroundColor: '#2d2f9e' }}>
      <div className="font-semibold tracking-wide">NORO Control</div>
    </header>
  );
}
