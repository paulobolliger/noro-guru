'use client'

import { useState, useEffect, useMemo } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

interface Credito {
  id: string
  fornecedor_id: string
  tipo_credito: string
  descricao: string
  valor_total: number
  valor_utilizado: number
  moeda: string
  fornecedor?: {
    nome: string
  }
}

interface DuplicataPagar {
  id: string
  numero_documento: string
  descricao: string
  fornecedor_id: string
  valor_pendente: number
  moeda: string
  marca: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  credito: Credito | null
  duplicatasPagar: DuplicataPagar[]
  tenantId: string
  onSuccess: () => void
}

export default function AplicarCreditoRapidoModal({
  isOpen,
  onClose,
  credito,
  duplicatasPagar,
  tenantId,
  onSuccess,
}: Props) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    duplicata_pagar_id: '',
    valor_aplicar: '',
    observacoes: '',
  })

  const [duplicataSelecionada, setDuplicataSelecionada] = useState<DuplicataPagar | null>(null)

  // Filtrar duplicatas compatíveis com o crédito
  const duplicatasCompativeis = useMemo(() => {
    if (!credito) return []

    return duplicatasPagar.filter((dup) => {
      // Mesmo fornecedor
      if (dup.fornecedor_id !== credito.fornecedor_id) return false
      
      // Mesma moeda
      if (dup.moeda !== credito.moeda) return false
      
      // Tem valor pendente
      if (dup.valor_pendente <= 0) return false

      return true
    })
  }, [credito, duplicatasPagar])

  // Resetar form quando abrir modal
  useEffect(() => {
    if (isOpen && credito) {
      setFormData({
        duplicata_pagar_id: '',
        valor_aplicar: '',
        observacoes: '',
      })
      setDuplicataSelecionada(null)
    }
  }, [isOpen, credito])

  // Atualizar duplicata selecionada e sugerir valor
  useEffect(() => {
    if (formData.duplicata_pagar_id && credito) {
      const dup = duplicatasCompativeis.find((d) => d.id === formData.duplicata_pagar_id)
      setDuplicataSelecionada(dup || null)

      if (dup) {
        // Sugerir valor: mínimo entre saldo do crédito e valor pendente
        const saldoCredito = credito.valor_total - credito.valor_utilizado
        const valorSugerido = Math.min(saldoCredito, dup.valor_pendente)
        setFormData((prev) => ({
          ...prev,
          valor_aplicar: valorSugerido.toFixed(2),
        }))
      }
    } else {
      setDuplicataSelecionada(null)
    }
  }, [formData.duplicata_pagar_id, credito, duplicatasCompativeis])

  const formatCurrency = (value: number, moeda: string = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: moeda,
    }).format(value)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!credito || !duplicataSelecionada) return

    // Validações
    if (!formData.duplicata_pagar_id) {
      showToast('error', 'Selecione uma duplicata')
      return
    }

    const valorAplicar = parseFloat(formData.valor_aplicar)
    if (isNaN(valorAplicar) || valorAplicar <= 0) {
      showToast('error', 'Valor deve ser maior que zero')
      return
    }

    const saldoCredito = credito.valor_total - credito.valor_utilizado
    if (valorAplicar > saldoCredito) {
      showToast('error', 'Valor maior que o saldo do crédito', `Saldo disponível: ${formatCurrency(saldoCredito, credito.moeda)}`)
      return
    }

    if (valorAplicar > duplicataSelecionada.valor_pendente) {
      showToast('error', 'Valor maior que o pendente da duplicata', `Pendente: ${formatCurrency(duplicataSelecionada.valor_pendente, duplicataSelecionada.moeda)}`)
      return
    }

    setLoading(true)
    try {
      const payload = {
        credito_id: credito.id,
        valor_aplicar: valorAplicar,
        observacoes: formData.observacoes || undefined,
      }

      const res = await fetch(
        `/api/duplicatas-pagar/${formData.duplicata_pagar_id}/aplicar-credito?tenant_id=${tenantId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      )

      if (res.ok) {
        showToast('success', 'Crédito aplicado com sucesso!')
        onSuccess()
        onClose()
      } else {
        const error = await res.json()
        showToast('error', 'Erro ao aplicar crédito', error.error || 'Tente novamente.')
      }
    } catch (error) {
      console.error('Erro ao aplicar crédito:', error)
      showToast('error', 'Erro ao aplicar crédito')
    } finally {
      setLoading(false)
    }
  }

  if (!credito) return null

  const saldoDisponivel = credito.valor_total - credito.valor_utilizado
  const tipoBadge = getTipoCreditoBadge(credito.tipo_credito)

  // Calcular novo valor pendente após aplicação
  const valorAplicar = parseFloat(formData.valor_aplicar) || 0
  const novoPendente = duplicataSelecionada
    ? duplicataSelecionada.valor_pendente - valorAplicar
    : 0

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Aplicar Crédito a Duplicata</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Info do Crédito */}
            <Card>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Tipo:</span>
                    <Badge variant={tipoBadge.variant}>{tipoBadge.label}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Descrição:</span>
                    <span className="text-sm font-medium">{credito.descricao}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Fornecedor:</span>
                    <span className="text-sm font-medium">{credito.fornecedor?.nome}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Valor Total:</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(credito.valor_total, credito.moeda)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Utilizado:</span>
                    <span className="text-sm text-orange-600">
                      {formatCurrency(credito.valor_utilizado, credito.moeda)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-sm font-medium">Saldo Disponível:</span>
                    <span className="text-sm font-bold text-green-600">
                      {formatCurrency(saldoDisponivel, credito.moeda)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seletor de Duplicata */}
            {duplicatasCompativeis.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Não há duplicatas pendentes compatíveis com este crédito.
                  <br />
                  <span className="text-xs">
                    (Deve ser do mesmo fornecedor, mesma moeda e ter valor pendente)
                  </span>
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="duplicata_pagar_id">Duplicata a Pagar *</Label>
                  <Select
                    value={formData.duplicata_pagar_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, duplicata_pagar_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a duplicata" />
                    </SelectTrigger>
                    <SelectContent>
                      {duplicatasCompativeis.map((dup) => (
                        <SelectItem key={dup.id} value={dup.id}>
                          {dup.numero_documento} - {dup.descricao} - Pendente:{' '}
                          {formatCurrency(dup.valor_pendente, dup.moeda)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Mostrando apenas duplicatas do mesmo fornecedor e moeda
                  </p>
                </div>

                {/* Info da Duplicata Selecionada */}
                {duplicataSelecionada && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-4">
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Número:</span>
                          <span className="font-medium">{duplicataSelecionada.numero_documento}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Marca:</span>
                          <Badge variant="secondary">{duplicataSelecionada.marca}</Badge>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Valor Pendente:</span>
                          <span className="font-semibold text-orange-600">
                            {formatCurrency(duplicataSelecionada.valor_pendente, duplicataSelecionada.moeda)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Valor a Aplicar */}
                <div className="grid gap-2">
                  <Label htmlFor="valor_aplicar">Valor a Aplicar *</Label>
                  <Input
                    id="valor_aplicar"
                    type="number"
                    step="0.01"
                    value={formData.valor_aplicar}
                    onChange={(e) =>
                      setFormData({ ...formData, valor_aplicar: e.target.value })
                    }
                    placeholder="0.00"
                    disabled={!duplicataSelecionada}
                  />
                  {duplicataSelecionada && valorAplicar > 0 && (
                    <Alert className="border-green-200 bg-green-50">
                      <AlertDescription className="text-sm">
                        Após aplicar {formatCurrency(valorAplicar, credito.moeda)}, o valor
                        pendente da duplicata será de{' '}
                        <span className="font-bold">
                          {formatCurrency(novoPendente, credito.moeda)}
                        </span>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>

                {/* Observações */}
                <div className="grid gap-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Input
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) =>
                      setFormData({ ...formData, observacoes: e.target.value })
                    }
                    placeholder="Observações sobre a aplicação do crédito"
                    disabled={!duplicataSelecionada}
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || duplicatasCompativeis.length === 0 || !duplicataSelecionada}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Aplicar Crédito
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
