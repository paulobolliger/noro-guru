import type { TaskList } from "graphile-worker";

export const TICKET_AUTO_CLOSE_TASK = "support_ticket_auto_close";

type Payload = {
  ticketId: string;
  inactivityDays?: number;
};

export function registerAutoClose(taskList: TaskList) {
  taskList[TICKET_AUTO_CLOSE_TASK] = async (payload: unknown, helpers) => {
    const p = payload as Payload;
    helpers.logger.info(`auto-close placeholder for ticket ${p.ticketId}` as any);
    // Auto-close behavior is intentionally not wired in this local worker.
  };
}
