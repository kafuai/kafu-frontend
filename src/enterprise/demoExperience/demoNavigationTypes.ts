import type {
  DemoExperienceSession,
  DemoExperienceStep,
} from "./demoExperienceTypes";

export type DemoNavigationAccessStatus =
  | "allowed"
  | "redirect"
  | "no-session"
  | "completed";

export interface DemoNavigationAccessResult {
  readonly status: DemoNavigationAccessStatus;
  readonly requestedStep: DemoExperienceStep | null;
  readonly currentStep: DemoExperienceStep | null;
  readonly redirectRoute: string | null;
  readonly session: DemoExperienceSession | null;
}
