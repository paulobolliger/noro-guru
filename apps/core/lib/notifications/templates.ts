// lib/notifications/templates.ts
import { createNotification, createBulkNotifications } from './manager';
import { NotificationType } from '@/lib/schemas/notificacao.schema';

/**
 * Templates de notificações comuns para o sistema
 * Facilitam a criação de notificações consistentes
 */

/**
 * Notifica sobre nova reserva/pedido
 */
export async function notifyNewBooking(params: {
  userId: string;
  bookingNumber: string;
  destination: string;
  bookingId: string;
}) {
  return createNotification({
    user_id: params.userId,
    tipo: NotificationType.BOOKING,
    titulo: 'Nova Reserva Criada',
    mensagem: `Sua reserva #${params.bookingNumber} para ${params.destination} foi criada com sucesso!`,
    link: `/pedidos/${params.bookingId}`,
    action_label: 'Ver Detalhes',
    action_url: `/pedidos/${params.bookingId}`,
    prioridade: 'alta',
    metadata: {
      bookingId: params.bookingId,
      bookingNumber: params.bookingNumber,
      destination: params.destination,
    },
  });
}

/**
 * Notifica sobre pagamento recebido
 */
export async function notifyPaymentReceived(params: {
  userId: string;
  amount: number;
  currency: string;
  bookingNumber?: string;
  paymentId: string;
}) {
  return createNotification({
    user_id: params.userId,
    tipo: NotificationType.PAYMENT,
    titulo: 'Pagamento Recebido',
    mensagem: `Recebemos seu pagamento de ${params.currency} ${params.amount.toFixed(2)}${
      params.bookingNumber ? ` para a reserva #${params.bookingNumber}` : ''
    }.`,
    link: `/pagamentos/${params.paymentId}`,
    action_label: 'Ver Comprovante',
    action_url: `/pagamentos/${params.paymentId}`,
    prioridade: 'alta',
    metadata: {
      paymentId: params.paymentId,
      amount: params.amount,
      currency: params.currency,
    },
  });
}

/**
 * Notifica sobre pagamento pendente
 */
export async function notifyPaymentPending(params: {
  userId: string;
  amount: number;
  currency: string;
  dueDate: string;
  bookingNumber: string;
  bookingId: string;
}) {
  return createNotification({
    user_id: params.userId,
    tipo: NotificationType.WARNING,
    titulo: 'Pagamento Pendente',
    mensagem: `Você tem um pagamento de ${params.currency} ${params.amount.toFixed(2)} pendente para a reserva #${
      params.bookingNumber
    }. Vencimento: ${new Date(params.dueDate).toLocaleDateString()}.`,
    link: `/pedidos/${params.bookingId}`,
    action_label: 'Pagar Agora',
    action_url: `/pedidos/${params.bookingId}`,
    prioridade: 'alta',
    metadata: {
      bookingId: params.bookingId,
      amount: params.amount,
      dueDate: params.dueDate,
    },
  });
}

/**
 * Notifica sobre orçamento aprovado
 */
export async function notifyQuoteApproved(params: {
  userId: string;
  quoteNumber: string;
  destination: string;
  quoteId: string;
}) {
  return createNotification({
    user_id: params.userId,
    tipo: NotificationType.SUCCESS,
    titulo: 'Orçamento Aprovado',
    mensagem: `Seu orçamento #${params.quoteNumber} para ${params.destination} foi aprovado!`,
    link: `/orcamentos/${params.quoteId}`,
    action_label: 'Ver Orçamento',
    action_url: `/orcamentos/${params.quoteId}`,
    prioridade: 'alta',
    metadata: {
      quoteId: params.quoteId,
      quoteNumber: params.quoteNumber,
    },
  });
}

/**
 * Notifica sobre novo orçamento recebido
 */
export async function notifyNewQuote(params: {
  userId: string;
  quoteNumber: string;
  destination: string;
  quoteId: string;
  agentName: string;
}) {
  return createNotification({
    user_id: params.userId,
    tipo: NotificationType.INFO,
    titulo: 'Novo Orçamento Recebido',
    mensagem: `${params.agentName} enviou um orçamento para ${params.destination}. Confira os detalhes!`,
    link: `/orcamentos/${params.quoteId}`,
    action_label: 'Ver Orçamento',
    action_url: `/orcamentos/${params.quoteId}`,
    prioridade: 'alta',
    metadata: {
      quoteId: params.quoteId,
      quoteNumber: params.quoteNumber,
      agentName: params.agentName,
    },
  });
}

/**
 * Notifica sobre nova mensagem
 */
export async function notifyNewMessage(params: {
  userId: string;
  senderName: string;
  messagePreview: string;
  conversationId: string;
}) {
  return createNotification({
    user_id: params.userId,
    tipo: NotificationType.MESSAGE,
    titulo: `Nova mensagem de ${params.senderName}`,
    mensagem: params.messagePreview.substring(0, 100),
    link: `/mensagens/${params.conversationId}`,
    action_label: 'Responder',
    action_url: `/mensagens/${params.conversationId}`,
    prioridade: 'normal',
    metadata: {
      conversationId: params.conversationId,
      senderName: params.senderName,
    },
  });
}

/**
 * Notifica sobre documento pronto
 */
export async function notifyDocumentReady(params: {
  userId: string;
  documentType: string;
  documentName: string;
  documentUrl: string;
}) {
  return createNotification({
    user_id: params.userId,
    tipo: NotificationType.SUCCESS,
    titulo: 'Documento Pronto',
    mensagem: `Seu ${params.documentType} "${params.documentName}" está pronto para download.`,
    link: params.documentUrl,
    action_label: 'Baixar',
    action_url: params.documentUrl,
    prioridade: 'normal',
    metadata: {
      documentType: params.documentType,
      documentName: params.documentName,
    },
  });
}

/**
 * Notifica sobre alteração de status da reserva
 */
export async function notifyBookingStatusChange(params: {
  userId: string;
  bookingNumber: string;
  oldStatus: string;
  newStatus: string;
  bookingId: string;
}) {
  const statusMessages: Record<string, string> = {
    confirmado: 'foi confirmada',
    em_andamento: 'está em andamento',
    concluido: 'foi concluída',
    cancelado: 'foi cancelada',
  };

  const message = statusMessages[params.newStatus] || 'teve o status alterado';
  const tipo = params.newStatus === 'cancelado' ? NotificationType.WARNING : NotificationType.INFO;

  return createNotification({
    user_id: params.userId,
    tipo,
    titulo: 'Status da Reserva Alterado',
    mensagem: `Sua reserva #${params.bookingNumber} ${message}.`,
    link: `/pedidos/${params.bookingId}`,
    action_label: 'Ver Detalhes',
    action_url: `/pedidos/${params.bookingId}`,
    prioridade: params.newStatus === 'cancelado' ? 'alta' : 'normal',
    metadata: {
      bookingId: params.bookingId,
      oldStatus: params.oldStatus,
      newStatus: params.newStatus,
    },
  });
}

/**
 * Notifica equipe sobre novo lead
 */
export async function notifyTeamNewLead(params: {
  teamUserIds: string[];
  leadName: string;
  leadEmail: string;
  leadId: string;
}) {
  return createBulkNotifications(params.teamUserIds, {
    tipo: NotificationType.INFO,
    titulo: 'Novo Lead Recebido',
    mensagem: `Novo lead: ${params.leadName} (${params.leadEmail})`,
    link: `/leads/${params.leadId}`,
    action_label: 'Ver Lead',
    action_url: `/leads/${params.leadId}`,
    prioridade: 'normal',
    metadata: {
      leadId: params.leadId,
      leadName: params.leadName,
      leadEmail: params.leadEmail,
    },
  });
}

/**
 * Notifica sobre lembrete de viagem próxima
 */
export async function notifyUpcomingTrip(params: {
  userId: string;
  destination: string;
  departureDate: string;
  daysUntilDeparture: number;
  bookingId: string;
}) {
  return createNotification({
    user_id: params.userId,
    tipo: NotificationType.INFO,
    titulo: 'Sua viagem está próxima!',
    mensagem: `Sua viagem para ${params.destination} começa em ${params.daysUntilDeparture} dias (${new Date(
      params.departureDate
    ).toLocaleDateString()}).`,
    link: `/pedidos/${params.bookingId}`,
    action_label: 'Ver Detalhes',
    action_url: `/pedidos/${params.bookingId}`,
    prioridade: 'alta',
    expira_em: params.departureDate,
    metadata: {
      bookingId: params.bookingId,
      daysUntilDeparture: params.daysUntilDeparture,
    },
  });
}

/**
 * Notifica sistema/erro crítico
 */
export async function notifySystemError(params: {
  userId: string;
  errorMessage: string;
  errorCode?: string;
}) {
  return createNotification({
    user_id: params.userId,
    tipo: NotificationType.ERROR,
    titulo: 'Erro no Sistema',
    mensagem: params.errorMessage,
    prioridade: 'urgente',
    metadata: {
      errorCode: params.errorCode,
    },
  });
}
