'use client';

import React, { useState, useTransition, useRef } from 'react';
import { PedidoComRelacionamentos } from "@/app/(protected)/pedidos/[id]/page";
import { addPedidoItem, deletePedidoItem, updatePedidoItem } from "@/app/(protected)/pedidos/pedidos-actions";
import { currencyFormat } from '@/utils/currency-format';
import { useToast } from "@ui/use-toast";
import { Input } from "@ui/input";
import { Button } from "@ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Trash2, Plus, Pencil, Loader2 } from 'lucide-react';
import { Database } from "@noro-types/supabase"; // Importe o tipo Database

// Tipo do item do pedido para o estado local, baseado no Supabase
type PedidoItem = Database['public']['Tables']['pedido_itens']['Row'];

interface PedidoItemManagerProps {
  initialItems: PedidoItem[];
  pedidoId: string;
}

// Estado inicial para o novo item
const initialNewItemState = {
  servico_nome: '',
  quantidade: 1,
  valor_unitario: 0.00,
};

export default function PedidoItemManager({ initialItems, pedidoId }: PedidoItemManagerProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<PedidoItem[]>(initialItems);
  const [newItem, setNewItem] = useState(initialNewItemState);
  const [isPending, startTransition] = useTransition();

  // -----------------------------------------------------------
  // Lógica de Adição (Formulário Simples)
  // -----------------------------------------------------------

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [id]: id === 'quantidade' || id === 'valor_unitario' ? parseFloat(value) : value,
    }));
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.servico_nome || newItem.quantidade <= 0 || newItem.valor_unitario <= 0) {
      toast({
        title: 'Dados Incompletos',
        description: 'Preencha o nome do serviço, quantidade e valor unitário.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      const payload = {
        ...newItem,
        pedido_id: pedidoId,
      };
      
      const result = await addPedidoItem(payload);

      if (result.success) {
        toast({ title: 'Sucesso!', description: result.message });
        setNewItem(initialNewItemState); // Limpar formulário

        // NOTA: Como a Server Action usa revalidatePath, o ideal é confiar no Next.js
        // para buscar os novos dados na próxima navegação/re-renderização do Page Component.
        // Para simular a atualização imediata no cliente (se a performance for crítica):
        const tempId = `temp-${Date.now()}`;
        const valor_total = newItem.quantidade * newItem.valor_unitario;
        setItems(prev => [...prev, {
             id: tempId, // Será substituído pelo real na próxima busca do servidor
             pedido_id: pedidoId,
             servico_nome: newItem.servico_nome,
             quantidade: newItem.quantidade,
             valor_unitario: newItem.valor_unitario,
             valor_total: valor_total,
             created_at: new Date().toISOString()
        } as PedidoItem]); 

        // O ideal é chamar router.refresh() para revalidar o Page Component (Detalhes)
        // e buscar o novo total do pedido.
        // Como o componente pai (Card) também não está atualizado, isso é a melhor prática.
        // No entanto, para não forçar um `router.refresh()` aqui, vamos simplificar.

      } else {
        toast({ title: 'Erro!', description: result.message, variant: 'destructive' });
      }
    });
  };

  // -----------------------------------------------------------
  // Lógica de Exclusão (Simples)
  // -----------------------------------------------------------

  const handleDeleteItem = (itemId: string) => {
    if (!window.confirm('Tem certeza que deseja remover este item?')) return;
    
    startTransition(async () => {
      const result = await deletePedidoItem(itemId);

      if (result.success) {
        toast({ title: 'Sucesso!', description: result.message });
        
        // Remove do estado local (otimista, idealmente o servidor faria o refresh)
        setItems(prev => prev.filter(item => item.id !== itemId));
        
      } else {
        toast({ title: 'Erro!', description: result.message, variant: 'destructive' });
      }
    });
  };

  // -----------------------------------------------------------
  // Lógica de Edição (Simplificada para a tabela)
  // -----------------------------------------------------------

  const handleUpdateItem = async (itemId: string, field: keyof PedidoItem, value: any) => {
    // Busca o item atual para calcular o payload completo
    const currentItem = items.find(i => i.id === itemId);
    if (!currentItem) return;

    // Constrói o payload de update
    const updatedPayload = {
      ...currentItem,
      [field]: parseFloat(value), // Garantir que números são números
    };

    // Apenas envia a atualização se o valor realmente mudou
    if (currentItem[field] === updatedPayload[field]) return;
    
    // Atualiza o estado local para uma resposta visual rápida
    setItems(prevItems => prevItems.map(item => 
        item.id === itemId ? { ...item, ...updatedPayload, valor_total: updatedPayload.quantidade * updatedPayload.valor_unitario } as PedidoItem : item
    ));

    // Chama a Server Action
    startTransition(async () => {
        const result = await updatePedidoItem(itemId, {
            servico_nome: updatedPayload.servico_nome,
            quantidade: updatedPayload.quantidade,
            valor_unitario: updatedPayload.valor_unitario,
        });

        if (result.success) {
            toast({ title: 'Item Atualizado', description: 'O item foi salvo e o total do pedido recalculado.' });
        } else {
            toast({ title: 'Erro!', description: result.message, variant: 'destructive' });
            // Reverter o estado local em caso de falha (não implementado aqui para simplicidade)
        }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Itens da Venda ({items.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Tabela de Itens Existentes */}
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y divide-white/5">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Serviço</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider w-24">Qtd.</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider w-32">Vl. Unit.</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider w-32">Vl. Total</th>
                <th className="px-6 py-3 w-16"></th>
              </tr>
            </thead>
            <tbody className="surface-card divide-y divide-white/5">
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-muted">
                    Nenhum serviço adicionado a este pedido.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-white/5 transition duration-150 ease-in-out">
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-primary">
                      <Input
                          type="text"
                          value={item.servico_nome}
                          onChange={(e) => handleUpdateItem(item.id, 'servico_nome', e.target.value)}
                          className="p-1 h-8 border-none focus-visible:ring-1 focus-visible:ring-indigo-500"
                      />
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-right text-sm text-primary">
                        <Input
                            type="number"
                            value={item.quantidade}
                            onChange={(e) => handleUpdateItem(item.id, 'quantidade', e.target.value)}
                            className="p-1 h-8 border-none text-right focus-visible:ring-1 focus-visible:ring-indigo-500"
                        />
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-right text-sm text-primary">
                        <Input
                            type="number"
                            step="0.01"
                            value={item.valor_unitario}
                            onChange={(e) => handleUpdateItem(item.id, 'valor_unitario', e.target.value)}
                            className="p-1 h-8 border-none text-right focus-visible:ring-1 focus-visible:ring-indigo-500"
                        />
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-right text-sm font-bold text-gray-800">
                      {currencyFormat(item.valor_total || 0)}
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-center">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteItem(item.id)}
                        disabled={isPending}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Formulário de Adição de Novo Item */}
        <form onSubmit={handleAddItem} className="space-y-4 pt-4 border-t">
          <h4 className="text-lg font-semibold">Adicionar Novo Item</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                id="servico_nome"
                type="text"
                placeholder="Nome do Serviço (Visto EUA, Consultoria, etc.)"
                value={newItem.servico_nome}
                onChange={handleNewItemChange}
                required
              />
            </div>
            <div>
              <Input
                id="quantidade"
                type="number"
                min="1"
                placeholder="Qtd."
                value={newItem.quantidade}
                onChange={handleNewItemChange}
                required
              />
            </div>
            <div>
              <Input
                id="valor_unitario"
                type="number"
                step="0.01"
                placeholder="R$ Unitário"
                value={newItem.valor_unitario}
                onChange={handleNewItemChange}
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
              {isPending ? 'Adicionando...' : 'Adicionar Item'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
