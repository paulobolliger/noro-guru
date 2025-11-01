import { useEffect, useState } from 'react'
import { RegraPreco } from '../../../types/pricing'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@noro/ui'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@noro/ui'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@noro/ui'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { formatarMoeda, formatarPorcentagem } from '../../../lib/pricing'
import RegraPrecoPadraoForm from './RegraPrecoPadraoForm'

// Labels para tipos de regra
const tipoRegraLabel: Record<string, string> = {
  markup_padrao: 'Markup Padrão',
  volume: 'Volume',
  sazonalidade: 'Sazonalidade',
  cliente_categoria: 'Categoria Cliente',
  destino: 'Destino',
  fornecedor: 'Fornecedor',
  produto: 'Produto'
}

export default function GerenciarRegrasPreco() {
  const [regras, setRegras] = useState<RegraPreco[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingRegra, setEditingRegra] = useState<RegraPreco | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  
  const supabase = createClientComponentClient()

  // Carregar regras
  const loadRegras = async () => {
    try {
      const { data, error } = await supabase
        .from('fin_regras_preco')
        .select('*')
        .order('prioridade', { ascending: false })

      if (error) throw error

      setRegras(data)
    } catch (error) {
      console.error('Erro ao carregar regras:', error)
      toast.error('Erro ao carregar regras')
    }
  }

  // Carregar dados iniciais
  useEffect(() => {
    loadRegras()
  }, [])

  // Salvar regra
  const handleSubmit = async (data: Partial<RegraPreco>) => {
    setIsLoading(true)
    try {
      if (editingRegra) {
        // Atualizar existente
        const { error } = await supabase
          .from('fin_regras_preco')
          .update(data)
          .eq('id', editingRegra.id)

        if (error) throw error
        toast.success('Regra atualizada com sucesso')
      } else {
        // Criar nova
        const { error } = await supabase
          .from('fin_regras_preco')
          .insert(data)

        if (error) throw error
        toast.success('Regra criada com sucesso')
      }

      // Recarregar lista e fechar form
      await loadRegras()
      setIsSheetOpen(false)
      setEditingRegra(null)
    } catch (error) {
      console.error('Erro ao salvar regra:', error)
      toast.error('Erro ao salvar regra')
    } finally {
      setIsLoading(false)
    }
  }

  // Excluir regra
  const handleDelete = async (regra: RegraPreco) => {
    if (!confirm('Tem certeza que deseja excluir esta regra?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('fin_regras_preco')
        .delete()
        .eq('id', regra.id)

      if (error) throw error

      toast.success('Regra excluída com sucesso')
      await loadRegras()
    } catch (error) {
      console.error('Erro ao excluir regra:', error)
      toast.error('Erro ao excluir regra')
    }
  }

  // Formatar valor do markup
  const formatMarkupValue = (regra: RegraPreco) => {
    if (regra.tipo_markup === 'percentual') {
      return formatarPorcentagem(regra.valor_markup)
    } else {
      return formatarMoeda(regra.valor_markup, regra.moeda)
    }
  }

  // Formatar período de validade
  const formatPeriodo = (regra: RegraPreco) => {
    if (!regra.data_inicio && !regra.data_fim) {
      return 'Sem período definido'
    }

    const inicio = regra.data_inicio 
      ? new Date(regra.data_inicio).toLocaleDateString('pt-BR')
      : 'Início'
    
    const fim = regra.data_fim
      ? new Date(regra.data_fim).toLocaleDateString('pt-BR')
      : 'Fim'

    return `${inicio} - ${fim}`
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Regras de Preço
        </h2>
        
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Regra
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
            <SheetHeader>
              <SheetTitle>
                {editingRegra ? 'Editar Regra' : 'Nova Regra'}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <RegraPrecoPadraoForm
                regra={editingRegra || undefined}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead>Markup</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {regras.map((regra) => (
              <TableRow key={regra.id}>
                <TableCell>
                  {tipoRegraLabel[regra.tipo] || regra.tipo}
                </TableCell>
                <TableCell>{regra.nome}</TableCell>
                <TableCell>
                  <span className="font-mono">
                    {formatMarkupValue(regra)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {formatPeriodo(regra)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 ring-1 ring-blue-600/20">
                    {regra.prioridade}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    regra.ativo 
                      ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20' 
                      : 'bg-gray-50 text-gray-600 ring-1 ring-gray-500/20'
                  }`}>
                    {regra.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingRegra(regra)
                        setIsSheetOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(regra)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {regras.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                  Nenhuma regra cadastrada
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}