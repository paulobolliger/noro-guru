// app/admin/(protected)/relatorios/page.tsx
import { BarChart3 } from 'lucide-react';

export default function RelatoriosPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <BarChart3 size={32} className="text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-primary">Relatórios e Análises</h1>
            <p className="text-muted mt-1">Extraia insights e acompanhe a performance do seu negócio.</p>
          </div>
        </div>
      </div>

      <div className="surface-card rounded-xl p-8 text-center shadow-sm border border-default">
        <h2 className="text-xl font-semibold text-primary">Página em Construção</h2>
        <p className="text-muted mt-2">A funcionalidade de relatórios e análises está a ser desenvolvida.</p>
      </div>
    </div>
  );
}
