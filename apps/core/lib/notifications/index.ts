// lib/notifications/index.ts
/**
 * Sistema de Notificações In-App
 *
 * Sistema completo de notificações para usuários
 */

// Manager (funções core)
export {
  createNotification,
  createBulkNotifications,
  listNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
  cleanupOldNotifications,
} from './manager';

export type { Notification } from './manager';

// Templates (helpers para notificações comuns)
export {
  notifyNewBooking,
  notifyPaymentReceived,
  notifyPaymentPending,
  notifyQuoteApproved,
  notifyNewQuote,
  notifyNewMessage,
  notifyDocumentReady,
  notifyBookingStatusChange,
  notifyTeamNewLead,
  notifyUpcomingTrip,
  notifySystemError,
} from './templates';

// Schemas
export {
  NotificationType,
  createNotificacaoSchema,
  updateNotificacaoSchema,
  searchNotificacoesSchema,
} from '@/lib/schemas/notificacao.schema';

export type {
  CreateNotificacaoInput,
  UpdateNotificacaoInput,
  SearchNotificacoesInput,
} from '@/lib/schemas/notificacao.schema';
