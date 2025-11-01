'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
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
import { useToast } from '@/hooks/use-toast'

interface Adiantamento {
  id: string
  fornecedor_id: string
  descricao: string
  valor_total: number
  valor_utilizado: number
  data_adiantamento: string
  marca: string
  moeda: string
  observacoes?: string
}

interface Fornecedor {
  id: string
  nome: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  adiantamento: Adiantamento | null
  fornecedores: Fornecedor[]
  tenantId: string
  onSuccess: () => void
}

export default function AdiantamentoFormModal({
  isOpen,
  onClose,
  adiantamento,
  fornecedores,
  tenantId,
  onSuccess,
}: Props) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    fornecedor_id: '',
    descricao: '',
    valor_total: '',
    data_adiantamento: '',
    marca: 'Atlantica',
    moeda: 'BRL',
    observacoes: '',
  })

  // Preencher form ao editar
  useEffect(() => {
    if (adiantamento) {
      setFormData({
        fornecedor_id: adiantamento.fornecedor_id,
        descricao: adiantamento.descricao,
        valor_total: adiantamento.valor_total.toString(),
        data_adiantamento: adiantamento.data_adiantamento.split('T')[0],
        marca: adiantamento.marca,
        moeda: adiantamento.moeda,
        observacoes: adiantamento.observacoes || '',
      })
    } else {
      // Resetar form para novo
      const hoje = new Date().toISOString().split('T')[0]
      setFormData({
        fornecedor_id: '',
        descricao: '',
        valor_total: '',
        data_adiantamento: hoje,
        marca: 'Atlantica',
        moeda: 'BRL',
        observacoes: '',
      })
    }
  }, [adiantamento, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validações
    if (!formData.descricao.trim()) {
      showToast('error', 'Descrição é obrigatória')
      return
    }

    if (!formData.fornecedor_id) {
      showToast('error', 'Fornecedor é obrigatório')
      return
    }

    const valorTotal = parseFloat(formData.valor_total)
    if (isNaN(valorTotal) || valorTotal <= 0) {
      showToast('error', 'Valor total deve ser maior que zero')
      return
    }

    if (!formData.data_adiantamento) {
      showToast('error', 'Data do adiantamento é obrigatória')
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...formData,
        valor_total: valorTotal,
        tenant_id: tenantId,
      }

      const url = adiantamento
        ? `/api/adiantamentos/${adiantamento.id}?tenant_id=${tenantId}`
        : `/api/adiantamentos?tenant_id=${tenantId}`

      const method = adiantamento ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        showToast(
          'success',
          adiantamento ? 'Adiantamento atualizado!' : 'Adiantamento criado com sucesso!'
        )
        onSuccess()
        onClose()
      } else {
        const error = await res.json()
        showToast('error', 'Erro ao salvar adiantamento', error.error || 'Tente novamente.')
      }
    } catch (error) {
      console.error('Erro ao salvar adiantamento:', error)
      showToast('error', 'Erro ao salvar adiantamento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {adiantamento ? 'Editar Adiantamento' : 'Novo Adiantamento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="fornecedor_id">Fornecedor *</Label>
              <Select
                value={formData.fornecedor_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, fornecedor_id: value })
                }
                disabled={adiantamento && adiantamento.valor_utilizado > 0}
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
              {adiantamento && adiantamento.valor_utilizado > 0 && (
                <p className="text-xs text-muted-foreground">
                  Fornecedor não pode ser alterado pois o adiantamento já foi utilizado
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
                placeholder="Ex: Adiantamento para hotel RateHawk"
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
                  disabled={adiantamento && adiantamento.valor_utilizado > 0}
                />
                {adiantamento && adiantamento.valor_utilizado > 0 && (
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
                  disabled={adiantamento && adiantamento.valor_utilizado > 0}
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

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="data_adiantamento">Data do Adiantamento *</Label>
                <Input
                  id="data_adiantamento"
                  type="date"
                  value={formData.data_adiantamento}
                  onChange={(e) =>
                    setFormData({ ...formData, data_adiantamento: e.target.value })
                  }
                />
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
              {adiantamento ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
