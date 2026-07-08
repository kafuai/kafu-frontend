import { AdminConsole } from "./adminConsole";
import { AdminRegistry } from "./adminRegistry";

export class AdminService {
  constructor(private readonly registry: AdminRegistry) {}

  create(console: AdminConsole): AdminConsole {
    this.registry.register(console);
    return console;
  }

  findById(id: string): AdminConsole | undefined {
    return this.registry.get(id);
  }

  list(): AdminConsole[] {
    return this.registry.list();
  }
}
