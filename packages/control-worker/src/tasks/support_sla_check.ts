import type { TaskList } from "graphile-worker";

export const SUPPORT_SLA_CHECK = "support_sla_check";

type Payload = { ticketId: string };

export function registerSupportSlaCheck(taskList: TaskList) {
  taskList[SUPPORT_SLA_CHECK] = async (payload: Payload, helpers) => {
    await helpers.withPgClient(async (pg) => {
      // Ensure SLA row exists with default target (24h)
      await pg.query(
        `insert into cp.support_sla (ticket_id, tenant_id, target_at)
         select t.id, t.tenant_id, now() + interval '24 hours'
         from cp.support_tickets t
         where t.id = $1
         on conflict (ticket_id) do nothing`,
        [payload.ticketId]
      );
      // If breached and not marked, set breached_at
      await pg.query(
        `update cp.support_sla s
           set breached_at = now()
         where s.ticket_id = $1
           and s.breached_at is null
           and s.target_at is not null
           and now() > s.target_at`,
        [payload.ticketId]
      );
    });
    helpers.logger.info(`SLA check done for ticket ${payload.ticketId}`);
  };
}