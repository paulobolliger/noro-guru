'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, MoreVertical, Clock, CheckCircle, AlertCircle, User, Bot, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Conversation, Message } from '../../actions';
import { sendMessage, updateConversationStatus, markMessagesAsRead } from '../../actions';

type Props = {
  conversation: Conversation;
  initialMessages: Message[];
};

const STATUS_OPTIONS = [
  { value: 'active', label: 'Ativo', icon: AlertCircle, color: 'text-green-500' },
  { value: 'waiting', label: 'Aguardando', icon: Clock, color: 'text-yellow-500' },
  { value: 'closed', label: 'Fechado', icon: CheckCircle, color: 'text-gray-500' },
];

export default function ChatConversationClient({ conversation, initialMessages }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark as read on mount
  useEffect(() => {
    if (conversation.unread_count > 0) {
      markMessagesAsRead(conversation.id);
    }
  }, [conversation.id, conversation.unread_count]);

  // Focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const messageText = newMessage;
    setNewMessage('');

    try {
      const sentMessage = await sendMessage(conversation.id, messageText);
      setMessages(prev => [...prev, sentMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setNewMessage(messageText); // Restore message on error
    } finally {
      setIsSubmitting(false);
      inputRef.current?.focus();
    }
  };

  const handleStatusChange = async (newStatus: 'active' | 'waiting' | 'closed') => {
    try {
      await updateConversationStatus(conversation.id, newStatus);
      setShowStatusMenu(false);
      router.refresh();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const currentStatus = STATUS_OPTIONS.find(s => s.value === conversation.status);
  const StatusIcon = currentStatus?.icon || AlertCircle;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Header */}
      <div className="surface-card border-b border-default p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/comunicacao"
              className="text-muted hover:text-primary transition-colors"
            >
              <ArrowLeft size={24} />
            </Link>

            {/* Client Info */}
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-lg">
                {conversation.client_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="font-semibold text-primary text-lg">
                {conversation.client_name}
              </h2>
              <p className="text-muted text-sm">{conversation.client_email}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Status Badge */}
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border border-default hover:bg-background transition-colors ${currentStatus?.color}`}
              >
                <StatusIcon size={16} />
                <span className="text-sm font-medium">{currentStatus?.label}</span>
              </button>

              {/* Status Menu */}
              {showStatusMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface-card border border-default rounded-lg shadow-xl z-10">
                  {STATUS_OPTIONS.map((status) => {
                    const Icon = status.icon;
                    return (
                      <button
                        key={status.value}
                        onClick={() => handleStatusChange(status.value as any)}
                        className={`w-full flex items-center gap-2 px-4 py-3 hover:bg-background transition-colors first:rounded-t-lg last:rounded-b-lg ${status.color}`}
                      >
                        <Icon size={16} />
                        <span className="text-sm">{status.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button className="text-muted hover:text-primary transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background">
        {messages.map((message) => {
          const isClient = message.sender === 'client';
          const isBot = message.sender === 'bot';
          
          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isClient ? 'flex-row' : 'flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                isClient 
                  ? 'bg-primary/10' 
                  : isBot 
                    ? 'bg-yellow-500/10' 
                    : 'bg-blue-500/10'
              }`}>
                {isClient ? (
                  <User className="w-5 h-5 text-primary" />
                ) : isBot ? (
                  <Bot className="w-5 h-5 text-yellow-500" />
                ) : (
                  <span className="text-blue-500 font-bold text-sm">A</span>
                )}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[70%] ${isClient ? 'items-start' : 'items-end'}`}>
                <div className={`rounded-2xl px-4 py-3 ${
                  isClient
                    ? 'bg-surface-card border border-default'
                    : isBot
                      ? 'bg-yellow-500/10 border border-yellow-500/20'
                      : 'bg-primary text-white'
                }`}>
                  <p className={`text-sm ${isClient || isBot ? 'text-primary' : 'text-white'}`}>
                    {message.message}
                  </p>
                </div>
                <p className="text-xs text-muted mt-1 px-2">
                  {formatTime(message.created_at)}
                  {!isClient && !message.read && ' • Enviado'}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="surface-card border-t border-default p-4">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <textarea
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder="Digite sua mensagem... (Shift+Enter para nova linha)"
            rows={2}
            className="flex-1 px-4 py-3 bg-background border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSubmitting}
            className="btn-primary px-6 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send size={20} />
                Enviar
              </>
            )}
          </button>
        </form>
        <p className="text-muted text-xs mt-2">
          Pressione Enter para enviar • Shift+Enter para nova linha
        </p>
      </div>

      {/* Close Status Menu on Outside Click */}
      {showStatusMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowStatusMenu(false)}
        />
      )}
    </div>
  );
}
