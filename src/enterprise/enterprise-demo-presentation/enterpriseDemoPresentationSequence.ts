import {
  EnterpriseDemoPresentation,
  EnterpriseDemoPresentationSection,
} from "./enterpriseDemoPresentationTypes";

export interface EnterpriseDemoPresentationSequenceResult {
  sections: EnterpriseDemoPresentationSection[];
  firstSection: EnterpriseDemoPresentationSection | null;
  lastSection: EnterpriseDemoPresentationSection | null;
}

export function sequenceEnterpriseDemoPresentation(
  presentation: EnterpriseDemoPresentation,
): EnterpriseDemoPresentationSequenceResult {
  const sections = presentation.sections
    .filter((section) => section.visible)
    .sort(
      (firstSection, secondSection) =>
        firstSection.order - secondSection.order,
    );

  return {
    sections,
    firstSection: sections[0] ?? null,
    lastSection: sections[sections.length - 1] ?? null,
  };
}

export function getEnterpriseDemoPresentationSectionById(
  presentation: EnterpriseDemoPresentation,
  sectionId: string,
): EnterpriseDemoPresentationSection | null {
  return (
    presentation.sections.find(
      (section) => section.id === sectionId,
    ) ?? null
  );
}

export function getNextEnterpriseDemoPresentationSection(
  presentation: EnterpriseDemoPresentation,
  currentSectionId: string,
): EnterpriseDemoPresentationSection | null {
  const sequence = sequenceEnterpriseDemoPresentation(presentation);
  const currentIndex = sequence.sections.findIndex(
    (section) => section.id === currentSectionId,
  );

  if (
    currentIndex < 0 ||
    currentIndex >= sequence.sections.length - 1
  ) {
    return null;
  }

  return sequence.sections[currentIndex + 1] ?? null;
}

export function getPreviousEnterpriseDemoPresentationSection(
  presentation: EnterpriseDemoPresentation,
  currentSectionId: string,
): EnterpriseDemoPresentationSection | null {
  const sequence = sequenceEnterpriseDemoPresentation(presentation);
  const currentIndex = sequence.sections.findIndex(
    (section) => section.id === currentSectionId,
  );

  if (currentIndex <= 0) {
    return null;
  }

  return sequence.sections[currentIndex - 1] ?? null;
}
