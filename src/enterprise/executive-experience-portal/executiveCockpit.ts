import { ExecutiveWorkspaceModel } from "./executiveExperienceTypes";

export class ExecutiveCockpit {
  constructor(private readonly workspace: ExecutiveWorkspaceModel) {}

  overview(): ExecutiveWorkspaceModel {
    return this.workspace;
  }
}
