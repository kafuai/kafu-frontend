export interface CompensationStructure {
  name: string;
  components: string[];
  effectiveDate: string;
}

export function hasCompensationComponents(
  structure: CompensationStructure
): boolean {
  return structure.components.length > 0;
}

export function addCompensationComponent(
  structure: CompensationStructure,
  component: string
): CompensationStructure {
  return {
    ...structure,
    components: [
      ...structure.components,
      component,
    ],
  };
}
