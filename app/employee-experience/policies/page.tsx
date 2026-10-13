"use client";

import { useEffect, useState } from "react";
import { useLocalization } from "@/components/localization/LocalizationContext";

import { Policy } from "@/components/employee-experience/policies/types";
import { useAppCopy } from "@/components/employee-experience/policies/useAppCopy";
import PageHeader from "@/components/employee-experience/policies/PageHeader";
import { ErrorView, ForbiddenView, LoadingView } from "@/components/employee-experience/policies/StatusViews";
import PolicyForm from "@/components/employee-experience/policies/PolicyForm";
import PoliciesList from "@/components/employee-experience/policies/PoliciesList";

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

  return (
    <main dir={isArabic ? "rtl" : "ltr"} className="min-h-[calc(100vh-76px)] bg-[var(--background)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <PageHeader copy={copy} loadState={loadState} setShowForm={setShowForm} />

        {loadState === "loading" && <LoadingView copy={copy} />}
        {loadState === "forbidden" && <ForbiddenView copy={copy} />}
        {loadState === "error" && <ErrorView loadError={loadError} copy={copy} onRetry={loadPolicies} />}

        {loadState === "loaded" && (
          <>
            {showForm && (
              <PolicyForm
                copy={copy}
                categoryOptions={categoryOptions}
                policyTypeOptions={policyTypeOptions}
                formCategory={formCategory}
                setFormCategory={setFormCategory}
                formPolicyType={formPolicyType}
                setFormPolicyType={setFormPolicyType}
                formTitle={formTitle}
                setFormTitle={setFormTitle}
                formContent={formContent}
                setFormContent={setFormContent}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
                formError={formError}
                setFormError={setFormError}
                saving={saving}
                handleCreate={handleCreate}
                setShowForm={setShowForm}
              />
            )}

            <PoliciesList
              policies={policies}
              copy={copy}
              categoryOptions={categoryOptions}
              policyTypeOptions={policyTypeOptions}
              actionError={actionError}
              editingId={editingId}
              editCategory={editCategory}
              setEditCategory={setEditCategory}
              editPolicyType={editPolicyType}
              setEditPolicyType={setEditPolicyType}
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              editContent={editContent}
              setEditContent={setEditContent}
              editErrors={editErrors}
              setEditErrors={setEditErrors}
              editError={editError}
              setEditError={setEditError}
              saving={saving}
              startEdit={startEdit}
              setEditingId={setEditingId}
              handleUpdate={handleUpdate}
              handleDelete={handleDelete}
            />
          </>
        )}
      </div>
    </main>
  );
}