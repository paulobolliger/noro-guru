'use server';

import { createDatabaseClient, proposalsRepository, proposalItems } from '@noro/db';
import { requireUser, keycloakSessionAdapter } from '@noro/auth';
import { getServerSession, getSessionClaims } from '@/lib/session';
import { eq } from 'drizzle-orm';

export async function createOrcamento(formData: FormData) {
  const { client, db, close } = createDatabaseClient();
  try {
    const userCtx = await requireUser({
      db: client as any,
      sessionAdapter: keycloakSessionAdapter(getServerSession),
    });

    const memberships = await client`
      SELECT tenant_id FROM noro.tenant_memberships WHERE user_id = ${userCtx.user.id} LIMIT 1
    `;
    if (!memberships || memberships.length === 0) {
      return { success: false, message: 'Usuário não associado a nenhuma agência.' };
    }
    const tenantId = memberships[0].tenant_id;
    const userId = userCtx.user.id;

    const itensString = formData.get('itens') as string;
    let itensParsed: any[] = [];
    try {
      itensParsed = JSON.parse(itensString);
    } catch (e) {
      console.warn('Erro ao parsear itens do orçamento. Salvando como array vazio.');
    }

    const payload = {
      titulo: formData.get('titulo') as string,
      leadId: (formData.get('lead_id') as string) || null,
      clientId: (formData.get('lead_id') as string) || null,
      dataViagemInicio: (formData.get('data_viagem_inicio') as string) || null,
      dataViagemFim: (formData.get('data_viagem_fim') as string) || null,
      numPax: parseInt(formData.get('num_pessoas') as string) || null,
      destinoPrincipal: (formData.get('destino') as string) || null,
      valorSinalCents: formData.get('valor_sinal') ? Math.round(parseFloat(formData.get('valor_sinal') as string) * 100) : null,
      status: (formData.get('status') as any) || 'rascunho',
      descricao: (formData.get('descricao') as string) || null,
      validadeAte: (formData.get('validade_ate') as string) || null,
      observacoes: (formData.get('observacoes') as string) || null,
      termosCondicoes: (formData.get('termos_condicoes') as string) || null,
      moedaBase: 'BRL',
    };

    const numero = await proposalsRepository.generateProposalNumber(db, tenantId);

    const proposal = await proposalsRepository.createProposal(db, {
      tenantId,
      createdBy: userId,
      numero,
      ...payload,
    });

    if (!proposal) {
      return { success: false, message: 'Falha ao criar orçamento no banco de dados' };
    }

    if (itensParsed && itensParsed.length > 0) {
      for (let i = 0; i < itensParsed.length; i++) {
        const item = itensParsed[i];
        await proposalsRepository.addProposalItem(db, {
          proposalId: proposal.id,
          tipo: 'manual',
          nome: item.tipo || 'Serviço',
          descricao: item.descricao || '',
          categoria: item.tipo || 'Outro',
          custoBaseCents: Math.round((item.valor_net || 0) * 100),
          precoVendaCents: Math.round((item.valor_final || 0) * 100),
          markupPercentual: item.comissao_percentual ? item.comissao_percentual.toFixed(2) : '0.00',
          ordem: i,
        });
      }
    }

    return {
      success: true,
      message: 'Orçamento criado com sucesso!',
      data: proposal,
    };
  } catch (error: any) {
    console.error('Erro ao criar orçamento:', error);
    return { success: false, message: error.message || 'Erro interno' };
  } finally {
    await close();
  }
}

export async function updateOrcamento(orcamentoId: string, formData: FormData) {
  const { client, db, close } = createDatabaseClient();
  try {
    const userCtx = await requireUser({
      db: client as any,
      sessionAdapter: keycloakSessionAdapter(getServerSession),
    });

    const memberships = await client`
      SELECT tenant_id FROM noro.tenant_memberships WHERE user_id = ${userCtx.user.id} LIMIT 1
    `;
    if (!memberships || memberships.length === 0) {
      return { success: false, message: 'Usuário não associado a nenhuma agência.' };
    }
    const tenantId = memberships[0].tenant_id;

    const itensString = formData.get('itens') as string;
    let itensParsed: any[] = [];
    try {
      itensParsed = JSON.parse(itensString);
    } catch (e) {
      console.warn('Erro ao parsear itens do orçamento durante atualização.');
    }

    const payload = {
      titulo: formData.get('titulo') as string,
      leadId: (formData.get('lead_id') as string) || null,
      clientId: (formData.get('lead_id') as string) || null,
      dataViagemInicio: (formData.get('data_viagem_inicio') as string) || null,
      dataViagemFim: (formData.get('data_viagem_fim') as string) || null,
      numPax: parseInt(formData.get('num_pessoas') as string) || null,
      destinoPrincipal: (formData.get('destino') as string) || null,
      valorSinalCents: formData.get('valor_sinal') ? Math.round(parseFloat(formData.get('valor_sinal') as string) * 100) : null,
      status: (formData.get('status') as any),
      descricao: (formData.get('descricao') as string) || null,
      validadeAte: (formData.get('validade_ate') as string) || null,
      observacoes: (formData.get('observacoes') as string) || null,
      termosCondicoes: (formData.get('termos_condicoes') as string) || null,
    };

    const proposal = await proposalsRepository.updateProposal(db, tenantId, orcamentoId, payload);

    if (!proposal) {
      return { success: false, message: 'Orçamento não encontrado ou sem permissão de alteração' };
    }

    await db.delete(proposalItems).where(eq(proposalItems.proposalId, orcamentoId));

    if (itensParsed && itensParsed.length > 0) {
      for (let i = 0; i < itensParsed.length; i++) {
        const item = itensParsed[i];
        await proposalsRepository.addProposalItem(db, {
          proposalId: orcamentoId,
          tipo: 'manual',
          nome: item.tipo || 'Serviço',
          descricao: item.descricao || '',
          categoria: item.tipo || 'Outro',
          custoBaseCents: Math.round((item.valor_net || 0) * 100),
          precoVendaCents: Math.round((item.valor_final || 0) * 100),
          markupPercentual: item.comissao_percentual ? item.comissao_percentual.toFixed(2) : '0.00',
          ordem: i,
        });
      }
    }

    return {
      success: true,
      message: 'Orçamento atualizado com sucesso!',
      data: proposal,
    };
  } catch (error: any) {
    console.error('Erro ao atualizar orçamento:', error);
    return { success: false, message: error.message || 'Erro interno' };
  } finally {
    await close();
  }
}

export async function getOrcamentos() {
  const { client, db, close } = createDatabaseClient();
  try {
    const userCtx = await requireUser({
      db: client as any,
      sessionAdapter: keycloakSessionAdapter(getServerSession),
    });

    const memberships = await client`
      SELECT tenant_id FROM noro.tenant_memberships WHERE user_id = ${userCtx.user.id} LIMIT 1
    `;
    if (!memberships || memberships.length === 0) {
      return [];
    }
    const tenantId = memberships[0].tenant_id;

    return await proposalsRepository.getProposalsByTenant(db, tenantId);
  } catch (error) {
    console.error('Error in getOrcamentos:', error);
    return [];
  } finally {
    await close();
  }
}

export async function getOrcamentoById(proposalId: string) {
  const { client, db, close } = createDatabaseClient();
  try {
    const userCtx = await requireUser({
      db: client as any,
      sessionAdapter: keycloakSessionAdapter(getServerSession),
    });

    const memberships = await client`
      SELECT tenant_id FROM noro.tenant_memberships WHERE user_id = ${userCtx.user.id} LIMIT 1
    `;
    if (!memberships || memberships.length === 0) {
      return { success: false, error: 'Usuário não associado a nenhuma agência.' };
    }
    const tenantId = memberships[0].tenant_id;

    const proposal = await proposalsRepository.getProposalById(db, tenantId, proposalId);
    if (!proposal) {
      return { success: false, error: 'Orçamento não encontrado.' };
    }
    return { success: true, data: proposal };
  } catch (error: any) {
    console.error('Error in getOrcamentoById:', error);
    return { success: false, error: error.message || 'Erro interno' };
  } finally {
    await close();
  }
}
