/**
 * Client Padronizado de E-mails Transacionais — Ecossistema NORO
 * Envia para o workflow n8n ("NORO | Emails Transacionais v1") via Brevo SMTP
 */

export interface SendTransactionalEmailParams<TVariables extends Record<string, any> = Record<string, any>> {
  project_slug: 'noro_guru' | 'meus_politicos' | 'vistos_guru' | 'safetrip_guru' | 'nomade_guru';
  template: string;
  to: string;
  variables: TVariables;
}

export interface SendTransactionalEmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export async function sendTransactionalEmail<TVariables extends Record<string, any>>(
  params: SendTransactionalEmailParams<TVariables>
): Promise<SendTransactionalEmailResponse> {
  const webhookUrl =
    process.env.NORO_EMAIL_WEBHOOK_URL ||
    'https://n8n.norotec.cloud/webhook/noro/emails/v1/send';

  const webhookSecret = process.env.NORO_EMAIL_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn('[NORO Email Client] AVISO: NORO_EMAIL_WEBHOOK_SECRET ausente. Modo simulado.');
    console.log(`[SIMULAÇÃO EMAIL] Para: ${params.to} | Template: ${params.template} | Vars:`, params.variables);
    return { success: true, messageId: 'simulated' };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-NORO-Email-Secret': webhookSecret,
      },
      body: JSON.stringify({
        project_slug: params.project_slug,
        template: params.template,
        to: params.to,
        variables: params.variables,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
      const errorMsg = data.error || `HTTP ${response.status} - Falha no webhook de e-mail`;
      console.error(`[NORO Email Client] Falha ao enviar ${params.template} para ${params.to}:`, errorMsg);
      return { success: false, error: errorMsg };
    }

    return {
      success: true,
      messageId: data.message_id || data.messageId,
    };
  } catch (err: any) {
    console.error(`[NORO Email Client] Erro de rede/execução ao chamar webhook:`, err);
    return { success: false, error: err.message || 'Network error contacting email webhook' };
  }
}
