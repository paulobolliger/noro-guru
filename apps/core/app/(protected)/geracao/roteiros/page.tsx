// app/admin/(protected)/geracao/roteiros/page.tsx
'use client';

import BulkGenerateForm from '@/components/dashboard/BulkGenerateForm';
import { DESTINATION_TYPES, DIFFICULTY_LEVELS, RoteiroCategorias } from '@/lib/constants';
import { generateRoteirosAction } from '../ai-actions';

export default function GerarRoteirosPage() {
  return (
    <BulkGenerateForm
      type="roteiros"
      onGenerate={generateRoteirosAction}
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
