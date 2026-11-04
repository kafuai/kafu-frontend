"use client";

import type { AssessmentFormData } from "./types";

interface ContactInfoFormProps {
  title: string;
  placeholders: Record<string, string>;
  data: AssessmentFormData;
  onChange: (field: keyof AssessmentFormData, value: string) => void;
  isArabic: boolean;
}

export default function ContactInfoForm({ title, placeholders, data, onChange, isArabic }: ContactInfoFormProps) {
  const baseInputClass = "rounded-xl border border-slate-300 p-4 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500";
  const dirClass = isArabic ? "text-right" : "text-left";

  return (
    <div>
      <h2 className="text-3xl font-bold">{title}</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <input
          className={baseInputClass}
          placeholder={placeholders.contactName}
          value={data.contactName}
          onChange={(e) => onChange("contactName", e.target.value)}
          required
        />
        <input
          className={`${baseInputClass} ${dirClass}`}
          type="email"
          dir="ltr"
          placeholder={placeholders.contactEmail}
          value={data.contactEmail}
          onChange={(e) => onChange("contactEmail", e.target.value)}
          required
        />
        <input
          className={`${baseInputClass} ${dirClass}`}
          dir="ltr"
          type="tel"
          placeholder={placeholders.contactPhone}
          value={data.contactPhone}
          onChange={(e) => {
            const onlyNumbers = e.target.value.replace(/[^0-9+]/g, "");
            onChange("contactPhone", onlyNumbers);
          }}
          required
        />
        <input
          className={baseInputClass}
          placeholder={placeholders.contactTitle}
          value={data.contactTitle}
          onChange={(e) => onChange("contactTitle", e.target.value)}
          required
        />
      </div>
    </div>
  );
}