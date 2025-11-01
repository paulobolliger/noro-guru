'use client'

import { useState, useEffect } from 'react'
import { Loader2, ExternalLink } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface Credito {
  id: string
  tipo_credito: string
  descricao: string
  valor_total: number
  valor_utilizado: number
  moeda: string
  fornecedor?: {
    nome: string
  }
}

interface Utilizacao {
  id: string
  credito_id: string
  duplicata_pagar_id: string
  valor_utilizado: number
  data_utilizacao: string
  duplicata_pagar?: {
    numero_documento: string
    descricao: string
    valor_total: number
    status: string
  }
}

interface Props {
  isOpen: boolean
  onClose: () => void
  credito: Credito | null
  tenantId: string
}

export default function VerUtilizacoesModal({
  isOpen,
  onClose,
  credito,
  tenantId,
}: Props) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [utilizacoes, setUtilizacoes] = useState<Utilizacao[]>([])

  useEffect(() => {
    if (isOpen && credito) {
      carregarUtilizacoes()
    }
  }, [isOpen, credito])

  const carregarUtilizacoes = async () => {
    if (!credito) return

    setLoading(true)
    try {
      // Buscar duplicatas que usaram este crédito
      const res = await fetch(
        `/api/duplicatas-pagar?tenant_id=${tenantId}&credito_id=${credito.id}`
      )

      if (res.ok) {
        const duplicatas = await res.json()
        
        // Transformar duplicatas em utilizações
        const utilizacoesData = duplicatas
          .filter((dup: any) => dup.valor_credito_aplicado > 0)
          .map((dup: any) => ({
            id: dup.id,
            credito_id: credito.id,
            duplicata_pagar_id: dup.id,
            valor_utilizado: dup.valor_credito_aplicado,
            data_utilizacao: dup.updated_at || dup.data_emissao,
            duplicata_pagar: {
              numero_documento: dup.numero_documento,
              descricao: dup.descricao,
              valor_total: dup.valor_total,
              status: dup.status,
            },
          }))

        setUtilizacoes(utilizacoesData)
      } else {
        showToast('error', 'Erro ao carregar utilizações')
      }
    } catch (error) {
      console.error('Erro ao carregar utilizações:', error)
      showToast('error', 'Erro ao carregar utilizações')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number, moeda: string = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: moeda,
    }).format(value)
  }

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { variant: any; label: string }> = {
      pendente: { variant: 'warning', label: 'Pendente' },
      parcialmente_paga: { variant: 'info', label: 'Parcialmente Paga' },
      paga: { variant: 'success', label: 'Paga' },
      vencida: { variant: 'destructive', label: 'Vencida' },
      cancelada: { variant: 'secondary', label: 'Cancelada' },
    }
    return badges[status] || { variant: 'secondary', label: status }
  }

  const getTipoCreditoBadge = (tipo: string) => {
    const badges: Record<string, { variant: any; label: string }> = {
      refund: { variant: 'success', label: 'Reembolso' },
      overpayment: { variant: 'info', label: 'Pagamento Excedente' },
      promotional: { variant: 'warning', label: 'Promocional' },
      other: { variant: 'secondary', label: 'Outro' },
    }
    return badges[tipo] || { variant: 'secondary', label: tipo }
  }

  if (!credito) return null

  const saldoDisponivel = credito.valor_total - credito.valor_utilizado
  const tipoBadge = getTipoCreditoBadge(credito.tipo_credito)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Utilizações do Crédito</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Info do Crédito */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações do Crédito</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tipo:</span>
                <Badge variant={tipoBadge.variant}>{tipoBadge.label}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Descrição:</span>
                <span className="font-medium">{credito.descricao}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fornecedor:</span>
                <span className="font-medium">{credito.fornecedor?.nome || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor Total:</span>
                <span className="font-medium">
                  {formatCurrency(credito.valor_total, credito.moeda)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Valor Utilizado:</span>
                <span className="font-medium text-orange-600">
                  {formatCurrency(credito.valor_utilizado, credito.moeda)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saldo Disponível:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrency(saldoDisponivel, credito.moeda)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Utilizações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Duplicatas com Crédito Aplicado ({utilizacoes.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : utilizacoes.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  Este crédito ainda não foi aplicado em nenhuma duplicata
                </div>
              ) : (
                <div className="space-y-3">
                  {utilizacoes.map((utilizacao) => {
                    const statusBadge = getStatusBadge(
                      utilizacao.duplicata_pagar?.status || ''
                    )

                    return (
                      <div
                        key={utilizacao.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {utilizacao.duplicata_pagar?.numero_documento || 'S/N'}
                            </span>
                            <Badge variant={statusBadge.variant}>
                              {statusBadge.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {utilizacao.duplicata_pagar?.descricao}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Aplicado em:{' '}
                            {new Date(utilizacao.data_utilizacao).toLocaleDateString('pt-BR')}
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Valor Aplicado</p>
                            <p className="font-semibold text-orange-600">
                              {formatCurrency(utilizacao.valor_utilizado, credito.moeda)}
                            </p>
                          </div>
                          <Link
                            href={`/financeiro/duplicatas-pagar?id=${utilizacao.duplicata_pagar_id}`}
                            target="_blank"
                          >
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
