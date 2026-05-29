import { TenantRequiredError } from '../errors';
import type { ResolveTenantContextInput } from '../types';

export async function resolveSiteTenantContext(_input: ResolveTenantContextInput) {
  // TODO Sprint futura de sites: resolver tenant por dominio, subdominio ou slug publicado.
  // Nao confiar em tenant_id vindo de query/body publico.
  throw new TenantRequiredError();
}
