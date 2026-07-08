import { AdminConsole } from "./adminConsole";

export class AdminRegistry {
  private readonly consoles = new Map<string, AdminConsole>();

  register(console: AdminConsole): void {
    this.consoles.set(console.id, console);
  }

  get(id: string): AdminConsole | undefined {
    return this.consoles.get(id);
  }

  list(): AdminConsole[] {
    return [...this.consoles.values()];
  }
}
