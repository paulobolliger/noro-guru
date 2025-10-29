// app/admin/(protected)/email/page.tsx
import { Mail } from 'lucide-react';

export default function EmailPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Mail size={32} className="text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-primary">Gestão de E-mails</h1>
            <p className="text-muted mt-1">Criação de templates, automações e campanhas de e-mail.</p>
          </div>
        </div>
      </div>

      <div className="surface-card rounded-xl p-8 text-center shadow-sm border border-default">
        <h2 className="text-xl font-semibold text-primary">Página em Construção</h2>
        <p className="text-muted mt-2">A funcionalidade de gestão de e-mails está a ser desenvolvida.</p>
      </div>
    </div>
  );
}
