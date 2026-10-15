export type Company = {
  id: string;
  name: string | null;
  industry: string | null;
  country: string | null;
  employee_count: number | null;
};

export type DiscoveryAnswer = {
  id: string;
  question: string;
  answer: string;
  question_order: number;
};

export type WorkforcePriority = "Critical" | "High" | "Medium";

export type WorkforceMember = {
  code: string;
  title: string;
  subtitle: string;
  readiness: string;
  description: string;
  tasks: string[];
  href: string;
};