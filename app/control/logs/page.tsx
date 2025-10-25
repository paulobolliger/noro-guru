"use client";
import { useEffect, useState } from "react";
import { useSSE } from "@/lib/hooks/useSSE";

type Log = {
  id?: string;
  message: string;
  created_at?: string;
  event_type?: string;
};

export default function LiveLogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const event = useSSE<{ type: string; data: Log }>("/api/control/events");

  useEffect(() => {
    if (event && (event as any).data) {
      setLogs((prev) => [event.data, ...prev].slice(0, 100));
    }
  }, [event]);

  return (
    <div className="p-8 text-white space-y-4">
      <h1 className="text-2xl font-semibold">Logs em Tempo Real</h1>
      <div className="rounded border border-white/10 overflow-hidden">
        {logs.length === 0 ? (
          <p className="p-6 text-white/60">Aguardando eventos...</p>
        ) : (
          logs.map((log, i) => (
            <div key={log.id || i} className="p-3 border-b border-white/10 hover:bg-white/5">
              <p>{log.message || JSON.stringify(log)}</p>
              <p className="text-xs text-white/50 mt-1">
                {log.created_at ? new Date(log.created_at).toLocaleString("pt-BR") : "agora"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
