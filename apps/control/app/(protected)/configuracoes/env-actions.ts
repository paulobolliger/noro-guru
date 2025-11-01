// app/(protected)/configuracoes/env-actions.ts
"use server";

import { readFile } from 'fs/promises';
import { join } from 'path';

interface EnvVariable {
  key: string;
  value: string;
  category: 'database' | 'auth' | 'email' | 'api' | 'other';
  description?: string;
  isSecret?: boolean;
  service?: string;
  isEnabled?: boolean;
}

// Função para detectar o serviço baseado na chave
function detectService(key: string): string {
  const keyUpper = key.toUpperCase();
  if (keyUpper.includes('SUPABASE')) return 'SUPABASE';
  if (keyUpper.includes('OPENAI') || keyUpper.includes('OPEN_AI')) return 'OPENAI';
  if (keyUpper.includes('STRIPE')) return 'STRIPE';
  if (keyUpper.includes('AWS') || keyUpper.includes('SES')) return 'AWS';
  if (keyUpper.includes('RESEND')) return 'RESEND';
  if (keyUpper.includes('NEXTAUTH') || keyUpper.includes('AUTH_SECRET')) return 'NEXTAUTH';
  if (keyUpper.includes('NOTION')) return 'NOTION';
  if (keyUpper.includes('VERCEL')) return 'VERCEL';
  if (keyUpper.includes('CLOUDFLARE')) return 'CLOUDFLARE';
  if (keyUpper.includes('N8N')) return 'N8N';
  if (keyUpper.includes('ORACLE')) return 'ORACLE';
  if (keyUpper.includes('DATABASE_URL') || keyUpper.includes('DB_')) return 'DATABASE';
  if (keyUpper.includes('API')) return 'API';
  return 'OTHER';
}

// Função para detectar categoria
function detectCategory(key: string): 'database' | 'auth' | 'email' | 'api' | 'other' {
  const keyUpper = key.toUpperCase();
  if (keyUpper.includes('DATABASE') || keyUpper.includes('SUPABASE') || keyUpper.includes('DB_')) return 'database';
  if (keyUpper.includes('AUTH') || keyUpper.includes('NEXTAUTH')) return 'auth';
  if (keyUpper.includes('EMAIL') || keyUpper.includes('SES') || keyUpper.includes('RESEND') || keyUpper.includes('SMTP')) return 'email';
  if (keyUpper.includes('API') || keyUpper.includes('OPENAI') || keyUpper.includes('NOTION') || keyUpper.includes('N8N')) return 'api';
  return 'other';
}

// Função para detectar se é secret
function isSecretVariable(key: string): boolean {
  const keyUpper = key.toUpperCase();
  const secretKeywords = ['SECRET', 'KEY', 'TOKEN', 'PASSWORD', 'PRIVATE', 'ROLE_KEY'];
  return secretKeywords.some(keyword => keyUpper.includes(keyword));
}

export async function getEnvVariables(): Promise<EnvVariable[]> {
  const envConfig: EnvVariable[] = [];
  
  try {
    // Ler o arquivo .env.local diretamente
    const envPath = join(process.cwd(), '.env.local');
    const envContent = await readFile(envPath, 'utf-8');
    
    const lines = envContent.split('\n');
    let currentSectionComment = '';
    
    for (let line of lines) {
      line = line.trim();
      
      // Ignorar linhas vazias
      if (!line) continue;
      
      // Detectar comentário de seção/título (# texto sem =)
      if (line.startsWith('#') && !line.includes('=')) {
        // Guardar o comentário como título da seção
        currentSectionComment = line.replace(/^#\s*/, '').replace(/🔹/g, '').trim();
        continue;
      }
      
      // Detectar variável comentada/desativada (# KEY=value)
      const commentedMatch = line.match(/^#\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
      if (commentedMatch) {
        const [, key, value] = commentedMatch;
        envConfig.push({
          key,
          value: value.replace(/^["']|["']$/g, ''), // Remover aspas
          service: detectService(key),
          category: detectCategory(key),
          isSecret: isSecretVariable(key),
          description: currentSectionComment || getDescription(key),
          isEnabled: false, // Está comentada
        });
        continue;
      }
      
      // Detectar variável ativa (KEY=value)
      const activeMatch = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
      if (activeMatch) {
        const [, key, value] = activeMatch;
        envConfig.push({
          key,
          value: value.replace(/^["']|["']$/g, ''), // Remover aspas
          service: detectService(key),
          category: detectCategory(key),
          isSecret: isSecretVariable(key),
          description: currentSectionComment || getDescription(key),
          isEnabled: true, // Está ativa
        });
      }
    }
    
  } catch (error) {
    console.error('Erro ao ler .env.local:', error);
    // Fallback: retornar vazio
    return [];
  }

  // Ordenar por serviço e depois por chave
  envConfig.sort((a, b) => {
    if (a.service !== b.service) {
      return (a.service || '').localeCompare(b.service || '');
    }
    return a.key.localeCompare(b.key);
  });

  return envConfig;
}

// Descrições personalizadas para variáveis conhecidas
function getDescription(key: string): string | undefined {
  const descriptions: Record<string, string> = {
    'DATABASE_URL': 'URL de conexão com o banco de dados PostgreSQL',
    'DIRECT_URL': 'URL direta para conexões com o Supabase',
    'NEXT_PUBLIC_SUPABASE_URL': 'URL pública do Supabase',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'Chave anônima do Supabase (pública)',
    'SUPABASE_SERVICE_ROLE_KEY': 'Chave de service role do Supabase (admin)',
    'NEXTAUTH_SECRET': 'Secret para NextAuth.js (gerado aleatoriamente)',
    'NEXTAUTH_URL': 'URL base da aplicação',
    'AWS_REGION': 'Região da AWS (ex: us-east-1)',
    'AWS_ACCESS_KEY_ID': 'Access Key ID da AWS',
    'AWS_SECRET_ACCESS_KEY': 'Secret Access Key da AWS',
    'SES_DEFAULT_SENDER': 'Email remetente padrão do AWS SES',
    'RESEND_API_KEY': 'Chave de API do Resend (serviço de email)',
    'OPENAI_API_KEY': 'Chave de API da OpenAI',
    'NOTION_API_KEY': 'Chave de API do Notion',
    'NOTION_DATABASE_ID': 'ID do banco de dados do Notion',
    'NODE_ENV': 'Ambiente de execução (development, production)',
    'VERCEL_TOKEN': 'Token de API do Vercel',
    'VERCEL_PROJECT_ID': 'ID do projeto no Vercel',
    'VERCEL_TEAM_ID': 'ID do time no Vercel',
    'CLOUDFLARE_API_TOKEN': 'Token de API da Cloudflare',
    'CLOUDFLARE_ACCOUNT_ID': 'ID da conta Cloudflare',
    'CLOUDFLARE_ZONE_ID': 'ID da zona DNS Cloudflare',
    'N8N_URL': 'URL da instância N8N',
    'N8N_API_KEY': 'Chave de API do N8N',
    'CONTROL_URL': 'URL do Control Plane',
    'DOMAIN_ROOT': 'Domínio raiz do projeto',
  };

  return descriptions[key];
}
