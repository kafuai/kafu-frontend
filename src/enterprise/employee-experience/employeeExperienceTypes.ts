export type EmployeeExperienceStatus =
  | "active"
  | "pending"
  | "needs_attention"
  | "completed";

export type EmployeeSentiment =
  | "positive"
  | "neutral"
  | "negative";

export interface EmployeeProfile {
  id: string;
  name: string;
  role: string;
  department: string;
}

export interface EmployeeRequest {
  id: string;
  title: string;
  status: EmployeeExperienceStatus;
}

export interface EmployeeFeedbackItem {
  id: string;
  comment: string;
  sentiment: EmployeeSentiment;
}

export interface EmployeeExperienceModel {
  id: string;
  employee: EmployeeProfile;
  requests: EmployeeRequest[];
  feedback: EmployeeFeedbackItem[];
  engagementScore: number;
}
