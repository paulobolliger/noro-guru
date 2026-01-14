'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@noro/ui'
import { Button } from '@noro/ui'
import { Input } from '@noro/ui'
import { Label } from '@noro/ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@noro/ui'
import { useToast } from '@noro/ui'

interface Credito {
  id: string
  fornecedor_id: string
  tipo_credito: 'refund' | 'overpayment' | 'promotional' | 'other'
  descricao: string
  valor_total: number
  valor_utilizado: number
  data_credito: string
  data_validade?: string
  marca: string
  moeda: string
  motivo?: string
  observacoes?: string
}

interface Fornecedor {
  id: string
  nome: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  credito: Credito | null
  fornecedores: Fornecedor[]
  tenantId: string
  onSuccess: () => void
}

export default function CreditoFormModal({
  isOpen,
  onClose,
  credito,
  fornecedores,
  tenantId,
  onSuccess,
}: Props) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    fornecedor_id: '',
    tipo_credito: 'refund' as 'refund' | 'overpayment' | 'promotional' | 'other',
    descricao: '',
    valor_total: '',
    data_credito: '',
    data_validade: '',
    marca: 'Atlantica',
    moeda: 'BRL',
    motivo: '',
    observacoes: '',
  })

  // Preencher form ao editar
  useEffect(() => {
    if (credito) {
      setFormData({
        fornecedor_id: credito.fornecedor_id,
        tipo_credito: credito.tipo_credito,
        descricao: credito.descricao,
        valor_total: credito.valor_total.toString(),
        data_credito: credito.data_credito.split('T')[0],
        data_validade: credito.data_validade ? credito.data_validade.split('T')[0] : '',
        marca: credito.marca,
        moeda: credito.moeda,
        motivo: credito.motivo || '',
        observacoes: credito.observacoes || '',
      })
    } else {
      // Resetar form para novo
      const hoje = new Date().toISOString().split('T')[0]
      setFormData({
        fornecedor_id: '',
        tipo_credito: 'refund',
        descricao: '',
        valor_total: '',
        data_credito: hoje,
        data_validade: '',
        marca: 'Atlantica',
        moeda: 'BRL',
        motivo: '',
        observacoes: '',
      })
    }
  }, [credito, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validações
    if (!formData.descricao.trim()) {
      toast({
        title: 'Erro',
        description: 'Descrição é obrigatória',
        variant: 'destructive',
      })
      return
    }

    if (!formData.fornecedor_id) {
      toast({
        title: 'Erro',
        description: 'Fornecedor é obrigatório',
        variant: 'destructive',
      })
      return
    }

    const valorTotal = parseFloat(formData.valor_total)
    if (isNaN(valorTotal) || valorTotal <= 0) {
      toast({
        title: 'Erro',
        description: 'Valor total deve ser maior que zero',
        variant: 'destructive',
      })
      return
    }

    if (!formData.data_credito) {
      toast({
        title: 'Erro',
        description: 'Data do crédito é obrigatória',
        variant: 'destructive',
      })
      return
    }

    // Validar data de validade se informada
    if (formData.data_validade) {
      const dataValidade = new Date(formData.data_validade)
      const dataCredito = new Date(formData.data_credito)
      if (dataValidade < dataCredito) {
        toast({
          title: 'Erro',
          description: 'Data de validade não pode ser anterior à data do crédito',
          variant: 'destructive',
        })
        return
      }
    }

    setLoading(true)
    try {
      const payload = {
        ...formData,
        valor_total: valorTotal,
        data_validade: formData.data_validade || null,
        tenant_id: tenantId,
      }

      const url = credito
        ? `/api/creditos/${credito.id}?tenant_id=${tenantId}`
        : `/api/creditos?tenant_id=${tenantId}`

      const method = credito ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast({
          title: credito ? 'Crédito atualizado!' : 'Crédito criado com sucesso!',
          variant: 'success',
        })
        onSuccess()
        onClose()
      } else {
        const error = await res.json()
        toast({
          title: 'Erro ao salvar crédito',
          description: error.error || 'Tente novamente.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Erro ao salvar crédito:', error)
      toast({
        title: 'Erro ao salvar crédito',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {credito ? 'Editar Crédito' : 'Novo Crédito'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fornecedor_id">Fornecedor *</Label>
                <Select
                  value={formData.fornecedor_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, fornecedor_id: value })
                  }
                  disabled={!!(credito && credito.valor_utilizado > 0)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o fornecedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {fornecedores.map((fornecedor) => (
                      <SelectItem key={fornecedor.id} value={fornecedor.id}>
                        {fornecedor.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {credito && credito.valor_utilizado > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Fornecedor não pode ser alterado pois o crédito já foi utilizado
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tipo_credito">Tipo de Crédito *</Label>
                <Select
                  value={formData.tipo_credito}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, tipo_credito: value })
                  }
                  disabled={!!(credito && credito.valor_utilizado > 0)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="refund">Reembolso</SelectItem>
                    <SelectItem value="overpayment">Pagamento Excedente</SelectItem>
                    <SelectItem value="promotional">Promocional</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                placeholder="Ex: Reembolso de cancelamento hotel"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="motivo">Motivo</Label>
              <Input
                id="motivo"
                value={formData.motivo}
                onChange={(e) =>
                  setFormData({ ...formData, motivo: e.target.value })
                }
                placeholder="Motivo do crédito"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="valor_total">Valor Total *</Label>
                <Input
                  id="valor_total"
                  type="number"
                  step="0.01"
                  value={formData.valor_total}
                  onChange={(e) =>
                    setFormData({ ...formData, valor_total: e.target.value })
                  }
                  placeholder="0.00"
                  disabled={!!(credito && credito.valor_utilizado > 0)}
                />
                {credito && credito.valor_utilizado > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Valor não pode ser alterado pois já foi parcialmente utilizado
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="moeda">Moeda</Label>
                <Select
                  value={formData.moeda}
                  onValueChange={(value) => setFormData({ ...formData, moeda: value })}
                  disabled={!!(credito && credito.valor_utilizado > 0)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">BRL (R$)</SelectItem>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="data_credito">Data do Crédito *</Label>
                <Input
                  id="data_credito"
                  type="date"
                  value={formData.data_credito}
                  onChange={(e) =>
                    setFormData({ ...formData, data_credito: e.target.value })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="data_validade">Data de Validade</Label>
                <Input
                  id="data_validade"
                  type="date"
                  value={formData.data_validade}
                  onChange={(e) =>
                    setFormData({ ...formData, data_validade: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Deixe vazio se não houver validade
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="marca">Marca</Label>
                <Select
                  value={formData.marca}
                  onValueChange={(value) => setFormData({ ...formData, marca: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Atlantica">Atlantica</SelectItem>
                    <SelectItem value="RateHawk">RateHawk</SelectItem>
                    <SelectItem value="Hurb">Hurb</SelectItem>
                    <SelectItem value="MaxMilhas">MaxMilhas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Input
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) =>
                  setFormData({ ...formData, observacoes: e.target.value })
                }
                placeholder="Observações adicionais"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {credito ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
