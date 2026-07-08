import { AdminConsole } from "./adminConsole";
import { AdminService } from "./adminService";

export class AdminManager {
  constructor(private readonly service: AdminService) {}

  getConsole(id: string): AdminConsole | undefined {
    return this.service.findById(id);
  }

  listConsoles(): AdminConsole[] {
    return this.service.list();
  }
}
