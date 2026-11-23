"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Loader2,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

type OrgUser = {
  user_id: string;
  full_name: string | null;
  email: string | null;
  role: string;
  joined_at: string;
};

type Organization = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  company_id: string | null;
  is_active: boolean;
  user_count: number;
  users?: OrgUser[];
};

type StatusFilter = "all" | "active" | "suspended";

const COPY = {
  ar: {
    title: "إدارة المؤسسات",
    subtitle: "عرض المؤسسات ومستخدميها والتحكم بحالة الوصول إلى المنصة.",
    search: "ابحث باسم المؤسسة...",
    all: "الكل",
    active: "نشطة",
    suspended: "معلقة",
    name: "المؤسسة",
    created: "تاريخ الإنشاء",
    users: "المستخدمون",
    status: "الحالة",
    actions: "الإجراء",
    view: "التفاصيل",
    noRows: "لا توجد مؤسسات مطابقة.",
    loadError: "تعذر تحميل المؤسسات.",
    details: "تفاصيل المؤسسة",
    email: "البريد الإلكتروني",
    role: "الدور",
    joined: "تاريخ الانضمام",
    close: "إغلاق",
    suspend: "تعطيل المؤسسة",
    activate: "إعادة التفعيل",
    confirmSuspend: "هل أنت متأكد من تعطيل هذه المؤسسة؟ سيتم منع جميع مستخدميها من الوصول إلى المنصة.",
    confirmActivate: "هل تريد إعادة تفعيل هذه المؤسسة والسماح لمستخدميها بالدخول؟",
    cancel: "إلغاء",
    confirm: "تأكيد",
    successSuspend: "تم تعطيل المؤسسة.",
    successActivate: "تمت إعادة تفعيل المؤسسة.",
    error: "تعذر تنفيذ العملية.",
    back: "العودة للوحة الإدارة",
    loading: "جارٍ التحميل...",
    activeLabel: "نشطة",
    suspendedLabel: "معلقة",
    noUsers: "لا يوجد مستخدمون مرتبطون بهذه المؤسسة.",
  },

  en: {
    title: "Organization Management",
    subtitle: "View organizations and their users, and control platform access.",
    search: "Search organizations...",
    all: "All",
    active: "Active",
    suspended: "Suspended",
    name: "Organization",
    created: "Created",
    users: "Users",
    status: "Status",
    actions: "Action",
    view: "Details",
    noRows: "No matching organizations.",
    loadError: "Unable to load organizations.",
    details: "Organization details",
    email: "Email",
    role: "Role",
    joined: "Joined",
    close: "Close",
    suspend: "Suspend organization",
    activate: "Reactivate organization",
    confirmSuspend: "Are you sure you want to suspend this organization? All its users will lose platform access.",
    confirmActivate: "Reactivate this organization and restore access for its users?",
    cancel: "Cancel",
    confirm: "Confirm",
    successSuspend: "Organization suspended.",
    successActivate: "Organization reactivated.",
    error: "The operation failed.",
    back: "Back to admin dashboard",
    loading: "Loading...",
    activeLabel: "Active",
    suspendedLabel: "Suspended",
    noUsers: "No users are linked to this organization.",
  },
} as const;

const ghostBtn =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-4 text-sm font-black text-[var(--text-secondary)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] disabled:cursor-not-allowed disabled:opacity-50";
const smallBtn =
  "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--surface)] px-3 text-xs font-black text-[var(--text-secondary)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] disabled:cursor-not-allowed disabled:opacity-50";
const primaryBtn =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 text-sm font-black text-white shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
const thCls = "whitespace-nowrap px-5 py-3 text-start text-xs font-black";

const statusBadge = (active: boolean) =>
  `inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-black ${
    active
      ? "bg-[var(--success-background)] text-[var(--success)]"
      : "bg-[var(--warning-background)] text-[var(--warning)]"
  }`;

export default function ManageOrganizationsPage() {
  const { locale } = useLocalization();

  const ar = locale === "ar";
  const t = ar ? COPY.ar : COPY.en;

  const [organizations, setOrganizations] =
    useState<Organization[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [filter, setFilter] =
    useState<StatusFilter>("all");

  const [selected, setSelected] =
    useState<Organization | null>(null);

  const [confirming, setConfirming] =
    useState(false);

  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/admin/organizations/manage",
        { cache: "no-store" },
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error || t.loadError,
        );
      }

      setOrganizations(payload.data ?? []);
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : t.loadError,
      );
    } finally {
      setLoading(false);
    }
  }, [t.loadError]);

  useEffect(() => {
    void load();
  }, [load]);

  const filtered = useMemo(
    () =>
      organizations.filter(
        (org) =>
          org.name
            .toLocaleLowerCase()
            .includes(
              search.trim().toLocaleLowerCase(),
            ) &&
          (
            filter === "all" ||
            (
              filter === "active"
                ? org.is_active
                : !org.is_active
            )
          ),
      ),
    [organizations, search, filter],
  );

  async function openDetails(org: Organization) {
    setSelected(org);
    setNotice("");

    try {
      const response = await fetch(
        `/api/admin/organizations/manage/${org.id}`,
        { cache: "no-store" },
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error || t.error,
        );
      }

      setSelected(payload.data);
    } catch (e) {
      setNotice(
        e instanceof Error
          ? e.message
          : t.error,
      );
    }
  }

  async function changeStatus() {
    if (!selected) return;

    setBusy(true);
    setNotice("");

    try {
      const next = !selected.is_active;

      const response = await fetch(
        `/api/admin/organizations/manage/${selected.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_active: next,
          }),
        },
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error || t.error,
        );
      }

      setOrganizations((current) =>
        current.map((org) =>
          org.id === selected.id
            ? { ...org, is_active: next }
            : org,
        ),
      );

      setSelected((current) =>
        current
          ? { ...current, is_active: next }
          : current,
      );

      setConfirming(false);

      setNotice(
        next
          ? t.successActivate
          : t.successSuspend,
      );
    } catch (e) {
      setNotice(
        e instanceof Error
          ? e.message
          : t.error,
      );
    } finally {
      setBusy(false);
    }
  }

  const date = (value: string) =>
    new Intl.DateTimeFormat(
      ar ? "ar-SA" : "en-US",
      { dateStyle: "medium" },
    ).format(new Date(value));

  const activeCount = organizations.filter((o) => o.is_active).length;
  const suspendedCount = organizations.length - activeCount;

  const filters: { key: StatusFilter; label: string }[] = [
    { key: "all", label: t.all },
    { key: "active", label: t.active },
    { key: "suspended", label: t.suspended },
  ];

  return (
    <main
      dir={ar ? "rtl" : "ltr"}
      className="min-h-[calc(100vh-76px)] bg-[var(--background)] px-4 py-5 text-start text-[var(--text-primary)] sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-[1540px]">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
          <div className="absolute inset-y-0 start-0 w-1 bg-[var(--brand-primary)]" />
          <div className="grid gap-6 px-6 py-7 md:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:py-8">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--brand-subtle)] px-3 py-1.5 text-[11px] font-black text-[var(--brand-primary)]">
                  <span className="h-2 w-2 rounded-full bg-[var(--brand-primary)]" />
                  PLATFORM ADMIN
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
                {t.title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-secondary)] md:text-base md:leading-8">
                {t.subtitle}
              </p>

              {!loading && organizations.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)]">
                    {t.all}: {organizations.length}
                  </span>
                  <span className="rounded-lg bg-[var(--success-background)] px-3 py-2 text-xs font-bold text-[var(--success)]">
                    {t.active}: {activeCount}
                  </span>
                  <span className="rounded-lg bg-[var(--warning-background)] px-3 py-2 text-xs font-bold text-[var(--warning)]">
                    {t.suspended}: {suspendedCount}
                  </span>
                </div>
              )}
            </div>

            <Link href="/admin" className={ghostBtn}>
              {ar
                ? <ArrowRight size={16} />
                : <ArrowLeft size={16} />
              }
              {t.back}
            </Link>
          </div>
        </section>

        {/* Table card */}
        <section className="mt-5 overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
          <div className="border-b border-[var(--border-default)] bg-[var(--surface-muted)] p-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white shadow-sm">
                  <Building2 size={20} />
                </div>
                <h2 className="text-base font-black tracking-tight">{t.name}</h2>
              </div>
              <span className="rounded-full bg-[var(--brand-subtle)] px-2.5 py-1 text-[11px] font-black text-[var(--brand-primary)]">
                {filtered.length}
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative min-w-0 flex-1">
                <Search
                  className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)] ${
                    ar ? "right-3" : "left-3"
                  }`}
                />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder={t.search}
                  className={`h-11 w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] text-sm font-bold text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:bg-[var(--surface)] ${
                    ar
                      ? "pr-10 pl-3"
                      : "pl-10 pr-3"
                  }`}
                />
              </div>

              <div className="flex gap-2 overflow-x-auto">
                {filters.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => setFilter(f.key)}
                    className={`shrink-0 rounded-lg px-3 py-2.5 text-xs font-extrabold transition ${
                      filter === f.key
                        ? "border-2 border-[var(--text-primary)] bg-[var(--surface)] text-[var(--text-primary)]"
                        : "border-2 border-transparent bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {error && (
            <p
              role="alert"
              className="m-5 rounded-xl border border-red-200 bg-[var(--critical-background)] px-4 py-3 text-sm font-bold text-[var(--critical)]"
            >
              {error}
            </p>
          )}

          {notice && !selected && (
            <p
              role="status"
              className="m-5 rounded-xl border border-[var(--border-default)] bg-[var(--success-background)] px-4 py-3 text-sm font-bold text-[var(--success)]"
            >
              {notice}
            </p>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-[var(--muted)]/50 text-[var(--text-muted)]">
                <tr>
                  <th className={thCls}>{t.name}</th>
                  <th className={thCls}>{t.created}</th>
                  <th className={thCls}>{t.users}</th>
                  <th className={thCls}>{t.status}</th>
                  <th className={thCls}>{t.actions}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[var(--border-default)]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-14 text-center text-[var(--brand-primary)]">
                      <Loader2 className="mx-auto animate-spin" />
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-14 text-center">
                      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--text-muted)]">
                        <Building2 size={20} />
                      </span>
                      <p className="mt-3 text-sm font-bold text-[var(--text-secondary)]">
                        {t.noRows}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filtered.map((org) => (
                    <tr
                      key={org.id}
                      className="transition hover:bg-[var(--surface-muted)]"
                    >
                      <td className="px-5 py-4 font-black text-[var(--text-primary)]">
                        <span className="inline-flex items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                            <Building2 size={16} />
                          </span>
                          {org.name}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-bold text-[var(--text-muted)]">
                        {date(org.created_at)}
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-black text-[var(--text-secondary)]">
                          <Users size={14} />
                          {org.user_count}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className={statusBadge(org.is_active)}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {org.is_active
                            ? t.activeLabel
                            : t.suspendedLabel}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() =>
                            void openDetails(org)
                          }
                          className={smallBtn}
                        >
                          {t.view}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Details modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-[2px] sm:p-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-[var(--border-default)] bg-[var(--brand-subtle)] p-6">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white shadow-sm">
                  <Building2 size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-[var(--brand-primary)]">ORGANIZATION</p>
                  <h2 className="mt-1 truncate text-xl font-black tracking-tight">
                    {selected.name}
                  </h2>
                  <p className="mt-1 text-xs font-bold text-[var(--text-muted)]" dir="ltr">
                    {selected.slug} · {date(selected.created_at)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelected(null);
                  setConfirming(false);
                }}
                aria-label={t.close}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface)] text-[var(--text-secondary)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--border-default)] bg-[var(--background)] p-4">
                <span className="inline-flex items-center gap-2 text-sm font-black">
                  <span className="text-[var(--brand-primary)]">
                    <ShieldCheck size={17} />
                  </span>
                  <span className={statusBadge(selected.is_active)}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {selected.is_active
                      ? t.activeLabel
                      : t.suspendedLabel}
                  </span>
                </span>

                <button
                  onClick={() => setConfirming(true)}
                  className={
                    selected.is_active
                      ? "inline-flex min-h-11 items-center justify-center rounded-xl border border-red-200 bg-[var(--surface)] px-4 text-sm font-black text-[var(--critical)] transition hover:bg-[var(--critical-background)]"
                      : primaryBtn
                  }
                >
                  {selected.is_active
                    ? t.suspend
                    : t.activate}
                </button>
              </div>

              {notice && (
                <p className="rounded-xl border border-[var(--border-default)] bg-[var(--success-background)] px-4 py-3 text-sm font-bold text-[var(--success)]">
                  {notice}
                </p>
              )}

              <div>
                <h3 className="flex items-center gap-2 text-sm font-black">
                  <span className="text-[var(--brand-primary)]">
                    <Users size={17} />
                  </span>
                  {t.details}
                  <span className="rounded-full bg-[var(--brand-subtle)] px-2.5 py-0.5 text-[11px] font-black text-[var(--brand-primary)]">
                    {selected.users?.length ?? 0}
                  </span>
                </h3>

                <div className="mt-3 overflow-hidden rounded-2xl border border-[var(--border-default)]">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px] text-sm">
                      <thead className="bg-[var(--muted)]/50 text-[var(--text-muted)]">
                        <tr>
                          <th className={thCls}>{t.name}</th>
                          <th className={thCls}>{t.email}</th>
                          <th className={thCls}>{t.role}</th>
                          <th className={thCls}>{t.joined}</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-[var(--border-default)]">
                        {selected.users?.length ? (
                          selected.users.map((user) => (
                            <tr
                              key={user.user_id}
                              className="transition hover:bg-[var(--surface-muted)]"
                            >
                              <td className="px-5 py-3.5 font-black">
                                {user.full_name || "—"}
                              </td>

                              <td className="px-5 py-3.5 font-bold text-[var(--text-secondary)]" dir="ltr">
                                {user.email || "—"}
                              </td>

                              <td className="px-5 py-3.5">
                                <span className="rounded-md bg-[var(--brand-subtle)] px-2 py-1 text-[11px] font-black text-[var(--brand-primary)]">
                                  {user.role}
                                </span>
                              </td>

                              <td className="px-5 py-3.5 font-bold text-[var(--text-muted)]">
                                {date(user.joined_at)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={4}
                              className="py-10 text-center text-sm font-bold text-[var(--text-secondary)]"
                            >
                              {t.noUsers}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Confirm modal */}
      {confirming && selected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 backdrop-blur-[2px]">
          <section
            role="alertdialog"
            aria-modal="true"
            className="w-full max-w-md overflow-hidden rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] shadow-2xl"
          >
            <div className="p-6">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
                  selected.is_active
                    ? "bg-[var(--critical-background)] text-[var(--critical)]"
                    : "bg-[var(--success-background)] text-[var(--success)]"
                }`}
              >
                <ShieldCheck size={22} />
              </div>

              <h3 className="mt-4 text-lg font-black tracking-tight">
                {selected.is_active
                  ? t.suspend
                  : t.activate}
              </h3>

              <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                {selected.is_active
                  ? t.confirmSuspend
                  : t.confirmActivate}
              </p>
            </div>

            <div className="flex justify-end gap-2 border-t border-[var(--border-default)] bg-[var(--surface-muted)] px-6 py-4">
              <button
                disabled={busy}
                onClick={() => setConfirming(false)}
                className={ghostBtn}
              >
                {t.cancel}
              </button>

              <button
                disabled={busy}
                onClick={() => void changeStatus()}
                className={primaryBtn}
              >
                {busy && (
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                )}
                {t.confirm}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}