'use client';

import { useState } from 'react';
import { createBillingPortalSession } from '@/app/actions';

interface BillingPortalProps {
  tenantId: string;
  customerEmail: string;
}

export default function BillingPortal({ tenantId, customerEmail }: BillingPortalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenPortal = async () => {
    try {
      setIsLoading(true);
      const { url } = await createBillingPortalSession({ tenantId, customerEmail });
      window.location.href = url;
    } catch (error) {
      console.error('Erro ao abrir portal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-2">Portal de Faturamento</h2>
      <p className="text-sm text-gray-600 mb-4">
        Gerencie assinatura, métodos de pagamento e histórico de faturas pelo Stripe.
      </p>
      <button
        onClick={handleOpenPortal}
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {isLoading ? 'Abrindo portal...' : 'Abrir Portal de Faturamento'}
      </button>
    </div>
  );
}
