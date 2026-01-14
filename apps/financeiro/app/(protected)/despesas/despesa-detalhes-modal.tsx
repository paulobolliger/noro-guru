'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@noro/ui';
import { Badge } from '@noro/ui';
import { Separator } from '@noro/ui';

interface DespesaDetalhesModalProps {
  isOpen: boolean;
  onClose: () => void;
  despesa: any;
}

export function DespesaDetalhesModal({
  isOpen,
  onClose,
  despesa,
}: DespesaDetalhesModalProps) {
  if (!despesa) return null;

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Despesa</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações Básicas */}
          <div>
            <h3 className="font-semibold mb-2">Informações Básicas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Descrição</div>
                <div className="font-medium">{despesa.descricao}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Marca</div>
                <Badge variant="outline">{despesa.marca}</Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Valor</div>
                <div className="font-bold text-lg text-red-600">
                  {formatarMoeda(despesa.valor_brl || 0)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <Badge
                  className={
                    despesa.status === 'pago'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }
                >
                  {despesa.status}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Datas */}
          <div>
            <h3 className="font-semibold mb-2">Datas</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Vencimento</div>
                <div>{formatarData(despesa.data_vencimento)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Competência</div>
                <div>{formatarData(despesa.data_competencia)}</div>
              </div>
              {despesa.data_pagamento && (
                <div>
                  <div className="text-sm text-muted-foreground">Pagamento</div>
                  <div>{formatarData(despesa.data_pagamento)}</div>
                </div>
              )}
            </div>
          </div>

          {despesa.categoria && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Categoria</h3>
                <div className="flex items-center gap-2">
                  <span>{despesa.categoria.icone}</span>
                  <span>{despesa.categoria.nome}</span>
                </div>
              </div>
            </>
          )}

          {despesa.conta_bancaria && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Conta Bancária</h3>
                <div>
                  {despesa.conta_bancaria.nome} - {despesa.conta_bancaria.banco}
                </div>
              </div>
            </>
          )}

          {despesa.recorrente && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Recorrência</h3>
                <div className="flex items-center gap-2">
                  <Badge>🔄 {despesa.frequencia_recorrencia}</Badge>
                  {despesa.proximo_vencimento && (
                    <span className="text-sm text-muted-foreground">
                      Próximo: {formatarData(despesa.proximo_vencimento)}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}

          {despesa.observacoes && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Observações</h3>
                <div className="text-sm text-muted-foreground">
                  {despesa.observacoes}
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
