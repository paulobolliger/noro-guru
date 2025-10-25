import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const supabase = createClient(url, key, {
    realtime: {
      params: { eventsPerSecond: 5 },
    },
  });

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const encoder = new TextEncoder();

      const send = (payload: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };

      const channel = supabase
        .channel("cp_events")
        .on(
          "postgres_changes",
          { event: "*", schema: "cp", table: "system_events" },
          (payload: any) => {
            const data = (payload as any).new ?? payload;
            send({ type: "system_event", data });
          }
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "cp", table: "admin_logs" },
          (payload: any) => {
            const data = (payload as any).new ?? payload;
            send({ type: "admin_log", data });
          }
        )
        .subscribe();

      const interval = setInterval(() => {
        controller.enqueue(encoder.encode(`: heartbeat\n\n`));
      }, 30000);

      const close = () => {
        clearInterval(interval);
        supabase.removeChannel(channel);
        controller.close();
      };

      // Close after 5 minutes to avoid dangling connections
      setTimeout(close, 5 * 60 * 1000);
    },
  });

  return new NextResponse(stream as any, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

