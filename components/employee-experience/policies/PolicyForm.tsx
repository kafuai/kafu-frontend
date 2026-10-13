// PolicyForm.tsx
import { Save, ShieldAlert } from "lucide-react";

type PolicyFormProps = {
  copy: any;
  categoryOptions: { value: string; label: string }[];
  policyTypeOptions: Record<string, { value: string; label: string }[]>;
  formCategory: string;
  setFormCategory: (v: string) => void;
  formPolicyType: string;
  setFormPolicyType: (v: string) => void;
  formTitle: string;
  setFormTitle: (v: string) => void;
  formContent: string;
  setFormContent: (v: string) => void;
  formErrors: { title: boolean; content: boolean };
  setFormErrors: React.Dispatch<React.SetStateAction<{ title: boolean; content: boolean }>>;
  formError: string;
  setFormError: (v: string) => void;
  saving: boolean;
  handleCreate: () => void;
  setShowForm: (v: boolean) => void;
};

export default function PolicyForm({
  copy,
  categoryOptions,
  policyTypeOptions,
  formCategory,
  setFormCategory,
  formPolicyType,
  setFormPolicyType,
  formTitle,
  setFormTitle,
  formContent,
  setFormContent,
  formErrors,
  setFormErrors,
  formError,
  setFormError,
  saving,
  handleCreate,
  setShowForm,
}: PolicyFormProps) {
  return (
    <div className="mb-5 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-5">
      <div className="mb-3">
        <label className="mb-1 block text-xs font-bold text-[var(--text-muted)]">{copy.category}</label>
        <select
          value={formCategory}
          onChange={(e) => {
            setFormCategory(e.target.value);
            setFormPolicyType("");
            setFormError("");
          }}
          className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 py-2 text-sm"
        >
          {categoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {policyTypeOptions[formCategory] && (
        <div className="mb-3">
          <label className="mb-1 block text-xs font-bold text-[var(--text-muted)]">{copy.policyTypeLabel}</label>
          <select
            value={formPolicyType}
            onChange={(e) => {
              setFormPolicyType(e.target.value);
              setFormError("");
            }}
            className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 py-2 text-sm"
          >
            <option value="">{copy.noType}</option>
            {policyTypeOptions[formCategory].map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-3">
        <label className="mb-1 block text-xs font-bold text-[var(--text-muted)]">{copy.policyTitle}</label>
        <input
          value={formTitle}
          onChange={(e) => {
            setFormTitle(e.target.value);
            if (formErrors.title) setFormErrors((prev) => ({ ...prev, title: false }));
          }}
          placeholder={copy.policyTitlePlaceholder}
          className={`w-full rounded-lg border bg-[var(--background)] px-3 py-2 text-sm ${
            formErrors.title ? "border-[var(--critical)]" : "border-[var(--border-default)]"
          }`}
        />
        {formErrors.title && <p className="mt-1 text-xs text-[var(--critical)]">{copy.errTitleRequired}</p>}
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-xs font-bold text-[var(--text-muted)]">{copy.policyContent}</label>
        <textarea
          value={formContent}
          onChange={(e) => {
            setFormContent(e.target.value);
            if (formErrors.content) setFormErrors((prev) => ({ ...prev, content: false }));
          }}
          rows={5}
          placeholder={copy.policyContentPlaceholder}
          className={`w-full resize-none rounded-lg border bg-[var(--background)] px-3 py-2 text-sm ${
            formErrors.content ? "border-[var(--critical)]" : "border-[var(--border-default)]"
          }`}
        />
        {formErrors.content && <p className="mt-1 text-xs text-[var(--critical)]">{copy.errContentRequired}</p>}
      </div>

      {formError && (
        <div role="alert" className="mb-3 flex items-start gap-2 rounded-lg border border-red-200 bg-[var(--critical-background)] px-3 py-2 text-xs font-bold text-[var(--critical)]">
          <ShieldAlert size={14} className="mt-0.5 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleCreate}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-primary)] px-4 py-2 text-sm font-extrabold text-white disabled:opacity-50"
        >
          <Save size={15} />
          {copy.save}
        </button>
        <button
          type="button"
          onClick={() => {
            setShowForm(false);
            setFormError("");
          }}
          className="rounded-lg border border-[var(--border-default)] px-4 py-2 text-sm font-bold"
        >
          {copy.cancel}
        </button>
      </div>
    </div>
  );
}