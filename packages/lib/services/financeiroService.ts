import { createTenantCollectionService, type TenantScopedDocument } from './runtimeCrud';

export interface FinTransacao extends TenantScopedDocument {
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  status?: string;
  data?: string;
}

export interface FinDuplicataReceber extends TenantScopedDocument {
  clienteId?: string;
  descricao?: string;
  valor: number;
  vencimento: string;
  status: string;
}

export interface FinDuplicataPagar extends TenantScopedDocument {
  fornecedorId?: string;
  descricao?: string;
  valor: number;
  vencimento: string;
  status: string;
}

export interface FinContaBancaria extends TenantScopedDocument {
  nome: string;
  banco?: string;
  agencia?: string;
  conta?: string;
  saldoInicial?: number;
}

export interface FinComissao extends TenantScopedDocument {
  descricao?: string;
  valor: number;
  status: string;
  favorecidoId?: string;
}

export const finTransacoesService = createTenantCollectionService<FinTransacao>(
  'fin_transacoes',
);
export const finDuplicatasReceberService =
  createTenantCollectionService<FinDuplicataReceber>(
    'fin_duplicatas_receber',
  );
export const finDuplicatasPagarService = createTenantCollectionService<FinDuplicataPagar>(
  'fin_duplicatas_pagar',
);
export const finContasBancariasService = createTenantCollectionService<FinContaBancaria>(
  'fin_contas_bancarias',
);
export const finComissoesService = createTenantCollectionService<FinComissao>(
  'fin_comissoes',
);
