export interface ArchitectureComponent {
  id: string;
  name: string;
  type: string;
  technologies: string[];
}

export interface ArchitectureBlueprint {
  id: string;
  name: string;
  version: string;
  components: ArchitectureComponent[];
}

export function createArchitectureBlueprint(
  blueprint: ArchitectureBlueprint,
): ArchitectureBlueprint {
  return {
    ...blueprint,
    components: blueprint.components.map((component) => ({
      ...component,
      technologies: [...component.technologies],
    })),
  };
}

export function countBlueprintComponents(
  blueprint: ArchitectureBlueprint,
): number {
  return blueprint.components.length;
}