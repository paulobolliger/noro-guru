'use client'

import MainLayout from '@/components/layout/MainLayout';
import { Construction } from 'lucide-react';

interface EmConstrucaoProps {
  titulo: string;
  descricao: string;
}

export default function EmConstrucao({ titulo, descricao }: EmConstrucaoProps) {
  const mockUser = { 
    email: 'dev@noro.com.br',
    nome: 'Desenvolvedor'
  };

  return (
    <MainLayout user={mockUser}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{titulo}</h1>
          <p className="text-gray-600 mt-2">{descricao}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-12">
          <div className="text-center">
            <Construction className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Em Construção
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Este módulo está sendo desenvolvido e estará disponível em breve.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
