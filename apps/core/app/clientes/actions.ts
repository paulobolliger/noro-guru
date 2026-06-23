'use server';

import { createDatabaseClient } from '@noro/db';
import { requireUser, logtoSessionAdapter } from '@noro/auth';
import { logtoConfig } from '@/lib/logto';
import {
	getClientes as getClientesProtected,
	getClienteById as getClienteByIdProtected,
	createClienteAction as createClienteActionProtected,
	updateClienteAction as updateClienteActionProtected,
	deleteClienteAction as deleteClienteActionProtected,
	getClientesStats as getClientesStatsProtected,
} from '../(protected)/clientes/actions';

export async function getClientes() {
  const { client, close } = createDatabaseClient();
  try {
    const userCtx = await requireUser({
      db: client as any,
      sessionAdapter: logtoSessionAdapter(logtoConfig),
    });
    const memberships = await client`
      SELECT tenant_id FROM noro.tenant_memberships WHERE user_id = ${userCtx.user.id} LIMIT 1
    `;
    if (!memberships || memberships.length === 0) {
      return [];
    }
    return await getClientesProtected(memberships[0].tenant_id);
  } catch (err) {
    console.error('Error in getClientes:', err);
    return [];
  } finally {
    await close();
  }
}

export async function getClienteById(clienteId: string) {
  const { client, close } = createDatabaseClient();
  try {
    const userCtx = await requireUser({
      db: client as any,
      sessionAdapter: logtoSessionAdapter(logtoConfig),
    });
    const memberships = await client`
      SELECT tenant_id FROM noro.tenant_memberships WHERE user_id = ${userCtx.user.id} LIMIT 1
    `;
    if (!memberships || memberships.length === 0) {
      return null;
    }
    return await getClienteByIdProtected(memberships[0].tenant_id, clienteId);
  } catch (err) {
    console.error('Error in getClienteById:', err);
    return null;
  } finally {
    await close();
  }
}

export async function createClienteAction(formData: FormData) {
  const { client, close } = createDatabaseClient();
  try {
    const userCtx = await requireUser({
      db: client as any,
      sessionAdapter: logtoSessionAdapter(logtoConfig),
    });

    const memberships = await client`
      SELECT tenant_id FROM noro.tenant_memberships WHERE user_id = ${userCtx.user.id} LIMIT 1
    `;
    if (!memberships || memberships.length === 0) {
      return { success: false, message: 'Usuário não associado a nenhuma agência.' };
    }
    const tenantId = memberships[0].tenant_id;

    const data = {
      tipo: formData.get('tipo') as any,
      nome: formData.get('nome') as string,
      email: (formData.get('email') as string) || undefined,
      phone: (formData.get('telefone') as string) || undefined,
      whatsapp: (formData.get('whatsapp') as string) || undefined,
      observacoes: (formData.get('observacoes') as string) || undefined,
      status: (formData.get('status') as any) || undefined,
      nivel: (formData.get('nivel') as any) || undefined,
      segmento: (formData.get('segmento') as any) || undefined,
      cpf: (formData.get('cpf') as string) || undefined,
      cnpj: (formData.get('cnpj') as string) || undefined,
      nacionalidade: (formData.get('nacionalidade') as string) || undefined,
      profissao: (formData.get('profissao') as string) || undefined,
      dataNascimento: (formData.get('data_nascimento') as string) || undefined,
      razaoSocial: (formData.get('razao_social') as string) || undefined,
      nomeFantasia: (formData.get('nome_fantasia') as string) || undefined,
      responsavelNome: (formData.get('responsavel_nome') as string) || undefined,
      responsavelCargo: (formData.get('responsavel_cargo') as string) || undefined,
    };

    const res = await createClienteActionProtected(tenantId, data);
    if (res.success) {
      return { success: true, data: res.cliente };
    }
    return { success: false, message: res.message || 'Erro ao criar cliente' };
  } catch (err: any) {
    console.error('Error in createClienteAction:', err);
    return { success: false, message: err.message || 'Erro interno' };
  } finally {
    await close();
  }
}

export async function updateClienteAction(clienteId: string, formData: FormData) {
  const { client, close } = createDatabaseClient();
  try {
    const userCtx = await requireUser({
      db: client as any,
      sessionAdapter: logtoSessionAdapter(logtoConfig),
    });

    const memberships = await client`
      SELECT tenant_id FROM noro.tenant_memberships WHERE user_id = ${userCtx.user.id} LIMIT 1
    `;
    if (!memberships || memberships.length === 0) {
      return { success: false, message: 'Usuário não associado a nenhuma agência.' };
    }
    const tenantId = memberships[0].tenant_id;

    const data = {
      tipo: formData.get('tipo') as any,
      nome: formData.get('nome') as string,
      email: (formData.get('email') as string) || undefined,
      phone: (formData.get('telefone') as string) || undefined,
      whatsapp: (formData.get('whatsapp') as string) || undefined,
      observacoes: (formData.get('observacoes') as string) || undefined,
      status: (formData.get('status') as any) || undefined,
      nivel: (formData.get('nivel') as any) || undefined,
      segmento: (formData.get('segmento') as any) || undefined,
      cpf: (formData.get('cpf') as string) || undefined,
      cnpj: (formData.get('cnpj') as string) || undefined,
      nacionalidade: (formData.get('nacionalidade') as string) || undefined,
      profissao: (formData.get('profissao') as string) || undefined,
      dataNascimento: (formData.get('data_nascimento') as string) || undefined,
      razaoSocial: (formData.get('razao_social') as string) || undefined,
      nomeFantasia: (formData.get('nome_fantasia') as string) || undefined,
      responsavelNome: (formData.get('responsavel_nome') as string) || undefined,
      responsavelCargo: (formData.get('responsavel_cargo') as string) || undefined,
    };

    const res = await updateClienteActionProtected(tenantId, clienteId, data);
    if (res.success) {
      return { success: true, data: res.cliente };
    }
    return { success: false, message: res.message || 'Erro ao atualizar cliente' };
  } catch (err: any) {
    console.error('Error in updateClienteAction:', err);
    return { success: false, message: err.message || 'Erro interno' };
  } finally {
    await close();
  }
}

export async function deleteClienteAction(clienteId: string) {
  const { client, close } = createDatabaseClient();
  try {
    const userCtx = await requireUser({
      db: client as any,
      sessionAdapter: logtoSessionAdapter(logtoConfig),
    });

    const memberships = await client`
      SELECT tenant_id FROM noro.tenant_memberships WHERE user_id = ${userCtx.user.id} LIMIT 1
    `;
    if (!memberships || memberships.length === 0) {
      return { success: false, message: 'Usuário não associado a nenhuma agência.' };
    }
    const tenantId = memberships[0].tenant_id;

    const res = await deleteClienteActionProtected(tenantId, clienteId);
    if (res.success) {
      return { success: true, data: res.cliente };
    }
    return { success: false, message: res.message || 'Erro ao deletar cliente' };
  } catch (err: any) {
    console.error('Error in deleteClienteAction:', err);
    return { success: false, message: err.message || 'Erro interno' };
  } finally {
    await close();
  }
}

export async function getClientesStats() {
  const { client, close } = createDatabaseClient();
  try {
    const userCtx = await requireUser({
      db: client as any,
      sessionAdapter: logtoSessionAdapter(logtoConfig),
    });
    const memberships = await client`
      SELECT tenant_id FROM noro.tenant_memberships WHERE user_id = ${userCtx.user.id} LIMIT 1
    `;
    if (!memberships || memberships.length === 0) {
      return { total: 0, ativos: 0, vip: 0, blacklist: 0 };
    }
    return await getClientesStatsProtected(memberships[0].tenant_id);
  } catch (err) {
    console.error('Error in getClientesStats:', err);
    return { total: 0, ativos: 0, vip: 0, blacklist: 0 };
  } finally {
    await close();
  }
}
