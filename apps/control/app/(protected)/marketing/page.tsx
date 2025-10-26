// app/admin/(protected)/marketing/page.tsx
import { Megaphone } from 'lucide-react';

export default function MarketingPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Megaphone size={32} className="text-gray-700" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ferramentas de Marketing</h1>
            <p className="text-gray-600 mt-1">Gestão de campanhas, automações e redes sociais.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Página em Construção</h2>
        <p className="text-gray-500 mt-2">A funcionalidade de gestão de marketing está a ser desenvolvida.</p>
      </div>
    </div>
  );
}
