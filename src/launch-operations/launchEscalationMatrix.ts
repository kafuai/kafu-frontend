export interface LaunchEscalationLevel {
  level: number;
  title: string;
  owner: string;
  trigger: string;
  responseTargetMinutes: number;
}

export const DEFAULT_LAUNCH_ESCALATION_MATRIX: LaunchEscalationLevel[] = [
  {
    level: 1,
    title: "Operational Response",
    owner: "Launch Operations",
    trigger: "Minor service degradation or isolated customer issue",
    responseTargetMinutes: 15,
  },
  {
    level: 2,
    title: "Technical Escalation",
    owner: "Engineering Lead",
    trigger: "Multiple affected users or persistent service degradation",
    responseTargetMinutes: 10,
  },
  {
    level: 3,
    title: "Executive Escalation",
    owner: "Executive Sponsor",
    trigger: "Critical outage, security risk, or launch failure",
    responseTargetMinutes: 5,
  },
];
