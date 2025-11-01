import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ChatConversationClient from './ChatConversationClient';
import { getConversations, getConversationMessages } from '../../actions';

export const metadata: Metadata = {
  title: 'Conversa | Noro.control',
  description: 'Conversa com cliente',
};

type Props = {
  params: {
    id: string;
  };
};

export default async function ChatConversationPage({ params }: Props) {
  const { id } = params;
  
  // Buscar conversa e mensagens
  const [conversations, messages] = await Promise.all([
    getConversations(),
    getConversationMessages(id),
  ]);

  const conversation = conversations.find(c => c.id === id);
  
  if (!conversation) {
    notFound();
  }

  return (
    <ChatConversationClient 
      conversation={conversation} 
      initialMessages={messages}
    />
  );
}
