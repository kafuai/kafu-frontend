import {
  EnterpriseDemoPresentation,
  EnterpriseDemoPresentationMetric,
  EnterpriseDemoPresentationSection,
} from "./enterpriseDemoPresentationTypes";

export interface EnterpriseDemoPresentationViewModel {
  presentationId: string;
  title: string;
  status: EnterpriseDemoPresentation["status"];
  audience: EnterpriseDemoPresentation["audience"];
  sections: EnterpriseDemoPresentationSectionViewModel[];
}

export interface EnterpriseDemoPresentationSectionViewModel {
  id: string;
  title: string;
  subtitle: string | null;
  narrative: string;
  type: EnterpriseDemoPresentationSection["type"];
  order: number;
  metrics: EnterpriseDemoPresentationMetricViewModel[];
}

export interface EnterpriseDemoPresentationMetricViewModel {
  id: string;
  label: string;
  value: string;
  description: string | null;
  emphasis: EnterpriseDemoPresentationMetric["emphasis"];
}

export function buildEnterpriseDemoPresentationViewModel(
  presentation: EnterpriseDemoPresentation,
): EnterpriseDemoPresentationViewModel {
  return {
    presentationId: presentation.id,
    title: presentation.title,
    status: presentation.status,
    audience: presentation.audience,
    sections: presentation.sections
      .filter((section) => section.visible)
      .sort(
        (firstSection, secondSection) =>
          firstSection.order - secondSection.order,
      )
      .map(buildSectionViewModel),
  };
}

function buildSectionViewModel(
  section: EnterpriseDemoPresentationSection,
): EnterpriseDemoPresentationSectionViewModel {
  return {
    id: section.id,
    title: section.title,
    subtitle: section.subtitle ?? null,
    narrative: section.narrative,
    type: section.type,
    order: section.order,
    metrics: section.metrics.map((metric) => ({
      id: metric.id,
      label: metric.label,
      value: metric.value,
      description: metric.description ?? null,
      emphasis: metric.emphasis,
    })),
  };
}
