'use client';

import { useState, useMemo } from 'react';
import { MessageSquare, Search, Filter, Clock, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import Link from 'next/link';
import type { Conversation } from './actions';

type Props = {
  conversations: Conversation[];
};

const STATUS_LABELS = {
  active: { label: 'Ativo', color: 'bg-green-500', icon: AlertCircle },
  waiting: { label: 'Aguardando', color: 'bg-yellow-500', icon: Clock },
  closed: { label: 'Fechado', color: 'bg-gray-500', icon: CheckCircle },
};

export default function ChatDashboardClient({ conversations }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'waiting' | 'closed'>('all');

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = conversations.length;
    const active = conversations.filter(c => c.status === 'active').length;
    const waiting = conversations.filter(c => c.status === 'waiting').length;
    const totalUnread = conversations.reduce((sum, c) => sum + c.unread_count, 0);
    
    return { total, active, waiting, totalUnread };
  }, [conversations]);

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return conversations.filter(conv => {
      // Status filter
      if (statusFilter !== 'all' && conv.status !== statusFilter) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = conv.client_name.toLowerCase().includes(query);
        const matchesEmail = conv.client_email.toLowerCase().includes(query);
        const matchesMessage = conv.last_message.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesMessage) return false;
      }
      
      return true;
    });
  }, [conversations, statusFilter, searchQuery]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'agora';
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <MessageSquare size={32} className="text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-primary">Chat e Atendimento</h1>
            <p className="text-muted mt-1">Gerencie conversas em tempo real com seus clientes</p>
          </div>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nova Conversa
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="surface-card rounded-xl p-6 border border-default">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted text-sm">Total de Conversas</span>
            <MessageSquare className="text-primary" size={20} />
          </div>
          <p className="text-3xl font-bold text-primary">{metrics.total}</p>
        </div>

        <div className="surface-card rounded-xl p-6 border border-default">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted text-sm">Conversas Ativas</span>
            <AlertCircle className="text-green-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-primary">{metrics.active}</p>
        </div>

        <div className="surface-card rounded-xl p-6 border border-default">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted text-sm">Aguardando</span>
            <Clock className="text-yellow-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-primary">{metrics.waiting}</p>
        </div>

        <div className="surface-card rounded-xl p-6 border border-default">
          <div className="flex items-center justify-between mb-2">
            <span className="text-muted text-sm">Não Lidas</span>
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">{metrics.totalUnread}</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-primary">{metrics.totalUnread}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="surface-card rounded-xl p-6 border border-default">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome, e-mail ou mensagem..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="text-muted" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 bg-background border border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="waiting">Aguardando</option>
              <option value="closed">Fechados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="surface-card rounded-xl border border-default overflow-hidden">
        {filteredConversations.length > 0 ? (
          <div className="divide-y divide-default">
            {filteredConversations.map((conversation) => {
              const StatusIcon = STATUS_LABELS[conversation.status].icon;
              
              return (
                <Link
                  key={conversation.id}
                  href={`/comunicacao/chat/${conversation.id}`}
                  className="block hover:bg-background/50 transition-colors p-6"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-bold text-lg">
                        {conversation.client_name.charAt(0).toUpperCase()}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <h3 className="font-semibold text-primary">
                            {conversation.client_name}
                          </h3>
                          <p className="text-muted text-sm">{conversation.client_email}</p>
                        </div>
                        <span className="text-muted text-xs whitespace-nowrap">
                          {formatTime(conversation.last_message_at)}
                        </span>
                      </div>

                      <p className="text-muted text-sm line-clamp-2 mb-2">
                        {conversation.last_message}
                      </p>

                      <div className="flex items-center gap-3">
                        {/* Status Badge */}
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-white ${STATUS_LABELS[conversation.status].color}`}>
                          <StatusIcon size={12} />
                          {STATUS_LABELS[conversation.status].label}
                        </span>

                        {/* Unread Badge */}
                        {conversation.unread_count > 0 && (
                          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {conversation.unread_count} nova{conversation.unread_count > 1 ? 's' : ''}
                          </span>
                        )}

                        {/* Assigned */}
                        {conversation.assigned_to && (
                          <span className="text-muted text-xs">
                            Atribuído a: <strong>{conversation.assigned_to}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <MessageSquare className="w-16 h-16 text-muted mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-primary mb-2">
              Nenhuma conversa encontrada
            </h3>
            <p className="text-muted">
              {searchQuery || statusFilter !== 'all'
                ? 'Tente ajustar os filtros de busca'
                : 'As conversas dos clientes aparecerão aqui'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
