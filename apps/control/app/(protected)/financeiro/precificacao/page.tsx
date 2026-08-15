import React from 'react';
import SectionHeader from '@/components/layout/SectionHeader';
import { DollarSign } from 'lucide-react';
import PrecificacaoClient from './PrecificacaoClient';

export default function PrecificacaoPage() {
  return (
    <div className="container-app py-8 space-y-6">
      <SectionHeader
        title="Composição de Preços & Câmbio PTAX"
        subtitle="Gestão centralizada de Spreads Master e trava diária de cotações para conversão em Reais."
        icon={<DollarSign size={28} />}
      />

      <PrecificacaoClient />
    </div>
  );
}
