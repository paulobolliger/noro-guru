'use client'

import { RegraPreco, TipoRegraPreco, TipoMarkup } from '@/types/pricing'
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

// Funções auxiliares de formatação
function formatTipoRegra(tipo: TipoRegraPreco): string {
  const tiposRegra = {
    markup_padrao: 'Markup Padrão',
    volume: 'Volume',
    sazonalidade: 'Sazonalidade',
    cliente_categoria: 'Categoria Cliente',
    destino: 'Destino',
    fornecedor: 'Fornecedor',
    produto: 'Produto'
  }
  return tiposRegra[tipo] || tipo
}

function formatMarkup(tipo: TipoMarkup, valor: number, moeda: string): string {
  switch (tipo) {
    case 'percentual':
      return `${valor}%`
    case 'fixo':
      return formatCurrency(valor, moeda)
    case 'dinamico':
      return 'Dinâmico'
    case 'personalizado':
      return 'Personalizado'
    default:
      return String(valor)
  }
}

interface RegrasPrecoTableProps {
  regras: RegraPreco[]
  onEdit?: (regra: RegraPreco) => void
  onToggleStatus?: (regra: RegraPreco) => void
}

export function RegrasPrecoTable({ 
  regras, 
  onEdit,
  onToggleStatus 
}: RegrasPrecoTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof RegraPreco
    direction: 'asc' | 'desc'
  }>({
    key: 'prioridade',
    direction: 'asc'
  })

  const sortedRegras = [...regras].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1
    }
    return 0
  })

  const handleSort = (key: keyof RegraPreco) => {
    setSortConfig({
      key,
      direction: 
        sortConfig.key === key && sortConfig.direction === 'asc' 
          ? 'desc' 
          : 'asc',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Regras de Preço</CardTitle>
        <CardDescription>
          Lista de regras de preço configuradas no sistema
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
                <TableHead className="w-[150px]">Tipo</TableHead>
                <TableHead className="w-[100px] text-right">Markup</TableHead>
                <TableHead className="w-[100px] text-center">Status</TableHead>
                <TableHead 
                  className="w-[100px] text-right cursor-pointer"
                  onClick={() => handleSort('prioridade')}
                >
                  Prioridade
                </TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRegras.map((regra) => (
                <TableRow key={regra.id}>
                  <TableCell className="font-medium">{regra.nome}</TableCell>
                  <TableCell>{formatTipoRegra(regra.tipo)}</TableCell>
                  <TableCell className="text-right">
                    {formatMarkup(regra.tipo_markup, regra.valor_markup, regra.moeda)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant={regra.ativo ? "default" : "secondary"}
                    >
                      {regra.ativo ? 'Ativa' : 'Inativa'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{regra.prioridade}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit?.(regra)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant={regra.ativo ? "outline" : "default"}
                        size="sm"
                        onClick={() => onToggleStatus?.(regra)}
                      >
                        {regra.ativo ? 'Desativar' : 'Ativar'}
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
  )
}