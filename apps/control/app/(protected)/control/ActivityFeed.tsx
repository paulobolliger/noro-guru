// app/(protected)/control/ActivityFeed.tsx
import { Clock, AlertTriangle, CheckCircle2, XCircle, TrendingUp } from "lucide-react";

interface ActivityFeedProps {
  webhooks: Array<{
    id: string;
    provider: string | null;
    event: string | null;
    status: string | null;
    created_at: string;
  }>;
}

// Keyframes CSS para animação
const animationStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

export function ActivityFeed({ webhooks }: ActivityFeedProps) {
  const getStatusConfig = (status: string | null) => {
    const statusLower = (status || '').toLowerCase();
    
    if (statusLower.includes('success') || statusLower === 'completed' || statusLower === '200') {
      return {
        icon: CheckCircle2,
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
        label: 'Success'
      };
    }
    
    if (statusLower.includes('error') || statusLower.includes('failed') || statusLower.startsWith('5')) {
      return {
        icon: XCircle,
        color: 'text-rose-500',
        bg: 'bg-rose-500/10',
        label: 'Error'
      };
    }
    
    if (statusLower.includes('pending') || statusLower.includes('processing')) {
      return {
        icon: Clock,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
        label: 'Pending'
      };
    }
    
    return {
      icon: AlertTriangle,
      color: 'text-slate-400',
      bg: 'bg-slate-500/10',
      label: status || 'Unknown'
    };
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora';
    if (diffMins < 60) return `${diffMins}min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: animationStyles }} />
      <div className="bg-[#1a1625] rounded-2xl p-6 border border-[#D4AF37]/10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#4aede5]" />
              Activity Feed
            </h3>
            <p className="text-sm text-slate-400 mt-1">Eventos recentes dos webhooks</p>
          </div>
          <button className="text-sm text-[#4aede5] hover:text-[#4aede5]/80 font-medium transition-colors">
            Ver todos
          </button>
        </div>

        <div className="space-y-3">
          {webhooks.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-slate-500/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-slate-500" />
              </div>
              <p className="text-slate-400 text-sm">Nenhum evento recente</p>
            </div>
          ) : (
            webhooks.map((webhook, index) => {
              const statusConfig = getStatusConfig(webhook.status);
              const StatusIcon = statusConfig.icon;
              
              return (
                <div
                  key={webhook.id}
                  className="group relative bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/10 hover:border-[#4aede5]/30 transition-all cursor-pointer"
                  style={{
                    animation: `fadeInUp 0.3s ease-out ${index * 0.05}s backwards`
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg ${statusConfig.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-medium text-white text-sm truncate">
                          {webhook.provider || 'Unknown Provider'}
                        </h4>
                        <span className="text-xs text-slate-500 flex-shrink-0">
                          {formatTimestamp(webhook.created_at)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-slate-400 truncate mb-2">
                        {webhook.event || 'No event type'}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.color} font-medium`}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
