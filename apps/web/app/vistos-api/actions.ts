'use server';

import { createDatabaseClient } from '@noro/db';
import { partnerApiKeys } from '@noro/db';
import crypto from 'node:crypto';

export type RegisterPartnerResult = 
  | { ok: true; apiKey: string; companyName: string }
  | { ok: false; error: string };

export async function registerB2BPartnerAction(formData: FormData): Promise<RegisterPartnerResult> {
  const companyName = String(formData.get('companyName') || '').trim();
  const document = String(formData.get('document') || '').trim();
  const email = String(formData.get('email') || '').trim();
  
  if (!companyName) {
    return { ok: false, error: 'O nome da empresa é obrigatório.' };
  }
  if (!document) {
    return { ok: false, error: 'O CNPJ/CPF é obrigatório.' };
  }
  if (!email) {
    return { ok: false, error: 'O e-mail de contato é obrigatório.' };
  }

  const { db, close } = createDatabaseClient();

  try {
    // Gerar uma chave aleatória criptográfica
    const prefix = 'noroguru_visa_';
    const randomPart = crypto.randomBytes(24).toString('hex');
    const plaintextKey = `${prefix}${randomPart}`;
    
    // Hash SHA-256 para guardar no banco
    const hash = crypto.createHash('sha256').update(plaintextKey).digest('hex');

    // Expiração opcional (ex: 2 anos a partir de agora)
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 2);

    await db.insert(partnerApiKeys).values({
      companyName,
      document,
      apiKeyHash: hash,
      status: 'active', // Ativa por padrão para facilitar o teste imediato
      rateLimitPerMinute: 60, // Limite padrão da API
      expiresAt,
    });

    return {
      ok: true,
      apiKey: plaintextKey,
      companyName,
    };
  } catch (err: any) {
    console.error('Erro ao registrar parceiro B2B:', err);
    if (String(err.message || '').includes('unique_api_key_hash') || String(err.message || '').includes('api_key_hash')) {
      return { ok: false, error: 'Conflito ao gerar chave. Tente novamente.' };
    }
    return { ok: false, error: 'Erro interno do servidor. Tente novamente mais tarde.' };
  } finally {
    await close();
  }
}
