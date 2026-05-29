'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { emitirCobranca } from '@/app/pedidos/pedidos-actions';
import type { PaymentProvider } from '@/app/(protected)/pedidos/pedidos-actions';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Loader2, DollarSign, Copy, CreditCard, QrCode
} from 'lucide-react';
import { Database } from '@/types/database';
import { format } from 'date-fns';

type Cobranca = Database['public']['Tables']['cobrancas']['Row'];

interface EmitirCobrancaFormProps {
  pedidoId: string;
  valorTotal: number;
  cobrancasExistentes: Cobranca[];
}

const PAYMENT_PROVIDERS: { value: PaymentProvider; label: string; icon: React.ReactNode }[] = [
  { value: 'EREDE_PIX',     label: 'e.Rede — PIX',     icon: <QrCode className="h-4 w-4" /> },
  { value: 'EREDE_CREDITO', label: 'e.Rede — Crédito', icon: <CreditCard className="h-4 w-4" /> },
  { value: 'EREDE_DEBITO',  label: 'e.Rede — Débito',  icon: <CreditCard className="h-4 w-4" /> },
];

const STATUS_STYLES: Record<string, string> = {
  PENDENTE: 'bg-gray-100 text-gray-700',
  EMITIDA: 'bg-blue-100 text-blue-700',
  AGUARDANDO_PAGAMENTO: 'bg-amber-100 text-amber-800 font-bold',
  PROCESSANDO_API: 'bg-yellow-100 text-yellow-700',
  PAGO: 'bg-green-100 text-green-700 font-bold',
  ERRO_API: 'bg-red-100 text-red-700',
  ESTORNADO: 'bg-purple-100 text-purple-700',
  RECUSADO: 'bg-red-100 text-red-700',
};

const isCardProvider = (p: PaymentProvider) =>
  p === 'EREDE_CREDITO' || p === 'EREDE_DEBITO';

const isPixProvider = (p: PaymentProvider) => p === 'EREDE_PIX';

export default function EmitirCobrancaForm({
  pedidoId,
  valorTotal,
  cobrancasExistentes,
}: EmitirCobrancaFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const defaultDueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .substring(0, 10);

  const [provider, setProvider] = useState<PaymentProvider>('EREDE_PIX');
  const [dueDate, setDueDate] = useState(defaultDueDate);
  const [pixQrCode, setPixQrCode] = useState<string | null>(null);

  // Campos de cartão e.Rede
  const [card, setCard] = useState({
    cardholderName: '',
    cardNumber: '',
    expirationMonth: '',
    expirationYear: '',
    securityCode: '',
    parcelas: '1',
  });

  const hasActiveCobranca = cobrancasExistentes.some(
    (c) => c.status === 'EMITIDA' || c.status === 'AGUARDANDO_PAGAMENTO' || c.status === 'PROCESSANDO_API'
  );

  const handleProviderChange = (value: string) => {
    setProvider(value as PaymentProvider);
    setPixQrCode(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPixQrCode(null);

    startTransition(async () => {
      const payload: Parameters<typeof emitirCobranca>[0] = {
        pedido_id: pedidoId,
        provider: provider as 'EREDE_CREDITO' | 'EREDE_DEBITO' | 'EREDE_PIX',
        data_vencimento: dueDate,
      };

      if (isCardProvider(provider)) {
        if (
          !card.cardholderName ||
          !card.cardNumber ||
          !card.expirationMonth ||
          !card.expirationYear ||
          !card.securityCode
        ) {
          toast({ title: 'Preencha todos os dados do cartão.', variant: 'destructive' });
          return;
        }
        payload.cardholderName = card.cardholderName;
        payload.cardNumber = card.cardNumber.replace(/\D/g, '');
        payload.expirationMonth = parseInt(card.expirationMonth, 10);
        payload.expirationYear = parseInt(card.expirationYear, 10);
        payload.securityCode = card.securityCode;
        payload.parcelas = parseInt(card.parcelas, 10);
      }

      if (isPixProvider(provider)) {
        payload.pixExpirationSeconds = 3600; // 1 hora
      }

      const result = await emitirCobranca(payload);

      if (result.success) {
        // 3DS redirect — sucesso mas requer ação do cliente
        if (result.data?.requiresRedirect && result.data?.redirectUrl) {
          toast({
            title: 'Autenticação 3DS necessária',
            description: 'Redirecionando para autenticação do banco emissor...',
          });
          window.location.href = result.data.redirectUrl;
          return;
        }

        toast({ title: 'Cobrança emitida!', description: result.message });

        // e.Rede PIX — exibe QR Code imediatamente
        if (result.data?.qrCode) {
          setPixQrCode(result.data.qrCode);
        }

        router.refresh();
      } else {
        toast({ title: 'Erro na emissão', description: result.message, variant: 'destructive' });
      }
    });
  };

  const getPaymentDetail = (cobranca: Cobranca) => {
    const data = cobranca.provider_data as any;
    if (!data) return { pixCode: null, copyValue: '' };

    // e.Rede PIX — copia e cola (EMV)
    if (data.qrCode) {
      return { pixCode: data.qrCode, copyValue: data.qrCode };
    }
    // e.Rede Cartão — TID
    if (data.tid) {
      return { pixCode: null, copyValue: data.tid };
    }
    return { pixCode: null, copyValue: '' };
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copiado!', description: 'Código copiado para a área de transferência.' });
  };

  return (
    <Card className={`shadow-lg ${hasActiveCobranca ? 'border-amber-400' : 'border-indigo-500'}`}>
      <CardHeader className={hasActiveCobranca ? 'bg-amber-50' : 'bg-indigo-50'}>
        <CardTitle className="text-lg flex items-center text-indigo-700">
          <DollarSign className="w-5 h-5 mr-2" />
          {hasActiveCobranca ? 'Cobrança Pendente de Pagamento' : 'Emitir Nova Cobrança'}
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Formulário de emissão */}
        {!hasActiveCobranca && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Provider + Vencimento */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Forma de Pagamento</Label>
                <Select value={provider} onValueChange={handleProviderChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_PROVIDERS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        <span className="flex items-center gap-2">
                          {p.icon} {p.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Data de Vencimento</Label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  disabled={isPending}
                />
              </div>
            </div>

            {/* Campos de Cartão — apenas para e.Rede Crédito / Débito */}
            {isCardProvider(provider) && (
              <div className="border border-slate-200 rounded-lg p-4 space-y-4 bg-slate-50">
                <p className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> Dados do Cartão
                </p>

                <div className="space-y-2">
                  <Label>Nome no Cartão</Label>
                  <Input
                    placeholder="NOME COMPLETO (como no cartão)"
                    value={card.cardholderName}
                    onChange={(e) => setCard((c) => ({ ...c, cardholderName: e.target.value.toUpperCase() }))}
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Número do Cartão</Label>
                  <Input
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    value={card.cardNumber}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                      const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
                      setCard((c) => ({ ...c, cardNumber: formatted }));
                    }}
                    disabled={isPending}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label>Mês Exp.</Label>
                    <Input
                      placeholder="MM"
                      maxLength={2}
                      value={card.expirationMonth}
                      onChange={(e) => setCard((c) => ({ ...c, expirationMonth: e.target.value.replace(/\D/g, '') }))}
                      disabled={isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Ano Exp.</Label>
                    <Input
                      placeholder="AAAA"
                      maxLength={4}
                      value={card.expirationYear}
                      onChange={(e) => setCard((c) => ({ ...c, expirationYear: e.target.value.replace(/\D/g, '') }))}
                      disabled={isPending}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>CVV</Label>
                    <Input
                      placeholder="000"
                      maxLength={4}
                      type="password"
                      value={card.securityCode}
                      onChange={(e) => setCard((c) => ({ ...c, securityCode: e.target.value.replace(/\D/g, '') }))}
                      disabled={isPending}
                    />
                  </div>
                </div>

                {provider === 'EREDE_CREDITO' && (
                  <div className="space-y-2">
                    <Label>Parcelas</Label>
                    <Select
                      value={card.parcelas}
                      onValueChange={(v) => setCard((c) => ({ ...c, parcelas: v }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n === 1 ? '1x à vista' : `${n}x de ${formatCurrency(valorTotal / n)}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            {/* Info PIX */}
            {isPixProvider(provider) && (
              <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                <QrCode className="h-4 w-4 text-slate-500 shrink-0" />
                <span>Um QR Code PIX com validade de <strong>1 hora</strong> será gerado. O cliente efetua o pagamento pelo app do banco.</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t">
              <p className="text-sm text-gray-600">
                Valor:{' '}
                <span className="font-semibold text-gray-900">{formatCurrency(valorTotal)}</span>
              </p>
              <Button type="submit" disabled={isPending} className="min-w-[140px]">
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isPending ? 'Processando...' : 'Emitir Cobrança'}
              </Button>
            </div>
          </form>
        )}

        {/* QR Code PIX gerado na hora */}
        {pixQrCode && (
          <div className="border border-green-300 bg-green-50 rounded-lg p-4 space-y-3 text-center">
            <p className="font-semibold text-green-800 flex items-center justify-center gap-2">
              <QrCode className="h-5 w-5" /> QR Code PIX Gerado
            </p>
            <div className="bg-white border border-green-200 rounded p-3 font-mono text-xs break-all text-slate-700 max-h-24 overflow-y-auto">
              {pixQrCode}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-green-300 text-green-700 hover:bg-green-100"
              onClick={() => handleCopy(pixQrCode)}
            >
              <Copy className="h-4 w-4 mr-2" /> Copiar código PIX
            </Button>
          </div>
        )}

        {/* Histórico de cobranças ativas */}
        {cobrancasExistentes.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-slate-700 border-b pb-2">Cobranças em Aberto</h4>
            {cobrancasExistentes
              .filter((c) => !['PAGO', 'CANCELADO', 'ERRO_API', 'ESTORNADO'].includes(c.status))
              .map((cobranca) => {
                const { copyValue } = getPaymentDetail(cobranca);
                return (
                  <div
                    key={cobranca.id}
                    className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between gap-2"
                  >
                    <div>
                      <Badge className={STATUS_STYLES[cobranca.status] || 'bg-gray-100'}>
                        {cobranca.status.replace(/_/g, ' ')}
                      </Badge>
                      <span className="ml-2 text-xs text-gray-500">
                        via {cobranca.provider.replace('EREDE_', 'e.Rede ')} · vence{' '}
                        {cobranca.data_vencimento
                          ? format(new Date(cobranca.data_vencimento), 'dd/MM/yyyy')
                          : '—'}
                      </span>
                    </div>
                    {copyValue && (
                      <Button variant="secondary" size="sm" onClick={() => handleCopy(copyValue)}>
                        <Copy className="h-4 w-4 mr-1" /> Copiar
                      </Button>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
