"use client";

import { useEffect, useState } from "react";
import {
  BookOpenCheck,
  Loader2,
  Pencil,
  Plus,
  Save,
  ShieldAlert,
  Trash2,
  X,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

type Policy = {
  id: string;
  category: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export default function PoliciesPage() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";

  const CATEGORY_OPTIONS = [
    { value: "leave", label: isArabic ? "الإجازات" : "Leave" },
    {
      value: "employment_letter",
      label: isArabic ? "خطابات التعريف" : "Employment Letters",
    },
    {
      value: "data_update",
      label: isArabic ? "تحديث البيانات" : "Data Update",
    },
    { value: "general", label: isArabic ? "عام" : "General" },
  ];

  const copy = {
    pageTitle: isArabic ? "سياسات الشركة" : "Company Policies",
    pageDescription: isArabic
      ? "هذه السياسات يستخدمها الذكاء الاصطناعي للرد على استفسارات الموظفين."
      : "These policies are used by the AI to answer employee inquiries.",
    addPolicy: isArabic ? "إضافة سياسة" : "Add Policy",
    loading: isArabic ? "جارِ التحميل..." : "Loading...",
    forbidden: isArabic
      ? "هذه الصفحة متاحة فقط لفريق الموارد البشرية."
      : "This page is available to HR only.",
    retry: isArabic ? "إعادة المحاولة" : "Retry",
    category: isArabic ? "الفئة" : "Category",
    policyTitle: isArabic ? "عنوان السياسة" : "Policy Title",
    policyTitlePlaceholder: isArabic
      ? "مثال: سياسة الإجازة السنوية"
      : "e.g. Annual Leave Policy",
    policyContent: isArabic ? "نص السياسة" : "Policy Content",
    policyContentPlaceholder: isArabic
      ? "اكتب نص السياسة كاملاً هنا..."
      : "Write the full policy text here...",
    save: isArabic ? "حفظ" : "Save",
    cancel: isArabic ? "إلغاء" : "Cancel",
    noPolicies: isArabic
      ? "لا توجد سياسات مضافة بعد."
      : "No policies added yet.",
    confirmDelete: isArabic
      ? "هل أنت متأكد من حذف هذه السياسة؟"
      : "Are you sure you want to delete this policy?",
    errUnableLoad: isArabic
      ? "تعذر تحميل السياسات."
      : "Unable to load policies.",
    errUnableCreate: isArabic
      ? "تعذر إنشاء السياسة."
      : "Unable to create policy.",
    errUnableUpdate: isArabic
      ? "تعذر تحديث السياسة."
      : "Unable to update policy.",
    errUnableDelete: isArabic
      ? "تعذر حذف السياسة."
      : "Unable to delete policy.",
  };

  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loadState, setLoadState] = useState
    <"loading" | "loaded" | "error" | "forbidden">
  ("loading");
  const [loadError, setLoadError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formCategory, setFormCategory] = useState("general");
  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState("general");

  async function loadPolicies() {
    setLoadState("loading");

    try {
      const response = await fetch(
        "/api/employee-experience/policies",
        { method: "GET" },
      );

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
      setLoadError(
        error instanceof Error ? error.message : copy.errUnableLoad,
      );
      setLoadState("error");
    }
  }

  useEffect(() => {
    loadPolicies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleCreate() {
    if (!formTitle.trim() || !formContent.trim()) return;

    setSaving(true);

    try {
      const response = await fetch(
        "/api/employee-experience/policies",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formTitle,
            content: formContent,
            category: formCategory,
          }),
        },
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? copy.errUnableCreate);
      }

      setFormTitle("");
      setFormContent("");
      setFormCategory("general");
      setShowForm(false);
      await loadPolicies();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : copy.errUnableCreate,
      );
    } finally {
      setSaving(false);
    }
  }

  function startEdit(policy: Policy) {
    setEditingId(policy.id);
    setEditTitle(policy.title);
    setEditContent(policy.content);
    setEditCategory(policy.category);
  }

  async function handleUpdate(id: string) {
    setSaving(true);

    try {
      const response = await fetch(
        `/api/employee-experience/policies/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: editTitle,
            content: editContent,
            category: editCategory,
          }),
        },
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? copy.errUnableUpdate);
      }

      setEditingId(null);
      await loadPolicies();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : copy.errUnableUpdate,
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(copy.confirmDelete)) return;

    try {
      const response = await fetch(
        `/api/employee-experience/policies/${id}`,
        { method: "DELETE" },
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? copy.errUnableDelete);
      }

      await loadPolicies();
    } catch (error) {
      alert(
        error instanceof Error ? error.message : copy.errUnableDelete,
      );
    }
  }

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-[calc(100vh-76px)] bg-[var(--background)] px-4 py-6 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[var(--text-primary)]">
              {copy.pageTitle}
            </h1>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {copy.pageDescription}
            </p>
          </div>

          {loadState === "loaded" && (
            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-[var(--brand-hover)]"
            >
              <Plus size={16} />
              {copy.addPolicy}
            </button>
          )}
        </header>

        {loadState === "loading" && (
          <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-[var(--text-muted)]">
            <Loader2 size={22} className="animate-spin" />
            {copy.loading}
          </div>
        )}

        {loadState === "forbidden" && (
          <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-8 text-center">
            <ShieldAlert size={24} className="text-[var(--critical)]" />
            <p className="font-bold text-[var(--text-primary)]">
              {copy.forbidden}
            </p>
          </div>
        )}

        {loadState === "error" && (
          <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-[var(--critical)]">
            {loadError}
            <button
              type="button"
              onClick={loadPolicies}
              className="rounded-lg border border-[var(--border-default)] px-3 py-1.5 text-xs font-bold"
            >
              {copy.retry}
            </button>
          </div>
        )}

        {loadState === "loaded" && (
          <>
            {showForm && (
              <div className="mb-5 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-5">
                <div className="mb-3">
                  <label className="mb-1 block text-xs font-bold text-[var(--text-muted)]">
                    {copy.category}
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 py-2 text-sm"
                  >
                    {CATEGORY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="mb-1 block text-xs font-bold text-[var(--text-muted)]">
                    {copy.policyTitle}
                  </label>
                  <input
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder={copy.policyTitlePlaceholder}
                    className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 py-2 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label className="mb-1 block text-xs font-bold text-[var(--text-muted)]">
                    {copy.policyContent}
                  </label>
                  <textarea
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    rows={5}
                    placeholder={copy.policyContentPlaceholder}
                    className="w-full resize-none rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 py-2 text-sm"
                  />
                </div>

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
                    onClick={() => setShowForm(false)}
                    className="rounded-lg border border-[var(--border-default)] px-4 py-2 text-sm font-bold"
                  >
                    {copy.cancel}
                  </button>
                </div>
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
                <div
                  key={policy.id}
                  className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-4"
                >
                  {editingId === policy.id ? (
                    <div>
                      <select
                        value={editCategory}
                        onChange={(e) =>
                          setEditCategory(e.target.value)
                        }
                        className="mb-2 w-full rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 py-2 text-sm"
                      >
                        {CATEGORY_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>

                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="mb-2 w-full rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 py-2 text-sm"
                      />

                      <textarea
                        value={editContent}
                        onChange={(e) =>
                          setEditContent(e.target.value)
                        }
                        rows={4}
                        className="mb-2 w-full resize-none rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 py-2 text-sm"
                      />

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
                          onClick={() => setEditingId(null)}
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
                            {CATEGORY_OPTIONS.find(
                              (c) => c.value === policy.category,
                            )?.label ?? policy.category}
                          </span>
                          <h3 className="mt-1.5 text-sm font-black text-[var(--text-primary)]">
                            {policy.title}
                          </h3>
                        </div>

                        <div className="flex shrink-0 gap-1.5">
                          <button
                            type="button"
                            onClick={() => startEdit(policy)}
                            className="rounded-lg border border-[var(--border-default)] p-2 hover:bg-[var(--surface-muted)]"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(policy.id)}
                            className="rounded-lg border border-red-200 p-2 text-[var(--critical)] hover:bg-[var(--critical-background)]"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                        {policy.content}
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}