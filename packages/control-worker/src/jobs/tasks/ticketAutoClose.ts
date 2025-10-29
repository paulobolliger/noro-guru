import type { TaskList } from "graphile-worker";

export const TICKET_AUTO_CLOSE_TASK = "support_ticket_auto_close";

type Payload = {
  ticketId: string;
  inactivityDays?: number;
};

export function registerAutoClose(taskList: TaskList) {
  taskList[TICKET_AUTO_CLOSE_TASK] = async (payload: Payload, helpers) => {
    helpers.logger.info(`auto-close placeholder for ticket ${payload.ticketId}`);
    // TODO: implement auto-close logic and follow up jobs
  };
}