import { useState } from 'react';

interface RelatorioConfig {
  dataInicial: string;
  dataFinal: string;
  tipoRelatorio: 'margens' | 'regras' | 'simulacoes' | 'completo';
  formato: 'excel' | 'pdf';
  incluirGraficos: boolean;
  incluirDetalhamento: boolean;
  incluirComparativoPeriodoAnterior: boolean;
}

interface UseGerarRelatorioReturn {
  gerarRelatorio: (config: RelatorioConfig) => Promise<string>;
  isLoading: boolean;
  error: Error | null;
}

export function useGerarRelatorio(): UseGerarRelatorioReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const gerarRelatorio = async (_config: RelatorioConfig) => {
    setIsLoading(true);
    const err = new Error('Relatórios de pricing dependiam de funções SQL sem modelo de dados ativo.');
    setError(err);
    setIsLoading(false);
    throw err;
  };

  return { gerarRelatorio, isLoading, error };
}
