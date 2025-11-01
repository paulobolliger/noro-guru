'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createBillingPortalSession } from './actions';
import { CreditCard, ExternalLink } from 'lucide-react';

interface BillingPortalProps {
  tenantId: string;
  customerEmail: string;
}

export default function BillingPortal({ tenantId, customerEmail }: BillingPortalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenPortal = async () => {
    try {
      setIsLoading(true);
      const { url } = await createBillingPortalSession({
        tenantId,
        customerEmail
      });
      window.location.href = url;
    } catch (error) {
      console.error('Erro ao abrir portal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portal de Faturamento</CardTitle>
        <CardDescription>
          Gerencie sua assinatura e métodos de pagamento
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            No portal de faturamento você pode:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Atualizar métodos de pagamento</li>
              <li>Ver histórico de faturas</li>
              <li>Baixar recibos</li>
              <li>Atualizar informações de faturamento</li>
            </ul>
          </div>

          <Button
            onClick={handleOpenPortal}
            disabled={isLoading}
            className="w-full"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {isLoading ? 'Abrindo portal...' : 'Abrir Portal de Faturamento'}
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}