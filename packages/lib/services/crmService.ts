import { createTenantCollectionService, type TenantScopedDocument } from './runtimeCrud';

export interface Cliente extends TenantScopedDocument {
  nome: string;
  email?: string;
  telefone?: string;
  status?: string;
}

export interface Lead extends TenantScopedDocument {
  nome: string;
  email?: string;
  telefone?: string;
  status?: string;
  origem?: string;
}

export interface Pedido extends TenantScopedDocument {
  status: string;
  valorTotal?: number;
  data?: string;
}

export interface PedidoItem extends TenantScopedDocument {
  pedidoId: string;
  descricao: string;
  quantidade: number;
  valorUnitario: number;
}

export const clientesService = createTenantCollectionService<Cliente>(
  'noro_clientes',
);
export const leadsService = createTenantCollectionService<Lead>('noro_leads');
export const pedidosService = createTenantCollectionService<Pedido>(
  'noro_pedidos',
);
export const pedidosItensService = createTenantCollectionService<PedidoItem>(
  'noro_pedidos_itens',
);

export const getClientesByTenant = clientesService.list;
export const getClienteById = clientesService.getById;
export const getLeadsByTenant = leadsService.list;
export const getLeadById = leadsService.getById;
export const getPedidosByTenant = pedidosService.list;
export const getPedidoById = pedidosService.getById;
