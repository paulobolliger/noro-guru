import { ModuleRegistration } from './types';
import { financeiroModule } from './financeiro';
import { billingModule } from './billing';

export const registeredModules: ModuleRegistration[] = [
  {
    module: financeiroModule,
    async initialize() {
      // TODO: carregar configurações, verificar permissões
    },
    async cleanup() {
      // TODO: fechar conexões, limpar cache
    }
  },
  {
    module: billingModule,
    async initialize() {
      // TODO: verificar configurações do Stripe, validar webhooks, sincronizar produtos
    },
    async cleanup() {
      // TODO: limpar cache de sessões, fechar conexões com Stripe
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
