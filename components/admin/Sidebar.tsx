'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, FileText, Users, MessageSquare, Mail, DollarSign, BarChart3, Settings, Calendar, Instagram, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  user?: {
    nome: string | null;
    email: string;
    role: string;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-screen`}>
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        {sidebarOpen && (
          <Link href="/admin" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Nomade Guru
          </Link>
        )}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600 hover:text-gray-900">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      <div className="flex-1 p-4">
        <p className="text-gray-600">Sidebar funcionando!</p>
      </div>
    </div>
  );
}