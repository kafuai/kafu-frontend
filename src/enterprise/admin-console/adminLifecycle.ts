import { AdminConsole } from "./adminConsole";

export function activateAdminConsole(
  console: AdminConsole,
): AdminConsole {
  return {
    ...console,
    context: {
      ...console.context,
      status: "active",
    },
  };
}

export function deactivateAdminConsole(
  console: AdminConsole,
): AdminConsole {
  return {
    ...console,
    context: {
      ...console.context,
      status: "inactive",
    },
  };
}
