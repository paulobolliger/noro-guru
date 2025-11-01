'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { CategoriaFormModal } from './categoria-form-modal';

interface CategoriasClientProps {
  categorias: any[];
  tenantId: string;
}

export function CategoriasClient({ categorias, tenantId }: CategoriasClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('todas');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<any>(null);

  // Filtrar categorias
  const categoriasFiltradas = useMemo(() => {
    return categorias.filter((cat) => {
      const matchBusca =
        busca === '' ||
        cat.nome.toLowerCase().includes(busca.toLowerCase());
      const matchTipo =
        filtroTipo === 'todas' || cat.tipo === filtroTipo;

      return matchBusca && matchTipo;
    });
  }, [categorias, busca, filtroTipo]);

  // Contar por tipo
  const totais = useMemo(() => {
    return {
      receita: categorias.filter(c => c.tipo === 'receita').length,
      despesa: categorias.filter(c => c.tipo === 'despesa').length,
      total: categorias.length,
    };
  }, [categorias]);

  const handleNova = () => {
    setCategoriaSelecionada(null);
    setIsFormOpen(true);
  };

  const handleEditar = (categoria: any) => {
    setCategoriaSelecionada(categoria);
    setIsFormOpen(true);
  };

  const handleDeletar = async (categoria: any) => {
    if (!confirm(`Tem certeza que deseja deletar a categoria: ${categoria.nome}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/categorias/${categoria.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
        showToast('success', 'Categoria deletada com sucesso!');
      } else {
        const error = await response.json();
        showToast('error', 'Erro ao deletar', error.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      showToast('error', 'Erro ao deletar categoria', 'Verifique o console para mais detalhes');
    }
  };

  const getTipoBadge = (tipo: string) => {
    return tipo === 'receita' ? (
      <Badge className="bg-green-100 text-green-800">Receita</Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800">Despesa</Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categorias</h1>
          <p className="text-muted-foreground">
            Gerencie categorias de receitas e despesas
          </p>
        </div>
        <Button onClick={handleNova}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm text-muted-foreground">Categorias de Receita</div>
          <div className="text-2xl font-bold text-green-600">
            {totais.receita}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm text-muted-foreground">Categorias de Despesa</div>
          <div className="text-2xl font-bold text-red-600">
            {totais.despesa}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm text-muted-foreground">Total de Categorias</div>
          <div className="text-2xl font-bold">{totais.total}</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            <SelectItem value="receita">Receitas</SelectItem>
            <SelectItem value="despesa">Despesas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid de Categorias */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categoriasFiltradas.length === 0 ? (
          <div className="col-span-full p-8 text-center text-muted-foreground">
            Nenhuma categoria encontrada
          </div>
        ) : (
          categoriasFiltradas.map((categoria) => (
            <div
              key={categoria.id}
              className="rounded-lg border bg-card p-4 hover:shadow-lg transition-shadow"
            >
              {/* Header do Card */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{categoria.icone}</span>
                  <div>
                    <h3 className="font-semibold">{categoria.nome}</h3>
                    {getTipoBadge(categoria.tipo)}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditar(categoria)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletar(categoria)}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </div>

              {/* Cor */}
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: categoria.cor }}
                />
                <span className="text-xs text-muted-foreground font-mono">
                  {categoria.cor}
                </span>
              </div>

              {/* Descrição */}
              {categoria.descricao && (
                <p className="text-xs text-muted-foreground mt-2">
                  {categoria.descricao}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Rodapé com contagem */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Mostrando <strong>{categoriasFiltradas.length}</strong> de{' '}
          <strong>{categorias.length}</strong> categorias
        </div>
      </div>

      {/* Modal */}
      <CategoriaFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setCategoriaSelecionada(null);
        }}
        categoria={categoriaSelecionada}
        tenantId={tenantId}
      />
    </div>
  );
}
