export type ExecutiveSummaryCompany = {
  id: string;
  name: string | null;
  industry: string | null;
  country: string | null;
  employee_count: number | null;
  contact_name: string | null;
  contact_title: string | null;
};

export type DiscoveryAnswer = {
  id: string;
  question: string;
  answer: string;
  question_order: number;
};

export type ReadinessMatrixItem = {
  area: string;
  score: number;
  status: string;
  description: string;
};

export type ExecutiveMetric = {
  label: string;
  value: string;
  note: string;
};