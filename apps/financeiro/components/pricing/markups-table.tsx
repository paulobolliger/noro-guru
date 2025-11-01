'use client'

import { MarkupPadrao } from '@/types/pricing'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatCurrency } from '@/lib/utils'
import { useState } from 'react'
import { EditMarkupForm } from './edit-markup-form'

interface MarkupsTableProps {
  markups: MarkupPadrao[]
  onEdit?: (markup: MarkupPadrao, data: any) => void
  onToggleStatus?: (markup: MarkupPadrao) => void
}

export function MarkupsTable({ 
  markups, 
  onEdit,
  onToggleStatus 
}: MarkupsTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof MarkupPadrao
    direction: 'asc' | 'desc'
  }>({
    key: 'ordem',
    direction: 'asc'
  })
  const [editingMarkup, setEditingMarkup] = useState<MarkupPadrao | null>(null)

  const sortedMarkups = [...markups].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1
    }
    return 0
  })

  const handleSort = (key: keyof MarkupPadrao) => {
    setSortConfig({
      key,
      direction: 
        sortConfig.key === key && sortConfig.direction === 'asc' 
          ? 'desc' 
          : 'asc',
    })
  }

  const handleEdit = (markup: MarkupPadrao) => {
    setEditingMarkup(markup)
  }

  const handleEditSubmit = (data: any) => {
    if (editingMarkup && onEdit) {
      onEdit(editingMarkup, data)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Markups Padrão</CardTitle>
          <CardDescription>
            Lista de markups padrão configurados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="w-[200px] cursor-pointer"
                    onClick={() => handleSort('nome')}
                  >
                    Nome
                  </TableHead>
                  <TableHead className="w-[200px]">Tipo de Produto</TableHead>
                  <TableHead className="w-[100px] text-right">Valor</TableHead>
                  <TableHead className="w-[100px] text-center">Status</TableHead>
                  <TableHead className="w-[100px] text-right">Ordem</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedMarkups.map((markup) => (
                  <TableRow key={markup.id}>
                    <TableCell className="font-medium">{markup.nome}</TableCell>
                    <TableCell>{markup.tipo_produto}</TableCell>
                    <TableCell className="text-right">
                      {markup.tipo_markup === 'percentual' 
                        ? `${markup.valor_markup}%`
                        : formatCurrency(markup.valor_markup, markup.moeda)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant={markup.ativo ? "success" : "secondary"}
                      >
                        {markup.ativo ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{markup.ordem}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(markup)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant={markup.ativo ? "secondary" : "default"}
                          size="sm"
                          onClick={() => onToggleStatus?.(markup)}
                        >
                          {markup.ativo ? 'Desativar' : 'Ativar'}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {editingMarkup && (
        <EditMarkupForm 
          markup={editingMarkup}
          open={!!editingMarkup}
          onOpenChange={(open) => !open && setEditingMarkup(null)}
          onSubmit={handleEditSubmit}
        />
      )}
    </>
  )
}