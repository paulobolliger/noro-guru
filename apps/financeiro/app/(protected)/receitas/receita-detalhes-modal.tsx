'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog-simple';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ReceitaDetalhesModalProps {
  isOpen: boolean;
  onClose: () => void;
  receita: any;
}

export function ReceitaDetalhesModal({
  isOpen,
  onClose,
  receita,
}: ReceitaDetalhesModalProps) {
  if (!receita) return null;

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
          <DialogTitle>Detalhes da Receita</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Informações Básicas */}
          <div>
            <h3 className="font-semibold mb-2">Informações Básicas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Descrição</div>
                <div className="font-medium">{receita.descricao}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Marca</div>
                <Badge variant="outline">{receita.marca}</Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Valor</div>
                <div className="font-bold text-lg">
                  {formatarMoeda(receita.valor_brl || 0)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Status</div>
                <Badge
                  className={
                    receita.status === 'pago'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }
                >
                  {receita.status}
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
                <div>{formatarData(receita.data_vencimento)}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Competência</div>
                <div>{formatarData(receita.data_competencia)}</div>
              </div>
              {receita.data_pagamento && (
                <div>
                  <div className="text-sm text-muted-foreground">Pagamento</div>
                  <div>{formatarData(receita.data_pagamento)}</div>
                </div>
              )}
            </div>
          </div>

          {receita.categoria && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Categoria</h3>
                <div className="flex items-center gap-2">
                  <span>{receita.categoria.icone}</span>
                  <span>{receita.categoria.nome}</span>
                </div>
              </div>
            </>
          )}

          {receita.conta_bancaria && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Conta Bancária</h3>
                <div>
                  {receita.conta_bancaria.nome} - {receita.conta_bancaria.banco}
                </div>
              </div>
            </>
          )}

          {receita.recorrente && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Recorrência</h3>
                <div className="flex items-center gap-2">
                  <Badge>🔄 {receita.frequencia_recorrencia}</Badge>
                  {receita.proximo_vencimento && (
                    <span className="text-sm text-muted-foreground">
                      Próximo: {formatarData(receita.proximo_vencimento)}
                    </span>
                  )}
                </div>
              </div>
            </>
          )}

          {receita.possui_comissao && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Comissão</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Percentual</div>
                    <div>{receita.percentual_comissao}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Valor</div>
                    <div>{formatarMoeda(receita.valor_comissao || 0)}</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
