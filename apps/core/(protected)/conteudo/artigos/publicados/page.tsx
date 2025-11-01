// apps/core/(protected)/conteudo/artigos/publicados/page.tsx
'use client';

import { CheckCircle2, FileText } from 'lucide-react';
import ContentListTable from '@/components/admin/content/ContentListTable';

export default function ArtigosPublicadosPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <CheckCircle2 className="text-green-600" size={32} />
            Artigos - Publicados
          </h1>
          <p className="text-gray-600 mt-2">
            Artigos ativos no blog
          </p>
        </div>
      </div>

      {/* Informação */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
        <FileText className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <p className="font-semibold text-green-900">Conteúdo Público</p>
          <p className="text-sm text-green-700 mt-1">
            Estes artigos estão visíveis no blog. Você pode despublicar ou excluir conforme necessário.
          </p>
        </div>
      </div>

      {/* Tabela */}
      <ContentListTable contentType="artigo" status="published" />
    </div>
  );
}
