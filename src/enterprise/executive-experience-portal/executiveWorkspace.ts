import { ExecutiveWorkspaceModel } from "./executiveExperienceTypes";

export class ExecutiveWorkspace {
  constructor(private readonly workspace: ExecutiveWorkspaceModel) {}

  getWorkspace(): ExecutiveWorkspaceModel {
    return this.workspace;
  }
}
