'use server';

import { createDatabaseClient } from '@noro/db';
import { revalidatePath } from 'next/cache';
import { randomUUID } from 'crypto';
import { requireUser, keycloakSessionAdapter } from '@noro/auth';
import { getServerSession, getSessionClaims } from '@/lib/session';

// ============================================================================
// HELPER: RESOLVE TENANT ID FROM SESSION
// ============================================================================

async function resolveTenant(client: any): Promise<string> {
  const userCtx = await requireUser({
    db: client as any,
    sessionAdapter: keycloakSessionAdapter(getServerSession),
  });

  const memberships = await client`
    SELECT tenant_id 
    FROM noro.tenant_memberships 
    WHERE user_id = ${userCtx.user.id} 
    LIMIT 1
  `;

  if (!memberships || memberships.length === 0) {
    throw new Error('Usuário não associado a nenhuma agência/tenant.');
  }

  return memberships[0].tenant_id;
}

// ============================================================================
// CLIENTE - DADOS PRINCIPAIS
// ============================================================================

export async function getClienteDetalhes(clienteId: string) {
  const { client, close } = createDatabaseClient();
  try {
    const tenantId = await resolveTenant(client);

    const [data] = (await client`
      SELECT 
        c.*,
        CASE WHEN u.id IS NOT NULL THEN
          json_build_object(
            'id', u.id,
            'nome', u.nome,
            'email', u.email,
            'avatar_url', u.avatar_url
          )
        ELSE NULL END as agente,
        CASE WHEN l.id IS NOT NULL THEN
          json_build_object(
            'id', l.id,
            'nome', l.nome,
            'email', l.email,
            'origem', l.origem
          )
        ELSE NULL END as origem_lead
      FROM crm.clients c
      LEFT JOIN platform.users u ON u.id = c.agente_responsavel_id
      LEFT JOIN crm.leads l ON l.id = c.origem_lead_id
      WHERE c.id = ${clienteId} AND c.tenant_id = ${tenantId} AND c.deleted_at IS NULL
      LIMIT 1
    `) as any[];

    if (!data) {
      return { success: false, error: 'Cliente não encontrado.' };
    }

    return { success: true, data: data as any };
  } catch (error: any) {
    console.error('Erro ao buscar cliente:', error);
    return { success: false, error: error.message };
  } finally {
    await close();
  }
}

export async function updateCliente(clienteId: string, formData: FormData) {
  const { client, close } = createDatabaseClient();
  try {
    const tenantId = await resolveTenant(client);

    const updates = {
      nome: (formData.get('nome') as string) || null,
      email: (formData.get('email') as string) || null,
      telefone: (formData.get('telefone') as string) || null,
      whatsapp: (formData.get('whatsapp') as string) || null,
      cpf: (formData.get('cpf') as string) || null,
      passaporte: (formData.get('passaporte') as string) || null,
      data_nascimento: formData.get('data_nascimento') ? (formData.get('data_nascimento') as string) : null,
      nacionalidade: (formData.get('nacionalidade') as string) || null,
      profissao: (formData.get('profissao') as string) || null,
      cnpj: (formData.get('cnpj') as string) || null,
      razao_social: (formData.get('razao_social') as string) || null,
      nome_fantasia: (formData.get('nome_fantasia') as string) || null,
      inscricao_estadual: (formData.get('inscricao_estadual') as string) || null,
      responsavel_nome: (formData.get('responsavel_nome') as string) || null,
      responsavel_cargo: (formData.get('responsavel_cargo') as string) || null,
      status: (formData.get('status') as string) || null,
      tipo: (formData.get('tipo') as string) || null,
      segmento: (formData.get('segmento') as string) || null,
      nivel: (formData.get('nivel') as string) || null,
      observacoes: (formData.get('observacoes') as string) || null,
      updated_at: new Date().toISOString(),
    };

    const [updated] = await client`
      UPDATE crm.clients
      SET 
        nome = ${updates.nome},
        email = ${updates.email},
        telefone = ${updates.telefone},
        whatsapp = ${updates.whatsapp},
        cpf = ${updates.cpf},
        passaporte = ${updates.passaporte},
        data_nascimento = ${updates.data_nascimento},
        nacionalidade = ${updates.nacionalidade},
        profissao = ${updates.profissao},
        cnpj = ${updates.cnpj},
        razao_social = ${updates.razao_social},
        nome_fantasia = ${updates.nome_fantasia},
        inscricao_estadual = ${updates.inscricao_estadual},
        responsavel_nome = ${updates.responsavel_nome},
        responsavel_cargo = ${updates.responsavel_cargo},
        status = ${updates.status},
        tipo = ${updates.tipo},
        segmento = ${updates.segmento},
        nivel = ${updates.nivel},
        observacoes = ${updates.observacoes},
        updated_at = ${updates.updated_at}
      WHERE id = ${clienteId} AND tenant_id = ${tenantId} AND deleted_at IS NULL
      RETURNING *
    `;

    if (!updated) {
      return { success: false, error: 'Cliente não encontrado ou acesso não autorizado.' };
    }

    revalidatePath(`/clientes/${clienteId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao atualizar cliente:', error);
    return { success: false, error: error.message };
  } finally {
    await close();
  }
}

// ============================================================================
// DOCUMENTOS
// ============================================================================

export async function getClienteDocumentos(clienteId: string) {
  const { client, close } = createDatabaseClient();
  try {
    const tenantId = await resolveTenant(client);

    const data = await client`
      SELECT *
      FROM crm.client_documents
      WHERE cliente_id = ${clienteId} AND tenant_id = ${tenantId}
      ORDER BY created_at DESC
    `;

    return { success: true, data: data as any };
  } catch (error: any) {
    console.error('Erro ao buscar documentos:', error);
    return { success: false, error: error.message };
  } finally {
    await close();
  }
}

export async function createDocumento(clienteId: string, formData: FormData) {
  const { client, close } = createDatabaseClient();
  try {
    const tenantId = await resolveTenant(client);

    const documento = {
      tenant_id: tenantId,
      cliente_id: clienteId,
      tipo: (formData.get('tipo') as string) || null,
      numero: (formData.get('numero') as string) || null,
      pais_emissor: (formData.get('pais_emissor') as string) || null,
      orgao_emissor: (formData.get('orgao_emissor') as string) || null,
      data_emissao: formData.get('data_emissao') ? (formData.get('data_emissao') as string) : null,
      data_validade: formData.get('data_validade') ? (formData.get('data_validade') as string) : null,
      status: (formData.get('status') as string) || 'valido',
      arquivo_url: (formData.get('arquivo_url') as string) || null,
      arquivo_public_id: (formData.get('arquivo_public_id') as string) || null,
      arquivo_nome: (formData.get('arquivo_nome') as string) || null,
      arquivo_tamanho: formData.get('arquivo_tamanho') ? parseInt(formData.get('arquivo_tamanho') as string) : null,
      observacoes: (formData.get('observacoes') as string) || null,
    };

    await client`
      INSERT INTO crm.client_documents (
        tenant_id, cliente_id, tipo, numero, pais_emissor, orgao_emissor, data_emissao, data_validade, status,
        arquivo_url, arquivo_public_id, arquivo_nome, arquivo_tamanho, observacoes
      ) VALUES (
        ${documento.tenant_id}, ${documento.cliente_id}, ${documento.tipo}, ${documento.numero}, ${documento.pais_emissor},
        ${documento.orgao_emissor}, ${documento.data_emissao}, ${documento.data_validade}, ${documento.status},
        ${documento.arquivo_url}, ${documento.arquivo_public_id}, ${documento.arquivo_nome},
        ${documento.arquivo_tamanho}, ${documento.observacoes}
      )
    `;

    revalidatePath(`/clientes/${clienteId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao criar documento:', error);
    return { success: false, error: error.message };
  } finally {
    await close();
  }
}

export async function updateDocumento(documentoId: string, formData: FormData) {
  const { client, close } = createDatabaseClient();
  try {
    const tenantId = await resolveTenant(client);

    const updates = {
      tipo: (formData.get('tipo') as string) || null,
      numero: (formData.get('numero') as string) || null,
      pais_emissor: (formData.get('pais_emissor') as string) || null,
      orgao_emissor: (formData.get('orgao_emissor') as string) || null,
      data_emissao: formData.get('data_emissao') ? (formData.get('data_emissao') as string) : null,
      data_validade: formData.get('data_validade') ? (formData.get('data_validade') as string) : null,
      status: (formData.get('status') as string) || 'valido',
      observacoes: (formData.get('observacoes') as string) || null,
      updated_at: new Date().toISOString(),
    };

    const [updated] = await client`
      UPDATE crm.client_documents
      SET
        tipo = ${updates.tipo},
        numero = ${updates.numero},
        pais_emissor = ${updates.pais_emissor},
        orgao_emissor = ${updates.orgao_emissor},
        data_emissao = ${updates.data_emissao},
        data_validade = ${updates.data_validade},
        status = ${updates.status},
        observacoes = ${updates.observacoes},
        updated_at = ${updates.updated_at}
      WHERE id = ${documentoId} AND tenant_id = ${tenantId}
      RETURNING cliente_id
    `;

    if (updated) {
      revalidatePath(`/clientes/${updated.cliente_id}`);
    }

    return { success: true };
  } catch (error: any) {
    console.error('Erro ao atualizar documento:', error);
    return { success: false, error: error.message };
  } finally {
    await close();
  }
}

export async function deleteDocumento(documentoId: string, clienteId: string) {
  const { client, close } = createDatabaseClient();
  try {
    const tenantId = await resolveTenant(client);

    await client`
      DELETE FROM crm.client_documents
      WHERE id = ${documentoId} AND cliente_id = ${clienteId} AND tenant_id = ${tenantId}
    `;

    revalidatePath(`/clientes/${clienteId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao deletar documento:', error);
    return { success: false, error: error.message };
  } finally {
    await close();
  }
}

// ============================================================================
// PREFERÊNCIAS
// ============================================================================

export async function getClientePreferencias(clienteId: string) {
  const { client, close } = createDatabaseClient();
  try {
    const tenantId = await resolveTenant(client);

    const [data] = await client`
      SELECT *
      FROM crm.client_preferences
      WHERE cliente_id = ${clienteId} AND tenant_id = ${tenantId}
      LIMIT 1
    `;
    return { success: true, data: data || null };
  } catch (error: any) {
    console.error('Erro ao buscar preferências:', error);
    return { success: false, error: error.message };
  } finally {
    await close();
  }
}

export async function upsertPreferencias(clienteId: string, formData: FormData) {
  const { client, close } = createDatabaseClient();
  try {
    const tenantId = await resolveTenant(client);

    const estilo_viagem = formData.get('estilo_viagem') ? (formData.get('estilo_viagem') as string).split(',').filter(Boolean) : [];
    const destinos_favoritos = formData.get('destinos_favoritos') ? (formData.get('destinos_favoritos') as string).split(',').filter(Boolean) : [];
    const destinos_desejados = formData.get('destinos_desejados') ? (formData.get('destinos_desejados') as string).split(',').filter(Boolean) : [];
    const tipo_hospedagem = formData.get('tipo_hospedagem') ? (formData.get('tipo_hospedagem') as string).split(',').filter(Boolean) : [];
    const restricoes_alimentares = formData.get('restricoes_alimentares') ? (formData.get('restricoes_alimentares') as string).split(',').filter(Boolean) : [];

    const preferencias = {
      tenant_id: tenantId,
      cliente_id: clienteId,
      frequencia_viagem: (formData.get('frequencia_viagem') as string) || null,
      orcamento_medio: (formData.get('orcamento_medio') as string) || null,
      estilo_viagem,
      destinos_favoritos,
      destinos_desejados,
      assento_preferido: (formData.get('assento_preferido') as string) || null,
      classe_preferida: (formData.get('classe_preferida') as string) || null,
      tipo_hospedagem,
      preferencias_quarto: (formData.get('preferencias_quarto') as string) || null,
      categoria_hotel: (formData.get('categoria_hotel') as string) || null,
      restricoes_alimentares,
      refeicao_preferida: (formData.get('refeicao_preferida') as string) || null,
      necessidades_especiais: (formData.get('necessidades_especiais') as string) || null,
      mobilidade_reduzida: formData.get('mobilidade_reduzida') === 'true',
      viaja_com_criancas: formData.get('viaja_com_criancas') === 'true',
      viaja_com_pets: formData.get('viaja_com_pets') === 'true',
      seguro_preferido: (formData.get('seguro_preferido') as string) || null,
      aluguel_carro: formData.get('aluguel_carro') === 'true',
      tours_guiados: formData.get('tours_guiados') === 'true',
      transfers: formData.get('transfers') === 'true',
      observacoes: (formData.get('observacoes') as string) || null,
      updated_at: new Date().toISOString(),
    };

    await client`
      INSERT INTO crm.client_preferences (
        tenant_id, cliente_id, frequencia_viagem, orcamento_medio, estilo_viagem, destinos_favoritos, destinos_desejados,
        assento_preferido, classe_preferida, tipo_hospedagem, preferencias_quarto, categoria_hotel,
        restricoes_alimentares, refeicao_preferida, necessidades_especiais, mobilidade_reduzida,
        viaja_com_criancas, viaja_com_pets, seguro_preferido, aluguel_carro, tours_guiados, transfers,
        observacoes, updated_at
      ) VALUES (
        ${preferencias.tenant_id}, ${preferencias.cliente_id}, ${preferencias.frequencia_viagem}, ${preferencias.orcamento_medio},
        ${preferencias.estilo_viagem}, ${preferencias.destinos_favoritos}, ${preferencias.destinos_desejados},
        ${preferencias.assento_preferido}, ${preferencias.classe_preferida}, ${preferencias.tipo_hospedagem},
        ${preferencias.preferencias_quarto}, ${preferencias.categoria_hotel}, ${preferencias.restricoes_alimentares},
        ${preferencias.refeicao_preferida}, ${preferencias.necessidades_especiais}, ${preferencias.mobilidade_reduzida},
        ${preferencias.viaja_com_criancas}, ${preferencias.viaja_com_pets}, ${preferencias.seguro_preferido},
        ${preferencias.aluguel_carro}, ${preferencias.tours_guiados}, ${preferencias.transfers},
        ${preferencias.observacoes}, ${preferencias.updated_at}
      )
      ON CONFLICT (cliente_id) DO UPDATE SET
        frequencia_viagem = EXCLUDED.frequencia_viagem,
        orcamento_medio = EXCLUDED.orcamento_medio,
        estilo_viagem = EXCLUDED.estilo_viagem,
        destinos_favoritos = EXCLUDED.destinos_favoritos,
        destinos_desejados = EXCLUDED.destinos_desejados,
        assento_preferido = EXCLUDED.assento_preferido,
        classe_preferida = EXCLUDED.classe_preferida,
        tipo_hospedagem = EXCLUDED.tipo_hospedagem,
        preferencias_quarto = EXCLUDED.preferencias_quarto,
        categoria_hotel = EXCLUDED.categoria_hotel,
        restricoes_alimentares = EXCLUDED.restricoes_alimentares,
        refeicao_preferida = EXCLUDED.refeicao_preferida,
        necessidades_especiais = EXCLUDED.necessidades_especiais,
        mobilidade_reduzida = EXCLUDED.mobilidade_reduzida,
        viaja_com_criancas = EXCLUDED.viaja_com_criancas,
        viaja_com_pets = EXCLUDED.viaja_com_pets,
        seguro_preferido = EXCLUDED.seguro_preferido,
        aluguel_carro = EXCLUDED.aluguel_carro,
        tours_guiados = EXCLUDED.tours_guiados,
        transfers = EXCLUDED.transfers,
        observacoes = EXCLUDED.observacoes,
        updated_at = EXCLUDED.updated_at
      WHERE crm.client_preferences.tenant_id = ${tenantId}
    `;

    revalidatePath(`/clientes/${clienteId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao salvar preferências:', error);
    return { success: false, error: error.message };
  } finally {
    await close();
  }
}

// ============================================================================
// ENDEREÇOS
// ============================================================================

export async function getClienteEnderecos(clienteId: string) {
  const { client, close } = createDatabaseClient();
  try {
    const tenantId = await resolveTenant(client);

    const data = await client`
      SELECT *
      FROM crm.client_addresses
      WHERE cliente_id = ${clienteId} AND tenant_id = ${tenantId}
      ORDER BY principal DESC, created_at DESC
    `;

    return { success: true, data: data as any };
  } catch (error: any) {
    console.error('Erro ao buscar endereços:', error);
    return { success: false, error: error.message };
  } finally {
    await close();
  }
}

export async function createEndereco(clienteId: string, formData: FormData) {
  const { client, close } = createDatabaseClient();
  try {
    const tenantId = await resolveTenant(client);

    const endereco = {
      tenant_id: tenantId,
      cliente_id: clienteId,
      tipo: (formData.get('tipo') as string) || 'residencial',
      principal: formData.get('principal') === 'true',
      logradouro: (formData.get('logradouro') as string) || 'Não Informado',
      numero: (formData.get('numero') as string) || null,
      complemento: (formData.get('complemento') as string) || null,
      bairro: (formData.get('bairro') as string) || null,
      cidade: (formData.get('cidade') as string) || 'Não Informado',
      estado: (formData.get('estado') as string) || null,
      cep: (formData.get('cep') as string) || null,
      pais: (formData.get('pais') as string) || 'Brasil',
    };

    await client.begin(async (sql) => {
      if (endereco.principal) {
        await sql`
          UPDATE crm.client_addresses
          SET principal = false
          WHERE cliente_id = ${clienteId} AND tenant_id = ${tenantId}
        `;
      }

      await sql`
        INSERT INTO crm.client_addresses (
          tenant_id, cliente_id, tipo, principal, logradouro, numero, complemento, bairro, cidade, estado, cep, pais
        ) VALUES (
          ${endereco.tenant_id}, ${endereco.cliente_id}, ${endereco.tipo}, ${endereco.principal}, ${endereco.logradouro},
          ${endereco.numero}, ${endereco.complemento}, ${endereco.bairro}, ${endereco.cidade},
          ${endereco.estado}, ${endereco.cep}, ${endereco.pais}
        )
      `;
    });

    revalidatePath(`/clientes/${clienteId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao criar endereço:', error);
    return { success: false, error: error.message };
  } finally {
    await close();
  }
}

export async function updateEndereco(enderecoId: string, formData: FormData, clienteId: string) {
  const { client, close } = createDatabaseClient();
  try {
    const tenantId = await resolveTenant(client);

    const updates = {
      tipo: (formData.get('tipo') as string) || 'residencial',
      principal: formData.get('principal') === 'true',
      logradouro: (formData.get('logradouro') as string) || 'Não Informado',
      numero: (formData.get('numero') as string) || null,
      complemento: (formData.get('complemento') as string) || null,
      bairro: (formData.get('bairro') as string) || null,
      cidade: (formData.get('cidade') as string) || 'Não Informado',
      estado: (formData.get('estado') as string) || null,
      cep: (formData.get('cep') as string) || null,
      pais: (formData.get('pais') as string) || 'Brasil',
      updated_at: new Date().toISOString(),
    };

    await client.begin(async (sql) => {
      if (updates.principal) {
        await sql`
          UPDATE crm.client_addresses
          SET principal = false
          WHERE cliente_id = ${clienteId} AND id <> ${enderecoId} AND tenant_id = ${tenantId}
        `;
      }

      await sql`
        UPDATE crm.client_addresses
        SET
          tipo = ${updates.tipo},
          principal = ${updates.principal},
          logradouro = ${updates.logradouro},
          numero = ${updates.numero},
          complemento = ${updates.complemento},
          bairro = ${updates.bairro},
          cidade = ${updates.cidade},
          estado = ${updates.estado},
          cep = ${updates.cep},
          pais = ${updates.pais},
          updated_at = ${updates.updated_at}
        WHERE id = ${enderecoId} AND tenant_id = ${tenantId}
      `;
    });

    revalidatePath(`/clientes/${clienteId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao atualizar endereço:', error);
    return { success: false, error: error.message };
  } finally {
    await close();
  }
}

export async function deleteEndereco(enderecoId: string, clienteId: string) {
  const { client, close } = createDatabaseClient();
  try {
    const tenantId = await resolveTenant(client);

    await client`
      DELETE FROM crm.client_addresses
      WHERE id = ${enderecoId} AND cliente_id = ${clienteId} AND tenant_id = ${tenantId}
    `;

    revalidatePath(`/clientes/${clienteId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao deletar endereço:', error);
    return { success: false, error: error.message };
  } finally {
    await close();
  }
}

// ============================================================================
// CONTATOS DE EMERGÊNCIA
// ============================================================================

export async function getClienteContatosEmergencia(clienteId: string) {
  const { client, close } = createDatabaseClient();
  try {
    const tenantId = await resolveTenant(client);

    const data = await client`
      SELECT *
      FROM sales.emergency_contacts
      WHERE cliente_id = ${clienteId} AND tenant_id = ${tenantId}
      ORDER BY created_at DESC
    `;

    return { success: true, data: data as any };
  } catch (error: any) {
    console.error('Erro ao buscar contatos de emergência:', error);
    return { success: false, error: error.message };
  } finally {
    await close();
  }
}

export async function createContatoEmergencia(clienteId: string, formData: FormData) {
  const { client, close } = createDatabaseClient();
  try {
    const tenantId = await resolveTenant(client);

    const contato = {
      tenant_id: tenantId,
      cliente_id: clienteId,
      nome: (formData.get('nome') as string) || null,
      parentesco: (formData.get('parentesco') as string) || null,
      telefone: (formData.get('telefone') as string) || null,
      email: (formData.get('email') as string) || null,
      observacoes: (formData.get('observacoes') as string) || null,
    };

    await client`
      INSERT INTO sales.emergency_contacts (
        tenant_id, cliente_id, nome, parentesco, telefone, email, observacoes
      ) VALUES (
        ${contato.tenant_id}, ${contato.cliente_id}, ${contato.nome}, ${contato.parentesco}, ${contato.telefone}, ${contato.email}, ${contato.observacoes}
      )
    `;

    revalidatePath(`/clientes/${clienteId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao criar contato de emergência:', error);
    return { success: false, error: error.message };
  } finally {
    await close();
  }
}

export async function deleteContatoEmergencia(contatoId: string, clienteId: string) {
  const { client, close } = createDatabaseClient();
  try {
    const tenantId = await resolveTenant(client);

    await client`
      DELETE FROM sales.emergency_contacts
      WHERE id = ${contatoId} AND cliente_id = ${clienteId} AND tenant_id = ${tenantId}
    `;

    revalidatePath(`/clientes/${clienteId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao deletar contato de emergência:', error);
    return { success: false, error: error.message };
  } finally {
    await close();
  }
}

// ============================================================================
// PROGRAMAS DE MILHAS
// ============================================================================

export async function getClienteMilhas(clienteId: string) {
  const { client, close } = createDatabaseClient();
  try {
    const tenantId = await resolveTenant(client);

    const data = await client`
      SELECT *
      FROM crm.client_miles
      WHERE cliente_id = ${clienteId} AND tenant_id = ${tenantId}
      ORDER BY companhia ASC
    `;

    return { success: true, data: data as any };
  } catch (error: any) {
    console.error('Erro ao buscar milhas:', error);
    return { success: false, error: error.message };
  } finally {
    await close();
  }
}

export async function createMilhas(clienteId: string, formData: FormData) {
  const { client, close } = createDatabaseClient();
  try {
    const tenantId = await resolveTenant(client);

    const milhas = {
      tenant_id: tenantId,
      cliente_id: clienteId,
      companhia: (formData.get('programa') as string) || 'Outro',
      numero_programa: (formData.get('numero_cartao') as string) || null,
      categoria: (formData.get('categoria') as string) || null,
      saldo_estimado: formData.get('saldo') ? parseInt(formData.get('saldo') as string) : null,
      data_validade: formData.get('data_validade') ? (formData.get('data_validade') as string) : null,
      observacoes: (formData.get('observacoes') as string) || null,
    };

    await client`
      INSERT INTO crm.client_miles (
        tenant_id, cliente_id, companhia, numero_programa, categoria, saldo_estimado, data_validade, observacoes
      ) VALUES (
        ${milhas.tenant_id}, ${milhas.cliente_id}, ${milhas.companhia}, ${milhas.numero_programa}, ${milhas.categoria},
        ${milhas.saldo_estimado}, ${milhas.data_validade}, ${milhas.observacoes}
      )
    `;

    revalidatePath(`/clientes/${clienteId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao criar milhas:', error);
    return { success: false, error: error.message };
  } finally {
    await close();
  }
}

export async function updateMilhas(milhasId: string, formData: FormData, clienteId: string) {
  const { client, close } = createDatabaseClient();
  try {
    const tenantId = await resolveTenant(client);

    const updates = {
      companhia: (formData.get('programa') as string) || 'Outro',
      numero_programa: (formData.get('numero_cartao') as string) || null,
      categoria: (formData.get('categoria') as string) || null,
      saldo_estimado: formData.get('saldo') ? parseInt(formData.get('saldo') as string) : null,
      data_validade: formData.get('data_validade') ? (formData.get('data_validade') as string) : null,
      observacoes: (formData.get('observacoes') as string) || null,
      updated_at: new Date().toISOString(),
    };

    await client`
      UPDATE crm.client_miles
      SET
        companhia = ${updates.companhia},
        numero_programa = ${updates.numero_programa},
        categoria = ${updates.categoria},
        saldo_estimado = ${updates.saldo_estimado},
        data_validade = ${updates.data_validade},
        observacoes = ${updates.observacoes},
        updated_at = ${updates.updated_at}
      WHERE id = ${milhasId} AND tenant_id = ${tenantId}
    `;

    revalidatePath(`/clientes/${clienteId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao atualizar milhas:', error);
    return { success: false, error: error.message };
  } finally {
    await close();
  }
}

export async function deleteMilhas(milhasId: string, clienteId: string) {
  const { client, close } = createDatabaseClient();
  try {
    const tenantId = await resolveTenant(client);

    await client`
      DELETE FROM crm.client_miles
      WHERE id = ${milhasId} AND cliente_id = ${clienteId} AND tenant_id = ${tenantId}
    `;

    revalidatePath(`/clientes/${clienteId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Erro ao deletar milhas:', error);
    return { success: false, error: error.message };
  } finally {
    await close();
  }
}

// ============================================================================
// TOKEN DE ATUALIZAÇÃO (FORMULÁRIO PÚBLICO)
// ============================================================================

export async function createClientUpdateToken(clienteId: string) {
  if (!clienteId) {
    return { success: false, message: 'ID do cliente é obrigatório.' };
  }
  
  const { client, close } = createDatabaseClient();
  try {
    const tenantId = await resolveTenant(client);

    // Validar se o cliente realmente pertence ao tenant do usuário logado
    const [cliente] = await client`
      SELECT id FROM crm.clients WHERE id = ${clienteId} AND tenant_id = ${tenantId} AND deleted_at IS NULL
    `;
    if (!cliente) {
      return { success: false, message: 'Acesso não autorizado ou cliente inexistente.' };
    }

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 horas de validade

    await client`
      INSERT INTO noro_auth.update_tokens (token, cliente_id, expires_at)
      VALUES (${token}, ${clienteId}, ${expiresAt.toISOString()})
    `;

    const updateUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/forms/cliente/${token}`;
    return { success: true, message: 'Link gerado com sucesso!', data: { url: updateUrl } };
  } catch (error: any) {
    console.error('Erro ao criar token de atualização:', error);
    return { success: false, message: 'Falha ao gerar o link seguro.' };
  } finally {
    await close();
  }
}

export async function getClientByUpdateToken(token: string) {
  const { client, close } = createDatabaseClient();
  try {
    const [tokenData] = (await client`
      SELECT ut.*, row_to_json(c.*) as cliente
      FROM noro_auth.update_tokens ut
      JOIN crm.clients c ON c.id = ut.cliente_id
      WHERE ut.token = ${token} AND c.deleted_at IS NULL
      LIMIT 1
    `) as any[];

    if (!tokenData) {
      return { success: false, error: 'Token inválido ou não encontrado.' };
    }

    if (tokenData.used_at) {
      return { success: false, error: 'Este link já foi utilizado.' };
    }

    if (new Date(tokenData.expires_at) < new Date()) {
      return { success: false, error: 'Este link expirou.' };
    }

    return { success: true, data: tokenData.cliente as any };
  } catch (error: any) {
    console.error('Erro ao buscar cliente por token:', error);
    return { success: false, error: error.message || 'Erro ao validar token.' };
  } finally {
    await close();
  }
}

export async function updateClientFromPublicForm(token: string, formData: FormData) {
  const { client, close } = createDatabaseClient();
  try {
    // 1. Revalidar o token antes de qualquer ação
    const [tokenData] = await client`
      SELECT cliente_id, expires_at, used_at
      FROM noro_auth.update_tokens
      WHERE token = ${token}
      LIMIT 1
    `;

    if (!tokenData) {
      return { success: false, message: 'Token de atualização inválido.' };
    }
    if (tokenData.used_at) {
      return { success: false, message: 'Este link de atualização já foi utilizado.' };
    }
    if (new Date(tokenData.expires_at) < new Date()) {
      return { success: false, message: 'Este link de atualização expirou.' };
    }
    
    const { cliente_id } = tokenData;

    // 2. Montar o payload de atualização para crm.clients
    const updates = {
      nome: (formData.get('nome') as string) || null,
      email: (formData.get('email') as string) || null,
      telefone: (formData.get('telefone') as string) || null,
      whatsapp: (formData.get('whatsapp') as string) || null,
      cpf: (formData.get('cpf') as string) || null,
      passaporte: (formData.get('passaporte') as string) || null,
      data_nascimento: formData.get('data_nascimento') ? (formData.get('data_nascimento') as string) : null,
      nacionalidade: (formData.get('nacionalidade') as string) || null,
      profissao: (formData.get('profissao') as string) || null,
      updated_at: new Date().toISOString(),
    };

    // 3. Atualizar dados e invalidar token
    await client.begin(async (sql) => {
      await sql`
        UPDATE crm.clients
        SET
          nome = ${updates.nome},
          email = ${updates.email},
          telefone = ${updates.telefone},
          whatsapp = ${updates.whatsapp},
          cpf = ${updates.cpf},
          passaporte = ${updates.passaporte},
          data_nascimento = ${updates.data_nascimento},
          nacionalidade = ${updates.nacionalidade},
          profissao = ${updates.profissao},
          updated_at = ${updates.updated_at}
        WHERE id = ${cliente_id}
      `;

      await sql`
        UPDATE noro_auth.update_tokens
        SET used_at = ${new Date().toISOString()}
        WHERE token = ${token}
      `;
    });

    revalidatePath(`/clientes/${cliente_id}`);
    return { success: true, message: 'Seus dados foram atualizados com sucesso!' };
  } catch (error: any) {
    console.error('Erro ao atualizar cliente via formulário público:', error);
    return { success: false, message: `Erro ao salvar os dados: ${error.message}` };
  } finally {
    await close();
  }
}
