// apps/core/(protected)/geracao/roteiros/page.tsx
'use client';

import BulkGenerateForm from '@/components/dashboard/BulkGenerateForm';
import { DESTINATION_TYPES, DIFFICULTY_LEVELS } from '@/lib/constants';
import { RoteiroCategorias } from '@/lib/types';

export default function GerarRoteirosPage() {
  return (
    <BulkGenerateForm
      type="roteiros"
      apiEndpoint="/api/admin/bulk-generate-roteiros"
      placeholder="Paris, França&#10;Tóquio, Japão&#10;Machu Picchu, Peru&#10;Santorini, Grécia&#10;Nova York, EUA"
      optionsConfig={[
        {
          label: 'Tipo de Turismo',
          name: 'tipo',
          options: [...DESTINATION_TYPES],
        },
        {
          label: 'Dificuldade',
          name: 'dificuldade',
          options: [...DIFFICULTY_LEVELS],
        },
        {
          label: 'Categoria',
          name: 'categoria',
          options: [...RoteiroCategorias],
        },
      ]}
    />
  );
}
