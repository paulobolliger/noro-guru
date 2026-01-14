'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@noro/ui';
import { Button } from '@noro/ui';
import { Input } from '@noro/ui';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@noro/ui';
import { useRouter } from 'next/navigation';
import { useToast } from '@noro/ui';

interface BancoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  conta?: any;
  tenantId: string;
}

export function BancoFormModal({
  isOpen,
  onClose,
  conta,
  tenantId,
}: BancoFormModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: conta?.nome || '',
    banco: conta?.banco || '',
    tipo: conta?.tipo || 'corrente',
    agencia: conta?.agencia || '',
    numero_conta: conta?.numero_conta || '',
    saldo_inicial: conta?.saldo_inicial || '',
    ativo: conta?.ativo ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = conta
        ? `/api/bancos/${conta.id}`
        : '/api/bancos';

      const method = conta ? 'PUT' : 'POST';

      // Preparar dados
      const dadosParaEnviar = {
        ...formData,
        tenant_id: tenantId,
        saldo_inicial: parseFloat(formData.saldo_inicial) || 0,
      };

      console.log('📤 Enviando dados:', {
        url,
        method,
        data: dadosParaEnviar
      });

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosParaEnviar),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Sucesso:', data);
        toast({
          title: 'Sucesso',
          description: `Conta ${conta ? 'atualizada' : 'criada'} com sucesso!`,
          variant: 'success',
        });
        router.refresh();
        onClose();
      } else {
        console.error('❌ Erro na resposta:', data);
        setError(data.error || 'Erro desconhecido ao salvar conta');
        toast({
          title: 'Erro ao salvar',
          description: data.error || 'Erro desconhecido',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('❌ Erro ao salvar conta:', error);
      setError('Erro ao conectar com o servidor');
      toast({
        title: 'Erro ao salvar conta',
        description: 'Verifique o console para mais detalhes',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {conta ? 'Editar Conta Bancária' : 'Nova Conta Bancária'}
          </DialogTitle>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-800">
              ⚠️ {error}
            </div>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome e Banco */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome da Conta*</label>
              <Input
                required
                value={formData.nome}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                placeholder="Ex: Itaú Empresarial"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Banco*</label>
              <Input
                required
                value={formData.banco}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, banco: e.target.value })
                }
                placeholder="Ex: Itaú"
              />
            </div>
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm font-medium mb-1">Tipo de Conta*</label>
            <Select
              value={formData.tipo}
              onValueChange={(value) => setFormData({ ...formData, tipo: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="corrente">Conta Corrente</SelectItem>
                <SelectItem value="poupanca">Poupança</SelectItem>
                <SelectItem value="investimento">Investimento</SelectItem>
                <SelectItem value="cartao">Cartão de Crédito</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Agência e Número da Conta */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Agência</label>
              <Input
                value={formData.agencia}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, agencia: e.target.value })
                }
                placeholder="Ex: 1234"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Número da Conta</label>
              <Input
                value={formData.numero_conta}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, numero_conta: e.target.value })
                }
                placeholder="Ex: 12345-6"
              />
            </div>
          </div>

          {/* Saldo Inicial */}
          <div>
            <label className="block text-sm font-medium mb-1">Saldo Inicial (R$)</label>
            <Input
              type="number"
              step="0.01"
              value={formData.saldo_inicial}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, saldo_inicial: e.target.value })
              }
              placeholder="0,00"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Informe o saldo no momento da criação da conta no sistema
            </p>
          </div>

          {/* Ativo */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="ativo"
              checked={formData.ativo}
              onChange={(e) =>
                setFormData({ ...formData, ativo: e.target.checked })
              }
              className="h-4 w-4"
            />
            <label htmlFor="ativo" className="text-sm font-medium">
              Conta ativa
            </label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : conta ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
