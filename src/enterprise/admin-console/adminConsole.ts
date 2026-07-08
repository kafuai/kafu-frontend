import { AdminConsoleContext } from "./adminConsoleTypes";

export interface AdminConsole {
  id: string;
  context: AdminConsoleContext;
  name: string;
  createdAt: Date;
}

export function createAdminConsole(console: AdminConsole): AdminConsole {
  return console;
}
