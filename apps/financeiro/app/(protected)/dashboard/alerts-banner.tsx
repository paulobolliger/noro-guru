'use client';

import { AlertTriangle, Clock, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Alert {
  id: string;
  type: 'vencimento' | 'atrasado' | 'saldo_baixo';
  title: string;
  message: string;
  link?: string;
}

interface AlertsBannerProps {
  receitas: any[];
  despesas: any[];
  saldoTotal: number;
}

export function AlertsBanner({ receitas, despesas, saldoTotal }: AlertsBannerProps) {
  const hoje = new Date();
  const seteDias = new Date(hoje);
  seteDias.setDate(hoje.getDate() + 7);

  const alertas: Alert[] = [];

  // Verificar vencimentos próximos (próximos 7 dias)
  const vencimentosProximos = [...receitas, ...despesas].filter((item) => {
    const dataVencimento = new Date(item.data_vencimento);
    return (
      item.status === 'pendente' &&
      dataVencimento >= hoje &&
      dataVencimento <= seteDias
    );
  });

  if (vencimentosProximos.length > 0) {
    alertas.push({
      id: 'vencimentos',
      type: 'vencimento',
      title: 'Vencimentos Próximos',
      message: `${vencimentosProximos.length} ${
        vencimentosProximos.length === 1 ? 'conta vence' : 'contas vencem'
      } nos próximos 7 dias`,
    });
  }

  // Verificar contas atrasadas
  const contasAtrasadas = [...receitas, ...despesas].filter((item) => {
    const dataVencimento = new Date(item.data_vencimento);
    return item.status === 'pendente' && dataVencimento < hoje;
  });

  if (contasAtrasadas.length > 0) {
    alertas.push({
      id: 'atrasadas',
      type: 'atrasado',
      title: 'Contas Atrasadas',
      message: `${contasAtrasadas.length} ${
        contasAtrasadas.length === 1 ? 'conta atrasada' : 'contas atrasadas'
      }`,
    });
  }

  // Verificar saldo baixo (< R$ 5.000)
  if (saldoTotal < 5000 && saldoTotal > 0) {
    alertas.push({
      id: 'saldo',
      type: 'saldo_baixo',
      title: 'Saldo Baixo',
      message: `Saldo total de ${new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(saldoTotal)} está abaixo do limite recomendado`,
      link: '/bancos',
    });
  }

  if (alertas.length === 0) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'vencimento':
        return <Clock className="h-5 w-5" />;
      case 'atrasado':
        return <AlertTriangle className="h-5 w-5" />;
      case 'saldo_baixo':
        return <TrendingDown className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getStyles = (type: string) => {
    switch (type) {
      case 'vencimento':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'atrasado':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'saldo_baixo':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-3 mb-6">
      {alertas.map((alerta) => (
        <div
          key={alerta.id}
          className={`flex items-start gap-3 p-4 rounded-lg border ${getStyles(
            alerta.type
          )}`}
        >
          <div className="flex-shrink-0 mt-0.5">{getIcon(alerta.type)}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-sm">{alerta.title}</p>
              <Badge variant="outline" className="text-xs">
                Atenção
              </Badge>
            </div>
            <p className="text-sm mt-1">{alerta.message}</p>
          </div>
          {alerta.link && (
            <Link
              href={alerta.link}
              className="flex-shrink-0 text-sm font-medium hover:underline"
            >
              Ver detalhes →
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}
