import { Metadata } from 'next';
import ChatbotConfigClient from './ChatbotConfigClient';

export const metadata: Metadata = {
  title: 'Configuração do Chatbot | Noro.control',
  description: 'Configure respostas automáticas e comportamento do chatbot',
};

export default function ChatbotConfigPage() {
  return <ChatbotConfigClient />;
}
