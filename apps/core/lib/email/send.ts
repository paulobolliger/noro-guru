// lib/email/send.ts
import { resend, getEmailConfig } from './client';
import { render } from '@react-email/render';
import { ReactElement } from 'react';

/**
 * Opções para envio de email
 */
export interface SendEmailOptions {
  /** Email(s) destinatário(s) */
  to: string | string[];
  /** Assunto do email */
  subject: string;
  /** Template React ou HTML string */
  template: ReactElement | string;
  /** Tenant ID (para config personalizada) */
  tenantId?: string;
  /** Email(s) em cópia */
  cc?: string | string[];
  /** Email(s) em cópia oculta */
  bcc?: string | string[];
  /** Anexos */
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
  }>;
  /** Tags para tracking */
  tags?: Array<{ name: string; value: string }>;
}

/**
 * Resultado do envio
 */
export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Envia um email transacional usando Resend
 *
 * @example
 * await sendEmail({
 *   to: 'user@example.com',
 *   subject: 'Bem-vindo!',
 *   template: <WelcomeEmail name="João" />,
 *   tenantId: 'tenant-123'
 * });
 */
export async function sendEmail(
  options: SendEmailOptions
): Promise<SendEmailResult> {
  try {
    const { to, subject, template, tenantId, cc, bcc, attachments, tags } = options;

    // Obter config de email para o tenant
    const config = getEmailConfig(tenantId);

    // Renderizar template se for React Element
    const html = typeof template === 'string'
      ? template
      : render(template);

    // Enviar via Resend
    const { data, error } = await resend.emails.send({
      from: `${config.fromName} <${config.from}>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      replyTo: config.replyTo,
      cc: cc ? (Array.isArray(cc) ? cc : [cc]) : undefined,
      bcc: bcc ? (Array.isArray(bcc) ? bcc : [bcc]) : undefined,
      attachments,
      tags: tags?.map(tag => ({ name: tag.name, value: tag.value })),
    });

    if (error) {
      console.error('[Email] Error sending email:', error);
      return {
        success: false,
        error: error.message || 'Erro ao enviar email',
      };
    }

    console.log('[Email] Email sent successfully:', {
      messageId: data?.id,
      to,
      subject,
    });

    return {
      success: true,
      messageId: data?.id,
    };

  } catch (error: any) {
    console.error('[Email] Unexpected error:', error);
    return {
      success: false,
      error: error.message || 'Erro inesperado ao enviar email',
    };
  }
}

/**
 * Envia um email simples de texto (sem template)
 *
 * @example
 * await sendSimpleEmail({
 *   to: 'user@example.com',
 *   subject: 'Notificação',
 *   text: 'Sua reserva foi confirmada!'
 * });
 */
export async function sendSimpleEmail(options: {
  to: string | string[];
  subject: string;
  text: string;
  tenantId?: string;
}): Promise<SendEmailResult> {
  const { to, subject, text, tenantId } = options;

  // Converter texto para HTML básico
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          ${text.split('\n').map(line => `<p>${line}</p>`).join('')}
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject,
    template: html,
    tenantId,
  });
}

/**
 * Agenda envio de email em lote (útil para newsletters)
 * NOTA: Requer implementação de fila/job queue
 */
export async function sendBulkEmails(
  emails: Array<Omit<SendEmailOptions, 'tenantId'>>,
  tenantId?: string
): Promise<{ sent: number; failed: number; errors: string[] }> {
  const results = {
    sent: 0,
    failed: 0,
    errors: [] as string[],
  };

  // Enviar em lotes de 10 para não sobrecarregar
  const batchSize = 10;
  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);

    const promises = batch.map(email =>
      sendEmail({ ...email, tenantId })
    );

    const batchResults = await Promise.allSettled(promises);

    batchResults.forEach((result, idx) => {
      if (result.status === 'fulfilled' && result.value.success) {
        results.sent++;
      } else {
        results.failed++;
        const email = batch[idx];
        const error = result.status === 'fulfilled'
          ? result.value.error
          : result.reason;
        results.errors.push(`Failed to send to ${email.to}: ${error}`);
      }
    });

    // Aguardar 1 segundo entre lotes para respeitar rate limits
    if (i + batchSize < emails.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('[Email] Bulk send complete:', results);
  return results;
}
