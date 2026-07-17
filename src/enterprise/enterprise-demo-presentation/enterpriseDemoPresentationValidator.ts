import {
  EnterpriseDemoPresentation,
  EnterpriseDemoPresentationSection,
} from "./enterpriseDemoPresentationTypes";

export interface EnterpriseDemoPresentationValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

function validateSection(
  section: EnterpriseDemoPresentationSection,
): string[] {
  const errors: string[] = [];

  if (!section.id.trim()) {
    errors.push("Presentation section id is required.");
  }

  if (!section.title.trim()) {
    errors.push(`Presentation section "${section.id}" requires a title.`);
  }

  if (!section.narrative.trim()) {
    errors.push(
      `Presentation section "${section.id}" requires a narrative.`,
    );
  }

  if (!Number.isInteger(section.order) || section.order < 0) {
    errors.push(
      `Presentation section "${section.id}" requires a valid order.`,
    );
  }

  return errors;
}

export function validateEnterpriseDemoPresentation(
  presentation: EnterpriseDemoPresentation,
): EnterpriseDemoPresentationValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!presentation.id.trim()) {
    errors.push("Presentation id is required.");
  }

  if (!presentation.organizationId.trim()) {
    errors.push("Organization id is required.");
  }

  if (!presentation.demoRuntimeId.trim()) {
    errors.push("Demo runtime id is required.");
  }

  if (!presentation.title.trim()) {
    errors.push("Presentation title is required.");
  }

  if (presentation.sections.length === 0) {
    warnings.push("Presentation does not contain any sections.");
  }

  const sectionIds = new Set<string>();
  const sectionOrders = new Set<number>();

  for (const section of presentation.sections) {
    errors.push(...validateSection(section));

    if (sectionIds.has(section.id)) {
      errors.push(`Duplicate presentation section id: "${section.id}".`);
    }

    if (sectionOrders.has(section.order)) {
      errors.push(
        `Duplicate presentation section order: "${section.order}".`,
      );
    }

    sectionIds.add(section.id);
    sectionOrders.add(section.order);
  }

  const visibleSections = presentation.sections.filter(
    (section) => section.visible,
  );

  if (visibleSections.length === 0 && presentation.sections.length > 0) {
    warnings.push("Presentation does not contain any visible sections.");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
