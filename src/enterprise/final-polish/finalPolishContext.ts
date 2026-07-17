import {
  FinalPolishItem,
  FinalPolishPlanInput,
} from "./finalPolishTypes";

export interface FinalPolishContextInput {
  organizationId: string;
  companyName: string;
  visualConsistencyComplete?: boolean;
  contentQualityComplete?: boolean;
  responsiveLayoutComplete?: boolean;
  interactionsComplete?: boolean;
  accessibilityComplete?: boolean;
  navigationComplete?: boolean;
  brandingComplete?: boolean;
  executiveExperienceComplete?: boolean;
}

export interface FinalPolishContext {
  organizationId: string;
  companyName: string;
  items: FinalPolishItem[];
  contextSummary: string;
}

function buildPolishItem(
  id: string,
  title: string,
  description: string,
  category: FinalPolishItem["category"],
  complete: boolean,
  priority: FinalPolishItem["priority"] = "high",
): FinalPolishItem {
  return {
    id,
    title,
    description,
    category,
    priority,
    status: complete ? "completed" : "pending",
    required: true,
    completedAt: complete
      ? new Date().toISOString()
      : undefined,
  };
}

export function buildFinalPolishContext(
  input: FinalPolishContextInput,
): FinalPolishContext {
  const items: FinalPolishItem[] = [
    buildPolishItem(
      "visual-consistency",
      "Visual consistency completed",
      "Validate spacing, typography, hierarchy, cards, colors, and page composition.",
      "visual-consistency",
      input.visualConsistencyComplete ?? false,
      "critical",
    ),
    buildPolishItem(
      "content-quality",
      "Content quality completed",
      "Validate headings, descriptions, labels, Arabic and English copy, and executive messaging.",
      "content-quality",
      input.contentQualityComplete ?? false,
      "high",
    ),
    buildPolishItem(
      "responsive-layout",
      "Responsive layouts completed",
      "Validate key pages across desktop, tablet, and mobile screen sizes.",
      "responsive-layout",
      input.responsiveLayoutComplete ?? false,
      "high",
    ),
    buildPolishItem(
      "interaction-quality",
      "Interactions completed",
      "Validate buttons, states, transitions, loading behavior, and user feedback.",
      "interaction",
      input.interactionsComplete ?? false,
      "high",
    ),
    buildPolishItem(
      "accessibility-polish",
      "Accessibility polish completed",
      "Validate contrast, keyboard navigation, semantic structure, and accessible labels.",
      "accessibility",
      input.accessibilityComplete ?? false,
      "high",
    ),
    buildPolishItem(
      "navigation-polish",
      "Navigation polish completed",
      "Validate route transitions, menus, back actions, and executive demo flow continuity.",
      "navigation",
      input.navigationComplete ?? false,
      "critical",
    ),
    buildPolishItem(
      "branding-polish",
      "Branding polish completed",
      "Validate logo placement, visual identity, dark and light presentation, and brand consistency.",
      "branding",
      input.brandingComplete ?? false,
      "high",
    ),
    buildPolishItem(
      "executive-experience",
      "Executive experience completed",
      "Validate clarity, confidence, presentation flow, and overall enterprise product quality.",
      "executive-experience",
      input.executiveExperienceComplete ?? false,
      "critical",
    ),
  ];

  const completedItems = items.filter(
    (item) => item.status === "completed",
  ).length;

  return {
    organizationId: input.organizationId.trim(),
    companyName: input.companyName.trim(),
    items,
    contextSummary:
      `${input.companyName.trim()} final polish context includes ` +
      `${completedItems} of ${items.length} items completed.`,
  };
}

export function buildFinalPolishPlanInput(
  context: FinalPolishContext,
): FinalPolishPlanInput {
  return {
    organizationId: context.organizationId,
    companyName: context.companyName,
    title: `${context.companyName} Final Polish`,
    items: context.items,
    issues: [],
  };
}
