// app/admin/(protected)/conteudo/artigos/a-publicar/page.tsx
'use client';

import { FileText, AlertCircle } from 'lucide-react';
import ContentListTable from '@/components/admin/content/ContentListTable';

export default function ArtigosAPublicarPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FileText className="text-purple-600" size={32} />
            Artigos - A Publicar
          </h1>
          <p className="text-gray-600 mt-2">
            Revise e publique artigos em rascunho
          </p>
        </div>
      </div>

      {/* Informação */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="text-purple-600 flex-shrink-0 mt-0.5" size={20} />
        <div>
          <p className="font-semibold text-purple-900">Como funciona?</p>
          <p className="text-sm text-purple-700 mt-1">
            Os artigos aparecem aqui após serem gerados. Verifique os campos de SEO e OpenGraph (🟢🟡🔴)
            antes de publicar. Use a IA para preencher automaticamente os campos faltantes.
          </p>
        </div>
      </div>

      {/* Tabela */}
      <ContentListTable contentType="artigo" status="draft" />
    </div>
  );
}
