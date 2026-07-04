import {
  BusinessDependency,
  getDirectDependencies,
} from "./businessDependencyMap";

export function calculateDependencyDepth(
  serviceId: string,
  dependencies: BusinessDependency[],
): number {
  const visited = new Set<string>();

  function walk(id: string): number {
    if (visited.has(id)) {
      return 0;
    }

    visited.add(id);

    const children = getDirectDependencies(id, dependencies);

    if (children.length === 0) {
      return 0;
    }

    return (
      1 +
      Math.max(
        ...children.map((child) => walk(child.targetServiceId)),
      )
    );
  }

  return walk(serviceId);
}

export function detectCircularDependencies(
  dependencies: BusinessDependency[],
): boolean {
  return dependencies.some(
    (dependency) => dependency.sourceServiceId === dependency.targetServiceId,
  );
}