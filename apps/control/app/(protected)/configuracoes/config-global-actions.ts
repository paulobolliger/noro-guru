'use server';

import { createDatabaseClient } from '@noro/db';
import type { ConfiguracaoGlobal } from '@/../../packages/types/control-plane';

export async function getConfiguracoesGlobais(): Promise<ConfiguracaoGlobal> {
  const { client, close } = createDatabaseClient();
  try {
    const rows = await client`
      SELECT * 
      FROM platform.config
      LIMIT 1
    `;

    if (!rows || rows.length === 0) throw new Error('Erro ao buscar configurações globais');

    return rows[0] as unknown as ConfiguracaoGlobal;
  } finally {
    await close();
  }
}

export async function salvarConfiguracaoGlobal(
  secao: keyof ConfiguracaoGlobal,
  dados: any
): Promise<{ success: boolean; message: string }> {
  const { client, close } = createDatabaseClient();
  try {
    const jsonStr = JSON.stringify(dados);
    // Atualizar apenas a seção específica usando dynamic column name
    await client`
      UPDATE platform.config
      SET ${client(secao)} = ${jsonStr}::jsonb
      WHERE id = 1
    `;

    return {
      success: true,
      message: 'Configurações atualizadas com sucesso'
    };
  } catch (error: any) {
    console.error('Erro ao salvar configurações:', error);
    return {
      success: false,
      message: error.message || 'Erro ao salvar configurações'
    };
  } finally {
    await close();
  }
}