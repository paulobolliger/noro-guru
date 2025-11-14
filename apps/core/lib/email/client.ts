// lib/email/client.ts
import { Resend } from 'resend';

/**
 * Cliente Resend para envio de emails
 * Configurado com API key do .env
 */
export const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Configurações de email por tenant
 */
export interface EmailConfig {
  /** Email remetente (deve estar verificado no Resend) */
  from: string;
  /** Nome do remetente */
  fromName: string;
  /** Email de resposta (reply-to) */
  replyTo?: string;
}

/**
 * Obtém configuração de email para um tenant
 * Por enquanto retorna config padrão, mas pode ser extendido
 * para buscar do banco de dados baseado no tenant_id
 */
export function getEmailConfig(tenantId?: string): EmailConfig {
  // Config padrão do sistema
  const defaultConfig: EmailConfig = {
    from: process.env.EMAIL_FROM || 'noreply@noro.travel',
    fromName: process.env.EMAIL_FROM_NAME || 'Noro Travel',
    replyTo: process.env.EMAIL_REPLY_TO,
  };

  // TODO: Implementar busca de config por tenant no banco
  // Se o tenant tiver domínio próprio e email verificado,
  // retornar a config personalizada dele

  return defaultConfig;
}
