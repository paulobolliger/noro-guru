'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { checkStripeIntegration } from './actions';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

interface IntegrationStatus {
  apiConnection: boolean;
  webhookConfiguration: boolean;
  subscriptionProducts: boolean;
  lastWebhook?: string;
  errors?: string[];
}

export default function StripeStatus() {
  const [status, setStatus] = useState<IntegrationStatus | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const checkStatus = async () => {
    try {
      setIsChecking(true);
      const result = await checkStripeIntegration();
      setStatus(result);
    } catch (error) {
      console.error('Erro ao verificar status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  if (!status) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Status da Integração</CardTitle>
          <CardDescription>
            Verificando status da integração com o Stripe...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const hasErrors = !status.apiConnection || !status.webhookConfiguration || !status.subscriptionProducts;

  return (
    <Card className={hasErrors ? 'border-red-200' : 'border-green-200'}>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Status da Integração</CardTitle>
          <CardDescription>
            Status dos componentes da integração com o Stripe
          </CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={checkStatus}
          disabled={isChecking}
        >
          <RefreshCw className={isChecking ? 'animate-spin' : ''} />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {status.apiConnection ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
            <span className="font-medium">Conexão com API</span>
            <Badge variant={status.apiConnection ? 'success' : 'destructive'}>
              {status.apiConnection ? 'OK' : 'Erro'}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {status.webhookConfiguration ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
            <span className="font-medium">Configuração de Webhook</span>
            <Badge variant={status.webhookConfiguration ? 'success' : 'destructive'}>
              {status.webhookConfiguration ? 'OK' : 'Erro'}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {status.subscriptionProducts ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
            <span className="font-medium">Produtos e Preços</span>
            <Badge variant={status.subscriptionProducts ? 'success' : 'destructive'}>
              {status.subscriptionProducts ? 'OK' : 'Erro'}
            </Badge>
          </div>

          {status.lastWebhook && (
            <div className="mt-4 text-sm text-muted-foreground">
              Último webhook recebido: {new Date(status.lastWebhook).toLocaleString()}
            </div>
          )}
        </div>

        {status.errors && status.errors.length > 0 && (
          <div className="rounded-lg bg-red-50 p-4">
            <div className="font-medium text-red-800 mb-2">
              Problemas encontrados:
            </div>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
              {status.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}