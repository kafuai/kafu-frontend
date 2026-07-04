export type BusinessDependency = {
  sourceServiceId: string;
  targetServiceId: string;
  critical: boolean;
};

export function getDirectDependencies(
  serviceId: string,
  dependencies: BusinessDependency[],
): BusinessDependency[] {
  return dependencies.filter(
    (dependency) => dependency.sourceServiceId === serviceId,
  );
}

export function getDependents(
  serviceId: string,
  dependencies: BusinessDependency[],
): BusinessDependency[] {
  return dependencies.filter(
    (dependency) => dependency.targetServiceId === serviceId,
  );
}

export function hasCriticalDependencies(
  serviceId: string,
  dependencies: BusinessDependency[],
): boolean {
  return getDirectDependencies(serviceId, dependencies).some(
    (dependency) => dependency.critical,
  );
}