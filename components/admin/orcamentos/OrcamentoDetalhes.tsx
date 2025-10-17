'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon } from 'lucide-react';
import { convertToPedido } from '@/app/admin/(protected)/pedidos/pedidos-actions'; // Caminho assumido
import { Button } from '@/components/ui/button'; // Componente de botão assumido
import { useToast } from '@/components/ui/use-toast'; // Hook de toast assumido
import { OrcamentoComItens } from '@/types/custom'; // Type assumido

interface OrcamentoDetalhesProps {
  orcamento: OrcamentoComItens;
}

export function OrcamentoDetalhes({ orcamento }: OrcamentoDetalhesProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Verifica se o orçamento já foi convertido para desabilitar o botão
  const isConverted = orcamento.status === 'CONVERTIDO';

  const handleConvertToPedido = async () => {
    if (!orcamento.id) {
      toast({
        title: 'Erro de ID',
        description: 'ID do orçamento não encontrado.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);

    try {
      const result = await convertToPedido(orcamento.id);

      if (result.success) {
        toast({
          title: 'Sucesso!',
          description: result.message,
          variant: 'default',
        });
        
        // Redireciona para a página do novo pedido criado
        if (result.data?.pedidoId) {
            router.push(`/admin/pedidos/${result.data.pedidoId}`);
        } else {
            // Se o ID não veio, recarrega a página atual para atualizar o status
            router.refresh(); 
        }

      } else {
        toast({
          title: 'Erro na Conversão',
          description: result.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Erro ao converter orçamento:', error);
      toast({
        title: 'Erro Inesperado',
        description: 'Não foi possível completar a ação. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      {/* ================================================================
        Área de Ações - Ponto 8: Converter em Venda
        ================================================================
      */}
      <div className="flex justify-end gap-3 border-b pb-4">
        {isConverted ? (
          <Button disabled variant="outline">
            Orçamento Já Convertido
          </Button>
        ) : (
          <Button 
            onClick={handleConvertToPedido}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <ArrowRightIcon className="mr-2 h-4 w-4" />
            {isLoading ? 'Convertendo...' : 'Converter em Venda'}
          </Button>
        )}
      </div>

      {/* ================================================================
        Conteúdo principal do Orçamento (Apenas um placeholder)
        ================================================================
      */}
      <h1 className="text-2xl font-bold">Detalhes do Orçamento #{orcamento.id.slice(0, 8)}</h1>
      <p>Status: <span className={`font-semibold ${isConverted ? 'text-green-600' : 'text-yellow-600'}`}>{orcamento.status}</span></p>
      {/* Adicione aqui o restante da renderização dos detalhes do orçamento */}
    </div>
  );
}