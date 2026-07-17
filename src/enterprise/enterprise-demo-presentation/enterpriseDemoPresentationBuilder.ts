import {
  EnterpriseDemoPresentationEmphasis,
  EnterpriseDemoPresentationMetric,
  EnterpriseDemoPresentationSection,
  EnterpriseDemoPresentationSectionType,
} from "./enterpriseDemoPresentationTypes";

export interface BuildEnterpriseDemoPresentationMetricInput {
  id: string;
  label: string;
  value: string;
  description?: string | null;
  emphasis?: EnterpriseDemoPresentationEmphasis;
}

export function buildEnterpriseDemoPresentationMetric(
  input: BuildEnterpriseDemoPresentationMetricInput,
): EnterpriseDemoPresentationMetric {
  return {
    id: input.id.trim(),
    label: input.label.trim(),
    value: input.value.trim(),
    description: input.description?.trim() || null,
    emphasis: input.emphasis ?? "standard",
  };
}

export interface BuildEnterpriseDemoPresentationSectionInput {
  id: string;
  title: string;
  subtitle?: string | null;
  narrative: string;
  type: EnterpriseDemoPresentationSectionType;
  order: number;
  visible?: boolean;
  metrics?: EnterpriseDemoPresentationMetric[];
}

export function buildEnterpriseDemoPresentationSection(
  input: BuildEnterpriseDemoPresentationSectionInput,
): EnterpriseDemoPresentationSection {
  return {
    id: input.id.trim(),
    title: input.title.trim(),
    subtitle: input.subtitle?.trim() || null,
    narrative: input.narrative.trim(),
    type: input.type,
    order: input.order,
    visible: input.visible ?? true,
    metrics: [...(input.metrics ?? [])],
  };
}
