// components/admin/NotificationBell.tsx
'use client';

import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, X } from 'lucide-react';
import type { Notification } from '@/lib/notifications/manager';

interface NotificationBellProps {
  /** Classe CSS adicional */
  className?: string;
  /** Intervalo de polling em ms (default: 30 segundos) */
  pollInterval?: number;
}

const getTypeColor = (tipo: string): string => {
  const colors: Record<string, string> = {
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    booking: 'bg-purple-100 text-purple-800',
    payment: 'bg-emerald-100 text-emerald-800',
    message: 'bg-cyan-100 text-cyan-800',
    system: 'bg-gray-100 text-gray-800',
  };
  return colors[tipo] || colors.info;
};

const getTypeIcon = (tipo: string): string => {
  const icons: Record<string, string> = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌',
    booking: '✈️',
    payment: '💳',
    message: '💬',
    system: '🔧',
  };
  return icons[tipo] || '📢';
};

export default function NotificationBell({
  className = '',
  pollInterval = 30000,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/admin/notifications?limit=20');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await fetch('/api/admin/notifications/unread-count');
      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Mark as read
  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/notifications/${id}`, {
        method: 'PATCH',
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev =>
          prev.map(n => n.id === id ? { ...n, lida: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/notifications/mark-all-read', {
        method: 'POST',
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev =>
          prev.map(n => ({ ...n, lida: true }))
        );
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete notification
  const deleteNotification = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/notifications/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update local state
        const notification = notifications.find(n => n.id === id);
        setNotifications(prev => prev.filter(n => n.id !== id));
        if (notification && !notification.lida) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Initial fetch and polling
  useEffect(() => {
    fetchUnreadCount();
    if (isOpen) {
      fetchNotifications();
    }

    const interval = setInterval(fetchUnreadCount, pollInterval);
    return () => clearInterval(interval);
  }, [isOpen, pollInterval]);

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins}m atrás`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h atrás`;
    if (diffMins < 10080) return `${Math.floor(diffMins / 1440)}d atrás`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label="Notificações"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Notificações</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    disabled={loading}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                    title="Marcar todas como lidas"
                  >
                    <CheckCheck size={18} />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <Bell size={48} className="mx-auto mb-2 opacity-20" />
                  <p>Nenhuma notificação</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notification.lida ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <span className="text-2xl">
                          {getTypeIcon(notification.tipo)}
                        </span>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="text-sm font-semibold text-gray-900 mb-1">
                                {notification.titulo}
                              </h4>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {notification.mensagem}
                              </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1">
                              {!notification.lida && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                  title="Marcar como lida"
                                >
                                  <Check size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                title="Deletar"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(notification.tipo)}`}>
                              {notification.tipo}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(notification.created_at)}
                            </span>
                          </div>

                          {/* Action button */}
                          {notification.action_url && notification.action_label && (
                            <a
                              href={notification.action_url}
                              onClick={() => {
                                markAsRead(notification.id);
                                setIsOpen(false);
                              }}
                              className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              {notification.action_label} →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 text-center">
                <a
                  href="/admin/notifications"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Ver todas as notificações
                </a>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
