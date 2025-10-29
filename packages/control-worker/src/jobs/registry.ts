import type { TaskList } from "graphile-worker";
import { registerNotifyEmail } from "./tasks/notifyEmail";
import { registerSlaCheck } from "./tasks/slaCheck";
import { registerAutoClose } from "./tasks/ticketAutoClose";

export const taskList: TaskList = {};

registerNotifyEmail(taskList);
registerSlaCheck(taskList);
registerAutoClose(taskList);

export default taskList;