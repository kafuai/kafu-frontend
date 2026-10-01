"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  Building2,
  CheckCircle2,
  Loader2,
  Mail,
  ShieldAlert,
  User as UserIcon,
  UserCog,
} from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";

type Organization = {
  id: string;
  name: string;
  company_id: string;
};

// تم ترك الصلاحيات كما هي بدون أي تعديل بناءً على طلبك
const ROLE_OPTIONS = [
  { value: "owner", label: "Owner" },
  { value: "manager", label: "Manager" },
  { value: "member", label: "Member" },
  { value: "viewer", label: "Viewer" },
];

// --- قاموس الترجمة ---
const CONTENT = {
  ar: {
    title: "إضافة مستخدم لمؤسسة موجودة",
    subtitle: "ينشئ هذا النموذج مستخدمًا ويربطه بمؤسسة موجودة مسبقًا بالدور المحدد.",
    loadingOrgs: "جارِ تحميل المؤسسات...",
    errorLoadingOrgs: "تعذر تحميل قائمة المؤسسات.",
    labels: {
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      password: "كلمة المرور (٨ أحرف على الأقل)",
      organization: "المؤسسة",
      selectOrg: "اختر مؤسسة...",
      role: "الدور",
    },
    buttons: {
      submit: "إنشاء المستخدم",
    },
    messages: {
      selectOrgError: "الرجاء اختيار مؤسسة.",
      forbidden: "هذه الصفحة متاحة فقط لمسؤول المنصة.",
      genericError: "تعذر إنشاء المستخدم.",
      success: "تم إنشاء المستخدم بنجاح:",
    },
  },
  en: {
    title: "Add User to Existing Organization",
    subtitle: "This form creates a user and links them to an existing organization with the specified role.",
    loadingOrgs: "Loading organizations...",
    errorLoadingOrgs: "Unable to load organizations list.",
    labels: {
      fullName: "Full Name",
      email: "Email Address",
      password: "Password (min 8 characters)",
      organization: "Organization",
      selectOrg: "Select an organization...",
      role: "Role",
    },
    buttons: {
      submit: "Create User",
    },
    messages: {
      selectOrgError: "Please select an organization.",
      forbidden: "This page is restricted to platform administrators.",
      genericError: "Failed to create user.",
      success: "User created successfully:",
    },
  },
} as const;

export default function AdminUsersPage() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const t = isArabic ? CONTENT.ar : CONTENT.en;

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [selectedRole, setSelectedRole] = useState("member");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadOrganizations() {
      try {
        const response = await fetch("/api/admin/users");
        
        if (!response.ok) {
          throw new Error("Unable to load organizations.");
        }
        
        const payload = await response.json();
        setOrganizations(payload.data ?? []);
        setLoadState("loaded");
      } catch (error) {
        console.error(error);
        setLoadState("error");
      }
    }

    loadOrganizations();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const selectedOrg = organizations.find(
      (org) => org.id === selectedOrgId,
    );

    if (!selectedOrg) {
      setErrorMessage(t.messages.selectOrgError);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          password,
          organizationId: selectedOrg.id,
          companyId: selectedOrg.company_id,
          role: selectedRole,
        }),
      });

      const payload = await response.json();

      if (response.status === 403) {
        throw new Error(t.messages.forbidden);
      }

      if (!response.ok) {
        throw new Error(payload.error ?? t.messages.genericError);
      }

      setSuccessMessage(`${t.messages.success} ${payload.data.email}`);

      setFullName("");
      setEmail("");
      setPassword("");
      setSelectedOrgId("");
      setSelectedRole("member");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : t.messages.genericError,
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-[calc(100vh-76px)] bg-[var(--background)] px-4 py-8 sm:px-6 text-start"
    >
      <div className="mx-auto max-w-lg">
        <header className="mb-6">
          <h1 className="text-2xl font-black text-[var(--text-primary)]">
            {t.title}
          </h1>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            {t.subtitle}
          </p>
        </header>

        {loadState === "loading" && (
          <div className="flex min-h-32 items-center justify-center gap-2 text-[var(--text-muted)]">
            <Loader2 size={20} className="animate-spin" />
            {t.loadingOrgs}
          </div>
        )}

        {loadState === "error" && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {t.errorLoadingOrgs}
          </div>
        )}

        {loadState === "loaded" && (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-6"
          >
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)]">
                <UserIcon size={14} />
                {t.labels.fullName}
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="h-11 w-full rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm outline-none focus:border-[var(--brand-primary)]"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)]">
                <Mail size={14} />
                {t.labels.email}
              </label>
              <input
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`h-11 w-full rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm outline-none focus:border-[var(--brand-primary)] ${isArabic ? "text-right" : "text-left"}`}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-[var(--text-muted)]">
                {t.labels.password}
              </label>
              <input
                type="password"
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className={`h-11 w-full rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm outline-none focus:border-[var(--brand-primary)] ${isArabic ? "text-right" : "text-left"}`}
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)]">
                <Building2 size={14} />
                {t.labels.organization}
              </label>
              <select
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
                required
                className="h-11 w-full rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm outline-none focus:border-[var(--brand-primary)] cursor-pointer"
              >
                <option value="">{t.labels.selectOrg}</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)]">
                <UserCog size={14} />
                {t.labels.role}
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                required
                className="h-11 w-full rounded-lg border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm outline-none focus:border-[var(--brand-primary)] cursor-pointer"
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {errorMessage && (
              <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                <ShieldAlert size={16} className="mt-0.5 shrink-0" />
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand-primary)] text-sm font-extrabold text-white transition hover:bg-[var(--brand-hover)] disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                t.buttons.submit
              )}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}