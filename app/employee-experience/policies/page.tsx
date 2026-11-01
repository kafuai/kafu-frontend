"use client";

import { useEffect, useState } from "react";
import { BookOpenCheck, LoaderCircle, Pencil, Plus, Save, ShieldAlert, Trash2, X } from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";

import { Policy } from "@/components/employee-experience/policies/types";
import { useAppCopy } from "@/components/employee-experience/policies/useAppCopy";

const fieldLabel = "block text-xs font-black text-[var(--text-secondary)]";
const fieldBase =
  "mt-1.5 block w-full rounded-xl border bg-[var(--background)] px-3 text-sm font-bold text-[var(--text-primary)] outline-none transition focus:border-[var(--brand-primary)] focus:bg-[var(--surface)]";
const selectCls = `${fieldBase} h-11 border-[var(--border-default)]`;
const inputCls = (err: boolean) =>
  `${fieldBase} h-11 ${err ? "border-[var(--critical)]" : "border-[var(--border-default)]"}`;
const textareaCls = (err: boolean) =>
  `${fieldBase} resize-none py-3 font-medium leading-7 ${err ? "border-[var(--critical)]" : "border-[var(--border-default)]"}`;
const btn =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 text-sm font-black text-white shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
const ghost =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-4 text-sm font-black text-[var(--text-secondary)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] disabled:cursor-not-allowed disabled:opacity-50";
const iconBtn =
  "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface)] text-[var(--text-secondary)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] disabled:cursor-not-allowed disabled:opacity-50";
const iconBtnDanger =
  "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-[var(--surface)] text-[var(--critical)] transition hover:bg-[var(--critical-background)] disabled:cursor-not-allowed disabled:opacity-50";
const errorBox =
  "flex items-start gap-2 rounded-xl border border-red-200 bg-[var(--critical-background)] px-3 py-2.5 text-xs font-bold text-[var(--critical)]";

export default function PoliciesPage() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const { copy, categoryOptions, policyTypeOptions } = useAppCopy(isArabic);

  // States
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error" | "forbidden">("loading");
  const [loadError, setLoadError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCategory, setFormCategory] = useState("general");
  const [formPolicyType, setFormPolicyType] = useState("");
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState({ title: false, content: false });
  const [formError, setFormError] = useState("");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("general");
  const [editPolicyType, setEditPolicyType] = useState("");
  const [editErrors, setEditErrors] = useState({ title: false, content: false });
  const [editError, setEditError] = useState("");

  const [actionError, setActionError] = useState("");

  async function loadPolicies() {
    setLoadState("loading");
    try {
      const response = await fetch("/api/employee-experience/policies", { method: "GET" });
      if (response.status === 403) {
        setLoadState("forbidden");
        return;
      }
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? copy.errUnableLoad);
      }
      setPolicies(payload.data ?? []);
      setLoadState("loaded");
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : copy.errUnableLoad);
      setLoadState("error");
    }
  }

  useEffect(() => {
    loadPolicies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate() {
    const isTitleEmpty = !formTitle.trim();
    const isContentEmpty = !formContent.trim();
    if (isTitleEmpty || isContentEmpty) {
      setFormErrors({ title: isTitleEmpty, content: isContentEmpty });
      return;
    }

    setSaving(true);
    setFormErrors({ title: false, content: false });
    setFormError("");

    try {
      const response = await fetch("/api/employee-experience/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          content: formContent,
          category: formCategory,
          policyType: formPolicyType,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.code === "POLICY_DUPLICATE" ? copy.errDuplicate : payload.error ?? copy.errUnableCreate);
      }
      setFormTitle("");
      setFormContent("");
      setFormCategory("general");
      setFormPolicyType("");
      setFormError("");
      setShowForm(false);
      await loadPolicies();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : copy.errUnableCreate);
    } finally {
      setSaving(false);
    }
  }

  function startEdit(policy: Policy) {
    setEditingId(policy.id);
    setEditTitle(policy.title);
    setEditContent(policy.content);
    setEditCategory(policy.category);
    setEditPolicyType(policy.policyType ?? "");
    setEditErrors({ title: false, content: false });
    setEditError("");
  }

  async function handleUpdate(id: string) {
    const isTitleEmpty = !editTitle.trim();
    const isContentEmpty = !editContent.trim();
    if (isTitleEmpty || isContentEmpty) {
      setEditErrors({ title: isTitleEmpty, content: isContentEmpty });
      return;
    }

    setSaving(true);
    setEditErrors({ title: false, content: false });
    setEditError("");

    try {
      const response = await fetch(`/api/employee-experience/policies/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editTitle,
          content: editContent,
          category: editCategory,
          policyType: editPolicyType,
        }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.code === "POLICY_DUPLICATE" ? copy.errDuplicate : payload.error ?? copy.errUnableUpdate);
      }
      setEditingId(null);
      setEditError("");
      await loadPolicies();
    } catch (error) {
      setEditError(error instanceof Error ? error.message : copy.errUnableUpdate);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(copy.confirmDelete)) return;
    setActionError("");

    try {
      const response = await fetch(`/api/employee-experience/policies/${id}`, { method: "DELETE" });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? copy.errUnableDelete);
      }
      await loadPolicies();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : copy.errUnableDelete);
    }
  }

  const categoryLabel = (value: string) => categoryOptions.find((c) => c.value === value)?.label ?? value;
  const typeLabel = (category: string, value: string) =>
    policyTypeOptions[category]?.find((o) => o.value === value)?.label ?? value;

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-[calc(100vh-76px)] bg-[var(--background)] px-4 py-5 text-[var(--text-primary)] sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-5xl">
        {/* Hero (was PageHeader) */}
        <section className="relative overflow-hidden rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
          <div className="absolute inset-y-0 start-0 w-1 bg-[var(--brand-primary)]" />
          <div className="grid gap-6 px-6 py-7 md:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:py-8">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--brand-subtle)] px-3 py-1.5 text-[11px] font-black text-[var(--brand-primary)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--brand-primary)]" />
                  COMPANY POLICIES
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">{copy.pageTitle}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] md:text-base md:leading-8">
                {copy.pageDescription}
              </p>

              {loadState === "loaded" && (
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)]">
                    {policies.length} {isArabic ? "سياسة" : "policies"}
                  </span>
                </div>
              )}
            </div>

            {loadState === "loaded" && (
              <button type="button" onClick={() => setShowForm((v) => !v)} className={btn}>
                <Plus size={16} />
                {copy.addPolicy}
              </button>
            )}
          </div>
        </section>

        {/* Status views (were StatusViews) */}
        {loadState === "loading" && (
          <section className="mt-5 rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-small)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-subtle)]">
              <LoaderCircle size={22} className="animate-spin text-[var(--brand-primary)]" />
            </div>
            <p className="mt-4 text-base font-black">{copy.loading}</p>
          </section>
        )}

        {loadState === "forbidden" && (
          <section className="mt-5 rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-small)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--critical-background)] text-[var(--critical)]">
              <ShieldAlert size={22} />
            </div>
            <p className="mt-4 text-base font-black">{copy.forbidden}</p>
          </section>
        )}

        {loadState === "error" && (
          <section className="mt-5 rounded-[28px] border border-amber-300 bg-amber-50 p-8 text-center text-amber-950 shadow-[var(--shadow-small)] dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-lg font-black text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
              !
            </div>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-bold leading-7">{loadError}</p>
            <button
              type="button"
              onClick={loadPolicies}
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--text-primary)] px-6 text-sm font-black text-[var(--surface)] transition hover:opacity-90"
            >
              {copy.retry}
            </button>
          </section>
        )}

        {loadState === "loaded" && (
          <>
            {/* Create form (was PolicyForm) */}
            {showForm && (
              <section className="mt-5 overflow-hidden rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
                <div className="border-b border-[var(--border-default)] bg-[var(--brand-subtle)] px-6 py-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white shadow-sm">
                    <Plus size={20} />
                  </div>
                  <p className="mt-4 text-xs font-black text-[var(--brand-primary)]">NEW POLICY</p>
                  <h2 className="mt-1 text-xl font-black tracking-tight">{copy.addPolicy}</h2>
                </div>

                <div className="space-y-4 p-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className={fieldLabel}>
                      {copy.category}
                      <select
                        value={formCategory}
                        onChange={(e) => {
                          setFormCategory(e.target.value);
                          setFormPolicyType("");
                          setFormError("");
                        }}
                        className={selectCls}
                      >
                        {categoryOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    {policyTypeOptions[formCategory] && (
                      <label className={fieldLabel}>
                        {copy.policyTypeLabel}
                        <select
                          value={formPolicyType}
                          onChange={(e) => {
                            setFormPolicyType(e.target.value);
                            setFormError("");
                          }}
                          className={selectCls}
                        >
                          <option value="">{copy.noType}</option>
                          {policyTypeOptions[formCategory].map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                  </div>

                  <div>
                    <label className={fieldLabel}>
                      {copy.policyTitle}
                      <input
                        value={formTitle}
                        onChange={(e) => {
                          setFormTitle(e.target.value);
                          if (formErrors.title) setFormErrors((prev) => ({ ...prev, title: false }));
                        }}
                        placeholder={copy.policyTitlePlaceholder}
                        className={inputCls(formErrors.title)}
                      />
                    </label>
                    {formErrors.title && (
                      <p className="mt-1.5 text-xs font-bold text-[var(--critical)]">{copy.errTitleRequired}</p>
                    )}
                  </div>

                  <div>
                    <label className={fieldLabel}>
                      {copy.policyContent}
                      <textarea
                        value={formContent}
                        onChange={(e) => {
                          setFormContent(e.target.value);
                          if (formErrors.content) setFormErrors((prev) => ({ ...prev, content: false }));
                        }}
                        rows={5}
                        placeholder={copy.policyContentPlaceholder}
                        className={textareaCls(formErrors.content)}
                      />
                    </label>
                    {formErrors.content && (
                      <p className="mt-1.5 text-xs font-bold text-[var(--critical)]">{copy.errContentRequired}</p>
                    )}
                  </div>

                  {formError && (
                    <div role="alert" className={errorBox}>
                      <ShieldAlert size={14} className="mt-0.5 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 border-t border-[var(--border-default)] pt-5">
                    <button type="button" onClick={handleCreate} disabled={saving} className={btn}>
                      {saving ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}
                      {copy.save}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setFormError("");
                      }}
                      className={ghost}
                    >
                      {copy.cancel}
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* Policies list (was PoliciesList) */}
            <section className="mt-5 space-y-4">
              {actionError && (
                <div role="alert" className={errorBox}>
                  <ShieldAlert size={14} className="mt-0.5 shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}

              {policies.length === 0 && (
                <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-[24px] border border-dashed border-[var(--border-default)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-small)]">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--text-muted)]">
                    <BookOpenCheck size={22} />
                  </span>
                  <p className="text-sm font-bold text-[var(--text-secondary)]">{copy.noPolicies}</p>
                </div>
              )}

              {policies.map((policy) => {
                const isEditing = editingId === policy.id;

                return (
                  <article
                    key={policy.id}
                    className={`overflow-hidden rounded-[24px] border bg-[var(--surface)] shadow-[var(--shadow-small)] transition duration-200 hover:shadow-[var(--shadow-medium)] ${
                      isEditing
                        ? "border-[var(--brand-primary)]"
                        : "border-[var(--border-default)] hover:border-[var(--brand-primary)]"
                    }`}
                  >
                    {/* Card header */}
                    <div className="flex items-center justify-between gap-4 border-b border-[var(--border-default)] bg-[var(--surface-muted)] px-5 py-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-sm font-black text-white shadow-sm">
                          {(isEditing ? editCategory : policy.category).slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                          <span className="rounded-full bg-[var(--brand-subtle)] px-2.5 py-1 text-[11px] font-black text-[var(--brand-primary)]">
                            {categoryLabel(isEditing ? editCategory : policy.category)}
                          </span>
                          {!isEditing && policy.policyType && (
                            <span className="rounded-full border border-[var(--border-default)] bg-[var(--surface)] px-2.5 py-1 text-[11px] font-black text-[var(--text-secondary)]">
                              {typeLabel(policy.category, policy.policyType)}
                            </span>
                          )}
                        </div>
                      </div>

                      {!isEditing && (
                        <div className="flex shrink-0 gap-1.5">
                          <button type="button" onClick={() => startEdit(policy)} className={iconBtn}>
                            <Pencil size={14} />
                          </button>
                          <button type="button" onClick={() => handleDelete(policy.id)} className={iconBtnDanger}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Card body */}
                    <div className="p-5">
                      {isEditing ? (
                        <div className="space-y-4">
                          <div className="grid gap-4 sm:grid-cols-2">
                            <label className={fieldLabel}>
                              {copy.category}
                              <select
                                value={editCategory}
                                onChange={(e) => {
                                  setEditCategory(e.target.value);
                                  setEditPolicyType("");
                                  setEditError("");
                                }}
                                className={selectCls}
                              >
                                {categoryOptions.map((opt) => (
                                  <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                            </label>

                            {policyTypeOptions[editCategory] && (
                              <label className={fieldLabel}>
                                {copy.policyTypeLabel}
                                <select
                                  value={editPolicyType}
                                  onChange={(e) => {
                                    setEditPolicyType(e.target.value);
                                    setEditError("");
                                  }}
                                  className={selectCls}
                                >
                                  <option value="">{copy.noType}</option>
                                  {policyTypeOptions[editCategory].map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                      {opt.label}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            )}
                          </div>

                          <div>
                            <label className={fieldLabel}>
                              {copy.policyTitle}
                              <input
                                value={editTitle}
                                onChange={(e) => {
                                  setEditTitle(e.target.value);
                                  if (editErrors.title) setEditErrors((prev) => ({ ...prev, title: false }));
                                }}
                                className={inputCls(editErrors.title)}
                              />
                            </label>
                            {editErrors.title && (
                              <p className="mt-1.5 text-xs font-bold text-[var(--critical)]">{copy.errTitleRequired}</p>
                            )}
                          </div>

                          <div>
                            <label className={fieldLabel}>
                              {copy.policyContent}
                              <textarea
                                value={editContent}
                                onChange={(e) => {
                                  setEditContent(e.target.value);
                                  if (editErrors.content) setEditErrors((prev) => ({ ...prev, content: false }));
                                }}
                                rows={5}
                                className={textareaCls(editErrors.content)}
                              />
                            </label>
                            {editErrors.content && (
                              <p className="mt-1.5 text-xs font-bold text-[var(--critical)]">{copy.errContentRequired}</p>
                            )}
                          </div>

                          {editError && (
                            <div role="alert" className={errorBox}>
                              <ShieldAlert size={14} className="mt-0.5 shrink-0" />
                              <span>{editError}</span>
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 border-t border-[var(--border-default)] pt-5">
                            <button type="button" onClick={() => handleUpdate(policy.id)} disabled={saving} className={btn}>
                              {saving ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}
                              {copy.save}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingId(null);
                                setEditError("");
                              }}
                              className={ghost}
                            >
                              <X size={15} />
                              {copy.cancel}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className="text-lg font-black tracking-tight">{policy.title}</h3>
                          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[var(--text-secondary)]">
                            {policy.content}
                          </p>
                        </>
                      )}
                    </div>
                  </article>
                );
              })}
            </section>
          </>
        )}
      </div>
    </main>
  );
}