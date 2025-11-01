'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Download, Eye, Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { BancoFormModal } from './banco-form-modal';

interface BancosClientProps {
  contas: any[];
  tenantId: string;
}

export function BancosClient({ contas, tenantId }: BancosClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [busca, setBusca] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [contaSelecionada, setContaSelecionada] = useState<any>(null);

  // Filtrar contas
  const contasFiltradas = contas.filter((conta) => {
    const matchBusca =
      busca === '' ||
      conta.nome.toLowerCase().includes(busca.toLowerCase()) ||
      conta.banco.toLowerCase().includes(busca.toLowerCase());

    return matchBusca;
  });

  // Calcular totais
  const saldoTotal = contasFiltradas.reduce(
    (sum, conta) => sum + (conta.saldo_calculado || 0),
    0
  );

  const contasAtivas = contasFiltradas.filter(c => c.ativo).length;
  const contasInativas = contasFiltradas.filter(c => !c.ativo).length;

  const handleNova = () => {
    setContaSelecionada(null);
    setIsFormOpen(true);
  };

  const handleEditar = (conta: any) => {
    setContaSelecionada(conta);
    setIsFormOpen(true);
  };

  const handleDeletar = async (conta: any) => {
    if (!confirm(`Tem certeza que deseja deletar a conta: ${conta.nome}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/bancos/${conta.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
        showToast('success', 'Conta deletada com sucesso!');
      } else {
        const error = await response.json();
        showToast('error', 'Erro ao deletar', error.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Erro ao deletar conta:', error);
      showToast('error', 'Erro ao deletar conta', 'Verifique o console para mais detalhes');
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const getTipoBadge = (tipo: string) => {
    const variants: Record<string, any> = {
      corrente: { label: 'Conta Corrente', className: 'bg-blue-100 text-blue-800' },
      poupanca: { label: 'Poupança', className: 'bg-green-100 text-green-800' },
      investimento: { label: 'Investimento', className: 'bg-purple-100 text-purple-800' },
      cartao: { label: 'Cartão', className: 'bg-orange-100 text-orange-800' },
    };

    const variant = variants[tipo] || variants.corrente;
    return (
      <Badge className={variant.className} variant="outline">
        {variant.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contas Bancárias</h1>
          <p className="text-muted-foreground">
            Gerencie suas contas bancárias e acompanhe saldos
          </p>
        </div>
        <Button onClick={handleNova}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Conta
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm text-muted-foreground">Saldo Total</div>
          <div className={`text-2xl font-bold ${saldoTotal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatarMoeda(saldoTotal)}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm text-muted-foreground">Contas Ativas</div>
          <div className="text-2xl font-bold text-blue-600">
            {contasAtivas}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm text-muted-foreground">Contas Inativas</div>
          <div className="text-2xl font-bold text-gray-600">
            {contasInativas}
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou banco..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>

      {/* Grid de Contas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {contasFiltradas.length === 0 ? (
          <div className="col-span-full p-8 text-center text-muted-foreground">
            Nenhuma conta encontrada
          </div>
        ) : (
          contasFiltradas.map((conta) => (
            <div
              key={conta.id}
              className="rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow"
            >
              {/* Header do Card */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{conta.nome}</h3>
                  <p className="text-sm text-muted-foreground">{conta.banco}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditar(conta)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletar(conta)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>

              {/* Tipo e Status */}
              <div className="flex gap-2 mb-4">
                {getTipoBadge(conta.tipo)}
                <Badge variant={conta.ativo ? 'default' : 'outline'}>
                  {conta.ativo ? '✓ Ativa' : '✗ Inativa'}
                </Badge>
              </div>

              {/* Saldo */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Saldo Inicial:</span>
                  <span className="font-medium">{formatarMoeda(conta.saldo_inicial || 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Saldo Atual:</span>
                  <span className={`font-bold text-lg ${
                    (conta.saldo_calculado || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatarMoeda(conta.saldo_calculado || 0)}
                    {(conta.saldo_calculado || 0) >= 0 ? (
                      <TrendingUp className="inline ml-1 h-4 w-4" />
                    ) : (
                      <TrendingDown className="inline ml-1 h-4 w-4" />
                    )}
                  </span>
                </div>
              </div>

              {/* Informações Adicionais */}
              {(conta.agencia || conta.numero_conta) && (
                <div className="mt-4 pt-4 border-t space-y-1">
                  {conta.agencia && (
                    <div className="text-xs text-muted-foreground">
                      Agência: {conta.agencia}
                    </div>
                  )}
                  {conta.numero_conta && (
                    <div className="text-xs text-muted-foreground">
                      Conta: {conta.numero_conta}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Rodapé com contagem */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Mostrando <strong>{contasFiltradas.length}</strong> de{' '}
          <strong>{contas.length}</strong> contas
        </div>
      </div>

      {/* Modal */}
      <BancoFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setContaSelecionada(null);
        }}
        conta={contaSelecionada}
        tenantId={tenantId}
      />
    </div>
  );
}
