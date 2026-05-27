import type { TaskList } from "graphile-worker";

export const SLA_CHECK_TASK = "support_sla_check";

type Payload = {
  ticketId: string;
  runAt?: string;
};

export function registerSlaCheck(taskList: TaskList) {
  taskList[SLA_CHECK_TASK] = async (payload: unknown, helpers) => {
    const p = payload as Payload;
    helpers.logger.info(`sla-check placeholder for ticket ${p.ticketId}` as any);
    // SLA evaluation is intentionally not wired in this local worker.
  };
}
