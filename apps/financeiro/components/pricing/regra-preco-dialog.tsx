'use client'

import { RegraPreco, TipoRegraPreco, TipoMarkup } from '@/types/pricing'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { RegraPrecoPadraoForm } from './regra-preco-padrao-form'
import { useState } from 'react'

interface RegraPrecoPadraoProps {
  regra?: RegraPreco
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: Partial<RegraPreco>) => void
}

export function RegraPrecoPadraoDialog({
  regra,
  open,
  onOpenChange,
  onSave
}: RegraPrecoPadraoProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: Partial<RegraPreco>) => {
    try {
      setIsSubmitting(true)
      await onSave(data)
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar regra:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {regra ? 'Editar Regra de Preço' : 'Nova Regra de Preço'}
          </DialogTitle>
          <DialogDescription>
            {regra 
              ? 'Edite os detalhes da regra de preço selecionada.' 
              : 'Configure uma nova regra de preço para o sistema.'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RegraPrecoPadraoForm
            regra={regra}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="regra-preco-form"
            disabled={isSubmitting}
          >
            {regra ? 'Salvar Alterações' : 'Criar Regra'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}