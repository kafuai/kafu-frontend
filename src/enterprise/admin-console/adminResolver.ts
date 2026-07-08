import { AdminConsole } from "./adminConsole";

export function resolveAdminConsole(
  consoles: AdminConsole[],
  id: string,
): AdminConsole | undefined {
  return consoles.find((console) => console.id === id);
}
