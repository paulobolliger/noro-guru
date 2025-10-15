// components/admin/TopBar.tsx
'use client';

import { Search, Bell, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getNotificacoes } from '@/lib/supabase/admin';

interface TopBarProps {
  user: {
    id: string;
    nome: string | null;
    email: string;
  };
}

export default function TopBar({ user }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    loadNotificacoes();
  }, [user.id]);

  const loadNotificacoes = async () => {
    const data = await getNotificacoes(user.id, 5);
    setNotificacoes(data);
  };

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar leads, roteiros, pedidos..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell size={20} />
              {naoLidas > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Dropdown de Notificações */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notificações</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notificacoes.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      Nenhuma notificação
                    </div>
                  ) : (
                    notificacoes.map((notif) => (
                      <Link
                        key={notif.id}
                        href={notif.link || '/admin'}
                        onClick={() => setShowNotifications(false)}
                        className={`block p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                          !notif.lida ? 'bg-blue-50' : ''
                        }`}
                      >
                        <p className="font-medium text-sm text-gray-900">{notif.titulo}</p>
                        {notif.mensagem && (
                          <p className="text-sm text-gray-600 mt-1">{notif.mensagem}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(notif.created_at).toLocaleString('pt-BR')}
                        </p>
                      </Link>
                    ))
                  )}
                </div>
                <div className="p-4 border-t border-gray-200 text-center">
                  <Link
                    href="/admin/notificacoes"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    onClick={() => setShowNotifications(false)}
                  >
                    Ver todas
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Novo Lead Button */}
          <Link
            href="/admin/leads/novo"
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-shadow"
          >
            <Plus size={20} />
            <span>Novo Lead</span>
          </Link>
        </div>
      </div>
    </div>
  );
}