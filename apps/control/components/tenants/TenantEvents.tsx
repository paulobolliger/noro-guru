"use client";
import { Card, CardHeader, CardContent, NBadge } from "@/components/ui";
import { Activity, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react";

type Event = {
  id: string;
  type: string;
  message: string;
  data?: any;
  created_at: string;
};

interface TenantEventsProps {
  events: Event[];
}

export default function TenantEvents({ events }: TenantEventsProps) {
  const getEventIcon = (type: string) => {
    if (type.includes("created") || type.includes("activated")) {
      return <CheckCircle size={18} className="text-green-600" />;
    }
    if (type.includes("suspended") || type.includes("removed") || type.includes("deleted")) {
      return <AlertTriangle size={18} className="text-yellow-600" />;
    }
    if (type.includes("error") || type.includes("failed")) {
      return <XCircle size={18} className="text-red-600" />;
    }
    return <Info size={18} className="text-blue-600" />;
  };

  const getEventBadgeVariant = (type: string) => {
    if (type.includes("created") || type.includes("activated")) {
      return "success";
    }
    if (type.includes("suspended") || type.includes("removed")) {
      return "warning";
    }
    if (type.includes("error") || type.includes("failed")) {
      return "error";
    }
    return "default";
  };

  const formatEventType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Activity size={24} className="text-[#D4AF37]" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Eventos do Sistema</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Histórico de ações e eventos relacionados ao tenant
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-[#D4AF37] dark:hover:border-[#4aede5] transition-colors"
            >
              <div className="flex-shrink-0 mt-0.5">{getEventIcon(event.type)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <NBadge variant={getEventBadgeVariant(event.type)}>
                    {formatEventType(event.type)}
                  </NBadge>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(event.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-900 dark:text-white">{event.message}</p>
                {event.data && Object.keys(event.data).length > 0 && (
                  <details className="mt-2">
                    <summary className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer hover:text-gray-900 dark:hover:text-gray-200">
                      Detalhes
                    </summary>
                    <pre className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded text-xs overflow-x-auto">
                      {JSON.stringify(event.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            </div>
          ))}

          {events.length === 0 && (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              Nenhum evento registrado
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
