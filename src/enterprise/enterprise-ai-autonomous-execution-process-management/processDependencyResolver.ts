import {
  EnterpriseAIProcess,
  EnterpriseAIProcessDependency,
} from "./process.types";

export class EnterpriseAIProcessDependencyResolver {
  resolve(
    process: EnterpriseAIProcess,
  ): EnterpriseAIProcessDependency[] {
    return [...process.dependencies].sort((a, b) =>
      Number(b.required) - Number(a.required),
    );
  }

  hasRequiredDependencies(
    process: EnterpriseAIProcess,
  ): boolean {
    return process.dependencies
      .filter((d) => d.required)
      .every((d) => !!d.processId);
  }
}