export type Policy = {
  id: string;
  category: string;
  policyType: string | null; // null = legacy / untyped policy
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export const CATEGORY_OPTIONS_AR = [
  { value: "leave", label: "الإجازات" },
  { value: "general", label: "عام" },
];

export const CATEGORY_OPTIONS_EN = [
  { value: "leave", label: "Leave" },
  { value: "general", label: "General" },
];

export const POLICY_TYPE_OPTIONS_AR: Record<string, { value: string; label: string }[]> = {
  leave: [
    { value: "annual_leave", label: "إجازة سنوية" },
    { value: "emergency_leave", label: "إجازة طارئة" },
    { value: "unpaid_leave", label: "إجازة بدون راتب" },
    { value: "maternity_leave", label: "إجازة أمومة" },
  ],
};

export const POLICY_TYPE_OPTIONS_EN: Record<string, { value: string; label: string }[]> = {
  leave: [
    { value: "annual_leave", label: "Annual Leave" },
    { value: "emergency_leave", label: "Emergency Leave" },
    { value: "unpaid_leave", label: "Unpaid Leave" },
    { value: "maternity_leave", label: "Maternity Leave" },
  ],
};