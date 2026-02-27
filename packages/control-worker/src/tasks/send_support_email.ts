import type { TaskList } from "graphile-worker";
import nodemailer from "nodemailer";

export const SEND_SUPPORT_EMAIL = "send_support_email";

type Payload = {
  type: "ticket_created" | "ticket_updated" | "message_created";
  ticketId: string;
  messageId?: string;
  tenantId?: string;
  recipient?: string;
};

export function registerSendSupportEmail(taskList: TaskList) {
  taskList[SEND_SUPPORT_EMAIL] = async (payload: unknown, helpers) => {
    const p = payload as Payload;
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || "suporte@noro.guru";

    if (!smtpHost || !smtpUser || !smtpPass) {
      helpers.logger.warn("SMTP not configured; skipping email send", p as any);
      return;
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    let subject = "[NORO Support] Atualização de ticket";
    let to = p.recipient || "";
    let text = "";

    await helpers.withPgClient(async (pg) => {
      const { rows: trows } = await pg.query(
        `select id, subject, requester_email from cp.support_tickets where id = $1`,
        [p.ticketId]
      );
      const t = trows[0];
      if (!to) to = t?.requester_email || "";
      if (p.type === "ticket_created") {
        subject = `[NORO Support] Ticket criado: ${t?.subject || p.ticketId}`;
        text = `Seu ticket foi criado. ID: ${p.ticketId}`;
      } else if (p.type === "ticket_updated") {
        subject = `[NORO Support] Ticket atualizado: ${t?.subject || p.ticketId}`;
        text = `Seu ticket foi atualizado. ID: ${p.ticketId}`;
      } else if (p.type === "message_created" && p.messageId) {
        const { rows: mrows } = await pg.query(
          `select body from cp.support_messages where id = $1`,
          [p.messageId]
        );
        const body = mrows[0]?.body || "Nova mensagem";
        subject = `[NORO Support] Nova mensagem em: ${t?.subject || p.ticketId}`;
        text = body;
      }
    });

    if (!to) {
      helpers.logger.warn("No recipient for support email; skipping", p as any);
      return;
    }

    await transporter.sendMail({ from: smtpFrom, to, subject, text });
    helpers.logger.info(`Support email sent to ${to} for ticket ${p.ticketId}`);
  };
}