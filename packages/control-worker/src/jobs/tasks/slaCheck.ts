import type { TaskList } from "graphile-worker";

export const SLA_CHECK_TASK = "support_sla_check";

type Payload = {
  ticketId: string;
  runAt?: string;
};

export function registerSlaCheck(taskList: TaskList) {
  taskList[SLA_CHECK_TASK] = async (payload: Payload, helpers) => {
    helpers.logger.info(`sla-check placeholder for ticket ${payload.ticketId}`);
    // TODO: implement SLA evaluation and notifications
  };
}