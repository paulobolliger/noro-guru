import type { TaskList } from "graphile-worker";
import { registerSendSupportEmail } from "./send_support_email";
import { registerSupportSlaCheck } from "./support_sla_check";
import { registerAutoCloseTicket } from "./auto_close_ticket";

export const taskList: TaskList = {};

registerSendSupportEmail(taskList);
registerSupportSlaCheck(taskList);
registerAutoCloseTicket(taskList);

export default taskList;