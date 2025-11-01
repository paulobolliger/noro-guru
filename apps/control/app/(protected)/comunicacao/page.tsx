import { Metadata } from 'next';
import { MessageSquare } from 'lucide-react';
import ChatDashboardClient from './ChatDashboardClient';
import { getConversations } from './actions';

export const metadata: Metadata = {
  title: 'Chat e Atendimento | Noro.control',
  description: 'Gerencie conversas em tempo real com clientes',
};

export default async function ComunicacaoPage() {
  // TODO: Buscar conversas reais do banco quando integrado
  const conversations = await getConversations();

  return <ChatDashboardClient conversations={conversations} />;
}
