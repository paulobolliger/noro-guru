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
  taskList[SEND_SUPPORT_EMAIL] = async (payload: Payload, helpers) => {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = Number(process.env.SMTP_PORT || 587);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || "suporte@noro.guru";

    if (!smtpHost || !smtpUser || !smtpPass) {
      helpers.logger.warn("SMTP not configured; skipping email send", payload);
      return;
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
    });

    let subject = "[NORO Support] Atualização de ticket";
    let to = payload.recipient || "";
    let text = "";

    await helpers.withPgClient(async (pg) => {
      const { rows: trows } = await pg.query(
        `select id, subject, requester_email from cp.support_tickets where id = $1`,
        [payload.ticketId]
      );
      const t = trows[0];
      if (!to) to = t?.requester_email || "";
      if (payload.type === "ticket_created") {
        subject = `[NORO Support] Ticket criado: ${t?.subject || payload.ticketId}`;
        text = `Seu ticket foi criado. ID: ${payload.ticketId}`;
      } else if (payload.type === "ticket_updated") {
        subject = `[NORO Support] Ticket atualizado: ${t?.subject || payload.ticketId}`;
        text = `Seu ticket foi atualizado. ID: ${payload.ticketId}`;
      } else if (payload.type === "message_created" && payload.messageId) {
        const { rows: mrows } = await pg.query(
          `select body from cp.support_messages where id = $1`,
          [payload.messageId]
        );
        const body = mrows[0]?.body || "Nova mensagem";
        subject = `[NORO Support] Nova mensagem em: ${t?.subject || payload.ticketId}`;
        text = body;
      }
    });

    if (!to) {
      helpers.logger.warn("No recipient for support email; skipping", payload);
      return;
    }

    await transporter.sendMail({ from: smtpFrom, to, subject, text });
    helpers.logger.info(`Support email sent to ${to} for ticket ${payload.ticketId}`);
  };
}