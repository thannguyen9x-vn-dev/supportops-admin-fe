import { authHandlers } from "./auth.handlers";
import { kanbanHandlers } from "./kanban.handlers";
import { productHandlers } from "./product.handlers";

export const handlers = [...authHandlers, ...productHandlers, ...kanbanHandlers];
