import {
  EnterpriseDemoPresentation,
  EnterpriseDemoPresentationAudience,
  EnterpriseDemoPresentationSection,
  EnterpriseDemoPresentationStatus,
} from "./enterpriseDemoPresentationTypes";

export interface CreateEnterpriseDemoPresentationInput {
  id: string;
  organizationId: string;
  demoRuntimeId: string;
  title: string;
  audience: EnterpriseDemoPresentationAudience;
  sections?: EnterpriseDemoPresentationSection[];
  createdAt?: string;
}

export function createEnterpriseDemoPresentation(
  input: CreateEnterpriseDemoPresentationInput,
): EnterpriseDemoPresentation {
  const timestamp = input.createdAt ?? new Date().toISOString();

  return {
    id: input.id,
    organizationId: input.organizationId,
    demoRuntimeId: input.demoRuntimeId,
    title: input.title.trim(),
    audience: input.audience,
    status: "draft",
    sections: [...(input.sections ?? [])].sort(
      (firstSection, secondSection) =>
        firstSection.order - secondSection.order,
    ),
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function updateEnterpriseDemoPresentationStatus(
  presentation: EnterpriseDemoPresentation,
  status: EnterpriseDemoPresentationStatus,
  updatedAt = new Date().toISOString(),
): EnterpriseDemoPresentation {
  return {
    ...presentation,
    status,
    updatedAt,
  };
}

export function replaceEnterpriseDemoPresentationSections(
  presentation: EnterpriseDemoPresentation,
  sections: EnterpriseDemoPresentationSection[],
  updatedAt = new Date().toISOString(),
): EnterpriseDemoPresentation {
  return {
    ...presentation,
    sections: [...sections].sort(
      (firstSection, secondSection) =>
        firstSection.order - secondSection.order,
    ),
    updatedAt,
  };
}
