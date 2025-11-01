// apps/control/hooks/index.ts
// Exports centralizados dos hooks do Control Plane

// Tenant Management
export * from './useTenant';

// Business Entities (RLS-protected)
export * from './useClients';
export * from './useLeads';
export * from './usePedidos';
export * from './useOrcamentos';

// Support System
export * from './useTickets';
export * from './useTicket';
export * from './useTicketMessages';
export * from './useSupportMeta';
