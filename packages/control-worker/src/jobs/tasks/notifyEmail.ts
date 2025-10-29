import type { TaskList } from "graphile-worker";

export const NOTIFY_EMAIL_TASK = "support_notify_email";

type Payload = {
  ticketId: string;
  messageId?: string;
  recipient: string;
  template: string;
};

export function registerNotifyEmail(taskList: TaskList) {
  taskList[NOTIFY_EMAIL_TASK] = async (payload: Payload, helpers) => {
    helpers.logger.info(`notify-email placeholder for ticket ${payload.ticketId}`);
    // TODO: implement email delivery via SES or Resend
  };
}