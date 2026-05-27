import { useState } from 'react';
import type { MarkupPadrao, RegraPreco, SimulacaoPreco } from '@/types/pricing';
import { pricingApi } from '@/lib/api/pricing';
import { toast } from 'sonner';

export function usePricing() {
  const [markups, setMarkups] = useState<MarkupPadrao[]>([]);
  const [regrasPreco, setRegrasPreco] = useState<RegraPreco[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const runDisabledMutation = async () => {
    toast.error('Precificação não possui collections Appwrite oficiais.');
    throw new Error('Precificação não possui collections Appwrite oficiais.');
  };

  return {
    markups,
    regrasPreco,
    isLoading,
    loadMarkups: async () => {
      setIsLoading(true);
      setMarkups(await pricingApi.listMarkups());
      setIsLoading(false);
    },
    createMarkup: runDisabledMutation,
    updateMarkup: runDisabledMutation,
    toggleMarkupStatus: runDisabledMutation,
    loadRegrasPreco: async () => {
      setIsLoading(true);
      setRegrasPreco(await pricingApi.listRegrasPreco());
      setIsLoading(false);
    },
    createRegraPreco: runDisabledMutation,
    updateRegraPreco: runDisabledMutation,
    toggleRegraPrecoStatus: runDisabledMutation,
    simularPreco: async (_params: SimulacaoPreco) => runDisabledMutation(),
    metricas: null,
    previsoes: [],
  };
}
