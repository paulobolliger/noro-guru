// apps/core/(protected)/geracao/artigos/page.tsx
'use client';

import BulkGenerateForm from '@/components/dashboard/BulkGenerateForm';
import { ARTICLE_TONES } from '@/lib/constants';
import { BlogCategorias } from '@/lib/types';

export default function GerarArtigosPage() {
  return (
    <BulkGenerateForm
      type="artigos"
      apiEndpoint="/api/admin/bulk-generate-artigos"
      placeholder="10 Dicas para Viajar Sozinho&#10;Como Planejar uma Viagem Sustentável&#10;Os Melhores Destinos para Lua de Mel&#10;Gastronomia Italiana: Um Guia Completo&#10;Nômades Digitais: Onde Trabalhar e Viajar"
      optionsConfig={[
        {
          label: 'Categoria',
          name: 'categoria',
          options: [...BlogCategorias],
        },
        {
          label: 'Tom de Escrita',
          name: 'tom',
          options: [...ARTICLE_TONES],
        },
        {
          label: 'Tamanho',
          name: 'tamanho',
          options: ['Curto', 'Médio', 'Longo'],
        },
      ]}
    />
  );
}
