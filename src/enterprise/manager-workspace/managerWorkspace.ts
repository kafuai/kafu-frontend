import { ManagerWorkspaceModel } from "./managerWorkspaceTypes";

export class ManagerWorkspace {
  constructor(private readonly workspace: ManagerWorkspaceModel) {}

  getWorkspace(): ManagerWorkspaceModel {
    return this.workspace;
  }
}
