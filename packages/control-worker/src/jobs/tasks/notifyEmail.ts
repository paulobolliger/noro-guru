import type { TaskList } from "graphile-worker";

export const NOTIFY_EMAIL_TASK = "support_notify_email";

type Payload = {
  ticketId: string;
  messageId?: string;
  recipient: string;
  template: string;
};

export function registerNotifyEmail(taskList: TaskList) {
  taskList[NOTIFY_EMAIL_TASK] = async (payload: unknown, helpers) => {
    const p = payload as Payload;
    helpers.logger.info(`notify-email placeholder for ticket ${p.ticketId}` as any);
    // Email delivery is intentionally not wired in this local worker.
  };
}
