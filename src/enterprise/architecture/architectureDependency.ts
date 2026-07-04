export interface ArchitectureDependency {
  source: string;
  target: string;
  type: string;
  required: boolean;
}

export function getDependenciesForComponent(
  componentId: string,
  dependencies: ArchitectureDependency[],
): ArchitectureDependency[] {
  return dependencies.filter(
    (dependency) =>
      dependency.source === componentId ||
      dependency.target === componentId,
  );
}

export function getRequiredDependencies(
  dependencies: ArchitectureDependency[],
): ArchitectureDependency[] {
  return dependencies.filter((dependency) => dependency.required);
}