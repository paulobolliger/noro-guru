// components/admin/orcamentos/OrcamentoDetalhes.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon } from 'lucide-react';
import { convertToPedido } from '@/app/core/(protected)/pedidos/pedidos-actions';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import type { Database } from '@/types/supabase';

// Tipo local para evitar importações cruzadas
type OrcamentoComItens = Database['public']['Tables']['noro_orcamentos']['Row'] & {
    orcamento_itens: Database['public']['Tables']['noro_orcamentos_itens']['Row'][];
    lead?: { id: string; nome: string } | null;
};

interface OrcamentoDetalhesProps {
  orcamento: OrcamentoComItens;
}

export function OrcamentoDetalhes({ orcamento }: OrcamentoDetalhesProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const isConverted = orcamento.status === 'aceito' || orcamento.status === 'CONVERTIDO'; // 'aceito' também deve bloquear

  const handleConvertToPedido = async () => {
    if (!orcamento.id) {
      toast({ title: 'Erro de ID', description: 'ID do orçamento não encontrado.', variant: 'destructive' });
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await convertToPedido(orcamento.id);
      if (result.success) {
        toast({ title: 'Sucesso!', description: result.message });
        if (result.data?.pedidoId) {
            router.push(`/core/pedidos/${result.data.pedidoId}`);
        } else {
            router.refresh(); 
        }
      } else {
        toast({ title: 'Erro na Conversão', description: result.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Erro Inesperado', description: 'Não foi possível completar a ação.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-end gap-3 border-b pb-4">
        {isConverted ? (
          <Button disabled variant="outline">
            Orçamento já convertido em Venda
          </Button>
        ) : (
          <Button 
            onClick={handleConvertToPedido}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <ArrowRightIcon className="mr-2 h-4 w-4" />
            {isLoading ? 'A converter...' : 'Converter em Venda'}
          </Button>
        )}
      </div>
      <h1 className="text-2xl font-bold">Detalhes do Orçamento #{orcamento.id.slice(0, 8)}</h1>
      <p>Status: <span className={`font-semibold ${isConverted ? 'text-green-600' : 'text-yellow-600'}`}>{orcamento.status}</span></p>
    </div>
  );
}
