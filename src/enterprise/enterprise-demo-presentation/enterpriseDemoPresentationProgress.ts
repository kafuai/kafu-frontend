import {
  EnterpriseDemoPresentation,
  EnterpriseDemoPresentationSection,
} from "./enterpriseDemoPresentationTypes";

export interface EnterpriseDemoPresentationProgress {
  currentSectionId: string | null;
  currentSectionNumber: number;
  totalVisibleSections: number;
  completionPercentage: number;
  completed: boolean;
}

export function calculateEnterpriseDemoPresentationProgress(
  presentation: EnterpriseDemoPresentation,
  currentSectionId: string | null,
): EnterpriseDemoPresentationProgress {
  const visibleSections = presentation.sections
    .filter((section) => section.visible)
    .sort(
      (firstSection, secondSection) =>
        firstSection.order - secondSection.order,
    );

  if (visibleSections.length === 0) {
    return {
      currentSectionId: null,
      currentSectionNumber: 0,
      totalVisibleSections: 0,
      completionPercentage: 0,
      completed: false,
    };
  }

  const currentSectionIndex = currentSectionId
    ? visibleSections.findIndex(
        (section) => section.id === currentSectionId,
      )
    : 0;

  const resolvedIndex =
    currentSectionIndex >= 0 ? currentSectionIndex : 0;

  const currentSection =
    visibleSections[resolvedIndex] ?? visibleSections[0];

  const currentSectionNumber = resolvedIndex + 1;

  return {
    currentSectionId: currentSection.id,
    currentSectionNumber,
    totalVisibleSections: visibleSections.length,
    completionPercentage: Math.round(
      (currentSectionNumber / visibleSections.length) * 100,
    ),
    completed:
      currentSectionNumber === visibleSections.length,
  };
}

export function getCompletedEnterpriseDemoPresentationSections(
  presentation: EnterpriseDemoPresentation,
  currentSectionId: string,
): EnterpriseDemoPresentationSection[] {
  const visibleSections = presentation.sections
    .filter((section) => section.visible)
    .sort(
      (firstSection, secondSection) =>
        firstSection.order - secondSection.order,
    );

  const currentIndex = visibleSections.findIndex(
    (section) => section.id === currentSectionId,
  );

  if (currentIndex <= 0) {
    return [];
  }

  return visibleSections.slice(0, currentIndex);
}
