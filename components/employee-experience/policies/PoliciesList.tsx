// PoliciesList.tsx
import { BookOpenCheck, Pencil, Save, ShieldAlert, Trash2, X } from "lucide-react";
import { Policy } from "./types";

type PoliciesListProps = {
  policies: Policy[];
  copy: any;
  categoryOptions: { value: string; label: string }[];
  policyTypeOptions: Record<string, { value: string; label: string }[]>;
  actionError: string;
  editingId: string | null;
  editCategory: string;
  setEditCategory: (v: string) => void;
  editPolicyType: string;
  setEditPolicyType: (v: string) => void;
  editTitle: string;
  setEditTitle: (v: string) => void;
  editContent: string;
  setEditContent: (v: string) => void;
  editErrors: { title: boolean; content: boolean };
  setEditErrors: React.Dispatch<React.SetStateAction<{ title: boolean; content: boolean }>>;
  editError: string;
  setEditError: (v: string) => void;
  saving: boolean;
  startEdit: (p: Policy) => void;
  setEditingId: (id: string | null) => void;
  handleUpdate: (id: string) => void;
  handleDelete: (id: string) => void;
};

export default function PoliciesList({
  policies,
  copy,
  categoryOptions,
  policyTypeOptions,
  actionError,
  editingId,
  editCategory,
  setEditCategory,
  editPolicyType,
  setEditPolicyType,
  editTitle,
  setEditTitle,
  editContent,
  setEditContent,
  editErrors,
  setEditErrors,
  editError,
  setEditError,
  saving,
  startEdit,
  setEditingId,
  handleUpdate,
  handleDelete,
}: PoliciesListProps) {
  return (
    <>
      {actionError && (
        <div role="alert" className="mb-3 rounded-lg border border-red-200 bg-[var(--critical-background)] px-3 py-2 text-xs font-bold text-[var(--critical)]">
          {actionError}
        </div>
      )}

      <div className="space-y-3">
        {policies.length === 0 && (
          <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-8 text-center text-[var(--text-muted)]">
            <BookOpenCheck size={22} />
            {copy.noPolicies}
          </div>
        )}

        {policies.map((policy) => (
          <div key={policy.id} className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-4">
            {editingId === policy.id ? (
              <div>
                <label className="mb-1 block text-xs font-bold text-[var(--text-muted)]">{copy.category}</label>
                <select
                  value={editCategory}
                  onChange={(e) => {
                    setEditCategory(e.target.value);
                    setEditPolicyType("");
                    setEditError("");
                  }}
                  className="mb-2 w-full rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 py-2 text-sm"
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {policyTypeOptions[editCategory] && (
                  <div className="mb-3">
                    <label className="mb-1 block text-xs font-bold text-[var(--text-muted)]">{copy.policyTypeLabel}</label>
                    <select
                      value={editPolicyType}
                      onChange={(e) => {
                        setEditPolicyType(e.target.value);
                        setEditError("");
                      }}
                      className="mb-2 w-full rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 py-2 text-sm"
                    >
                      <option value="">{copy.noType}</option>
                      {policyTypeOptions[editCategory].map((opt) => (
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
                    value={editTitle}
                    onChange={(e) => {
                      setEditTitle(e.target.value);
                      if (editErrors.title) setEditErrors((prev) => ({ ...prev, title: false }));
                    }}
                    className={`w-full rounded-lg border bg-[var(--background)] px-3 py-2 text-sm ${
                      editErrors.title ? "border-[var(--critical)] mb-1" : "border-[var(--border-default)] mb-2"
                    }`}
                  />
                  {editErrors.title && <p className="mb-2 text-xs text-[var(--critical)]">{copy.errTitleRequired}</p>}
                </div>

                <div className="mb-3">
                  <label className="mb-1 block text-xs font-bold text-[var(--text-muted)]">{copy.policyContent}</label>
                  <textarea
                    value={editContent}
                    onChange={(e) => {
                      setEditContent(e.target.value);
                      if (editErrors.content) setEditErrors((prev) => ({ ...prev, content: false }));
                    }}
                    rows={4}
                    className={`w-full resize-none rounded-lg border bg-[var(--background)] px-3 py-2 text-sm ${
                      editErrors.content ? "border-[var(--critical)] mb-1" : "border-[var(--border-default)] mb-2"
                    }`}
                  />
                  {editErrors.content && <p className="mb-2 text-xs text-[var(--critical)]">{copy.errContentRequired}</p>}
                </div>

                {editError && (
                  <div role="alert" className="mb-2 flex items-start gap-2 rounded-lg border border-red-200 bg-[var(--critical-background)] px-3 py-2 text-xs font-bold text-[var(--critical)]">
                    <ShieldAlert size={14} className="mt-0.5 shrink-0" />
                    <span>{editError}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdate(policy.id)}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--brand-primary)] px-3 py-1.5 text-xs font-extrabold text-white"
                  >
                    <Save size={13} />
                    {copy.save}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setEditError("");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-default)] px-3 py-1.5 text-xs font-bold"
                  >
                    <X size={13} />
                    {copy.cancel}
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="inline-block rounded-full bg-[var(--brand-subtle)] px-2 py-0.5 text-[10px] font-bold text-[var(--brand-primary)]">
                      {categoryOptions.find((c) => c.value === policy.category)?.label ?? policy.category}
                    </span>

                    {policy.policyType && (
                      <span className="ms-1 inline-block rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-[10px] font-bold text-[var(--text-secondary)]">
                        {policyTypeOptions[policy.category]?.find((t) => t.value === policy.policyType)?.label ?? policy.policyType}
                      </span>
                    )}

                    <h3 className="mt-1.5 text-sm font-black text-[var(--text-primary)]">{policy.title}</h3>
                  </div>

                  <div className="flex shrink-0 gap-1.5">
                    <button type="button" onClick={() => startEdit(policy)} className="rounded-lg border border-[var(--border-default)] p-2 hover:bg-[var(--surface-muted)]">
                      <Pencil size={14} />
                    </button>
                    <button type="button" onClick={() => handleDelete(policy.id)} className="rounded-lg border border-red-200 p-2 text-[var(--critical)] hover:bg-[var(--critical-background)]">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{policy.content}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}