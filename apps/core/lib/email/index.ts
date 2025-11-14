// lib/email/index.ts
/**
 * Sistema de Email Transacional
 *
 * Exporta todas as funções e templates de email
 */

// Cliente e configuração
export { resend, getEmailConfig } from './client';
export type { EmailConfig } from './client';

// Funções de envio
export { sendEmail, sendSimpleEmail, sendBulkEmails } from './send';
export type { SendEmailOptions, SendEmailResult } from './send';

// Templates
export { default as WelcomeEmail } from './templates/welcome';
export { default as ResetPasswordEmail } from './templates/reset-password';
export { default as BookingConfirmationEmail } from './templates/booking-confirmation';
