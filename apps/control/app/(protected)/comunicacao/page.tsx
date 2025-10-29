// app/admin/(protected)/comunicacao/page.tsx
import { MessageSquare } from 'lucide-react';

export default function ComunicacaoPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <MessageSquare size={32} className="text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-primary">Comunicação</h1>
            <p className="text-muted mt-1">Integração com canais como WhatsApp, Instagram e Chat.</p>
          </div>
        </div>
      </div>

      <div className="surface-card rounded-xl p-8 text-center shadow-sm border border-default">
        <h2 className="text-xl font-semibold text-primary">Página em Construção</h2>
        <p className="text-muted mt-2">A central de comunicação está a ser desenvolvida.</p>
      </div>
    </div>
  );
}
