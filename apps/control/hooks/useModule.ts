'use client';

import { useCallback } from 'react';
import { getModuleByName, getModuleRoutes, getModuleEndpoints, hasModulePermission } from '../lib/modules';

export function useModule(moduleName: string) {
  const routes = getModuleRoutes(moduleName);
  const endpoints = getModuleEndpoints(moduleName);

  const checkPermission = useCallback((permission: string) => {
    return hasModulePermission(moduleName, permission);
  }, [moduleName]);

  const navigateToRoute = useCallback((routeName: string) => {
    const route = routes[routeName];
    if (route) {
      window.location.href = route;
    } else {
      console.error(`Rota '${routeName}' não encontrada no módulo '${moduleName}'`);
    }
  }, [routes, moduleName]);

  const callEndpoint = useCallback(async (endpointName: string, options?: RequestInit) => {
    const endpoint = endpoints[endpointName];
    if (!endpoint) {
      throw new Error(`Endpoint '${endpointName}' não encontrado no módulo '${moduleName}'`);
    }

    const response = await fetch(endpoint, options);
    if (!response.ok) {
      throw new Error(`Erro ao chamar endpoint '${endpointName}': ${response.statusText}`);
    }

    return response.json();
  }, [endpoints, moduleName]);

  return {
    routes,
    endpoints,
    checkPermission,
    navigateToRoute,
    callEndpoint
  };
}