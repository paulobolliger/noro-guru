import { ModuleRegistration } from './types';
import { financeiroModule } from './financeiro';
import { billingModule } from './billing';

export const registeredModules: ModuleRegistration[] = [
  {
    module: financeiroModule,
    async initialize() {
      console.log('Inicializando módulo financeiro...');
      // Aqui podemos adicionar lógica de inicialização
      // como carregar configurações, verificar permissões, etc.
    },
    async cleanup() {
      console.log('Limpando recursos do módulo financeiro...');
      // Aqui podemos adicionar lógica de limpeza
      // como fechar conexões, limpar cache, etc.
    }
  },
  {
    module: billingModule,
    async initialize() {
      console.log('Inicializando módulo de billing...');
      // Verificar configurações do Stripe
      // Validar webhooks
      // Sincronizar produtos e preços
    },
    async cleanup() {
      console.log('Limpando recursos do módulo de billing...');
      // Limpar cache de sessões
      // Fechar conexões com Stripe
    }
  }
];

export function getModuleByName(name: string) {
  return registeredModules.find(reg => reg.module.name === name);
}

export function getModuleRoutes(name: string) {
  const registration = getModuleByName(name);
  return registration?.module.routes ?? {};
}

export function getModuleEndpoints(name: string) {
  const registration = getModuleByName(name);
  return registration?.module.api.endpoints ?? {};
}

export function hasModulePermission(name: string, permission: string) {
  const registration = getModuleByName(name);
  return registration?.module.permissions?.includes(permission) ?? false;
}