"use client";

import type { AssessmentFormData } from "./types";

interface CompanyInfoFormProps {
  title: string;
  placeholders: Record<string, string>;
  data: AssessmentFormData;
  onChange: (field: keyof AssessmentFormData, value: string) => void;
}

export default function CompanyInfoForm({ title, placeholders, data, onChange }: CompanyInfoFormProps) {
  const baseInputClass = "rounded-xl border border-slate-300 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500";

  return (
    <div>
      <h2 className="text-3xl font-bold">{title}</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <input
          className={baseInputClass}
          placeholder={placeholders.companyName}
          value={data.companyName}
          onChange={(e) => onChange("companyName", e.target.value)}
          required
        />
        <input
          className={baseInputClass}
          placeholder={placeholders.industry}
          value={data.industry}
          onChange={(e) => onChange("industry", e.target.value)}
          required
        />
        <input
          className={baseInputClass}
          placeholder={placeholders.country}
          value={data.country}
          onChange={(e) => onChange("country", e.target.value)}
          required
        />
        <input
          className={baseInputClass}
          type="number"
          placeholder={placeholders.employeeCount}
          value={data.employeeCount}
          onChange={(e) => onChange("employeeCount", e.target.value)}
          required
        />
      </div>
    </div>
  );
}