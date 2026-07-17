import {
  EXECUTIVE_DEMO_AGENDA,
  EXECUTIVE_DEMO_OPENING,
  EXECUTIVE_DEMO_CLOSING,
} from "./executiveDemoNarrative";
import {
  EXECUTIVE_DEMO_FLOW,
} from "./executiveDemoFlow";
import {
  EXECUTIVE_DEMO_PRESENTER_SCRIPT,
} from "./executiveDemoPresenterScript";
import {
  EXECUTIVE_DEMO_REHEARSAL_CHECKLIST,
} from "./executiveDemoRehearsalChecklist";
import {
  validateExecutiveDemo,
} from "./executiveDemoFinalPolishValidator";
import {
  buildExecutiveDemoSignoff,
} from "./executiveDemoSignoff";

export function buildExecutiveDemoFinalPolishPackage() {
  return {
    agenda: EXECUTIVE_DEMO_AGENDA,
    opening: EXECUTIVE_DEMO_OPENING,
    closing: EXECUTIVE_DEMO_CLOSING,
    flow: EXECUTIVE_DEMO_FLOW,
    presenterScript: EXECUTIVE_DEMO_PRESENTER_SCRIPT,
    rehearsalChecklist: EXECUTIVE_DEMO_REHEARSAL_CHECKLIST,
    validation: validateExecutiveDemo(),
    signoff: buildExecutiveDemoSignoff(),
  };
}

export const KAFU_EXECUTIVE_DEMO_FINAL_POLISH =
  buildExecutiveDemoFinalPolishPackage();
