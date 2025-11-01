import { useEffect, useState } from 'react'
import { MarkupPadrao } from '../../../types/pricing'
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
import MarkupPadraoForm from './MarkupPadraoForm'

export default function GerenciarMarkups() {
  const [markups, setMarkups] = useState<MarkupPadrao[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingMarkup, setEditingMarkup] = useState<MarkupPadrao | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  
  const supabase = createClientComponentClient()

  // Carregar markups
  const loadMarkups = async () => {
    try {
      const { data, error } = await supabase
        .from('fin_markups_padrao')
        .select('*')
        .order('ordem', { ascending: true })

      if (error) throw error

      setMarkups(data)
    } catch (error) {
      console.error('Erro ao carregar markups:', error)
      toast.error('Erro ao carregar markups')
    }
  }

  // Carregar dados iniciais
  useEffect(() => {
    loadMarkups()
  }, [])

  // Salvar markup
  const handleSubmit = async (data: Partial<MarkupPadrao>) => {
    setIsLoading(true)
    try {
      if (editingMarkup) {
        // Atualizar existente
        const { error } = await supabase
          .from('fin_markups_padrao')
          .update(data)
          .eq('id', editingMarkup.id)

        if (error) throw error
        toast.success('Markup atualizado com sucesso')
      } else {
        // Criar novo
        const { error } = await supabase
          .from('fin_markups_padrao')
          .insert(data)

        if (error) throw error
        toast.success('Markup criado com sucesso')
      }

      // Recarregar lista e fechar form
      await loadMarkups()
      setIsSheetOpen(false)
      setEditingMarkup(null)
    } catch (error) {
      console.error('Erro ao salvar markup:', error)
      toast.error('Erro ao salvar markup')
    } finally {
      setIsLoading(false)
    }
  }

  // Excluir markup
  const handleDelete = async (markup: MarkupPadrao) => {
    if (!confirm('Tem certeza que deseja excluir este markup?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('fin_markups_padrao')
        .delete()
        .eq('id', markup.id)

      if (error) throw error

      toast.success('Markup excluído com sucesso')
      await loadMarkups()
    } catch (error) {
      console.error('Erro ao excluir markup:', error)
      toast.error('Erro ao excluir markup')
    }
  }

  // Formatar valor do markup
  const formatMarkupValue = (markup: MarkupPadrao) => {
    if (markup.tipo_markup === 'percentual') {
      return formatarPorcentagem(markup.valor_markup)
    } else {
      return formatarMoeda(markup.valor_markup, markup.moeda)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Markups Padrão
        </h2>
        
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Markup
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>
                {editingMarkup ? 'Editar Markup' : 'Novo Markup'}
              </SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <MarkupPadraoForm
                markup={editingMarkup || undefined}
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
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {markups.map((markup) => (
              <TableRow key={markup.id}>
                <TableCell className="font-medium">
                  {markup.tipo_produto}
                </TableCell>
                <TableCell>{markup.nome}</TableCell>
                <TableCell>
                  <span className="font-mono">
                    {formatMarkupValue(markup)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    markup.ativo 
                      ? 'bg-green-50 text-green-700 ring-1 ring-green-600/20' 
                      : 'bg-gray-50 text-gray-600 ring-1 ring-gray-500/20'
                  }`}>
                    {markup.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingMarkup(markup)
                        setIsSheetOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(markup)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {markups.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                  Nenhum markup cadastrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}