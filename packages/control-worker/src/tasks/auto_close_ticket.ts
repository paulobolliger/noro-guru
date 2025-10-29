import type { TaskList } from "graphile-worker";

export const AUTO_CLOSE_TICKET = "auto_close_ticket";

type Payload = { ticketId: string; inactivityDays?: number };

export function registerAutoCloseTicket(taskList: TaskList) {
  taskList[AUTO_CLOSE_TICKET] = async (payload: Payload, helpers) => {
    const days = payload.inactivityDays ?? 14;
    await helpers.withPgClient(async (pg) => {
      await pg.query(
        `update cp.support_tickets t
           set status = 'resolved', closed_at = now(), updated_at = now()
         where t.id = $1
           and coalesce((select max(m.created_at) from cp.support_messages m where m.ticket_id = t.id), t.created_at) < now() - ($2 || ' days')::interval
           and t.status not in ('resolved','closed')`,
        [payload.ticketId, String(days)]
      );
    });
    helpers.logger.info(`Auto-close evaluated for ticket ${payload.ticketId}`);
  };
}