"use client";

import { useMemo, useState } from "react";
import { CalendarDays, CircleAlert, FileText, Inbox, Loader2, Search, UserRound } from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { StatusBadge } from "@/components/attendance/shared";
import { getCopy } from "./copy";
import { RequestDetails } from "./RequestDetails";
import { dayEnd, dayStart, shortRef, typeLabel } from "./helpers";
import { useUnifiedRequests } from "./useUnifiedRequests";
import type { RequestGroup, RequestStatus, UnifiedRequest } from "./types";

const fieldCls =
  "h-11 w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm font-bold text-[var(--text-primary)] outline-none focus:border-[var(--brand-primary)]";

export default function RequestsWorkspace() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const copy = useMemo(() => getCopy(isArabic), [isArabic]);

  const { items, state, error, warning, banner, busyKey, retry, decide } = useUnifiedRequests(copy);

  const [group, setGroup] = useState<RequestGroup | "all">("all");
  const [status, setStatus] = useState<RequestStatus | "all">("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [search, setSearch] = useState("");
  const [selectedKey, setSelectedKey] = useState("");

  // Stats are computed from the real, loaded data (not from the filtered list).
  const stats = useMemo(() => ({
    total: items.length,
    pending: items.filter((r) => r.status === "pending").length,
    approved: items.filter((r) => r.status === "approved").length,
    rejected: items.filter((r) => r.status === "rejected").length,
  }), [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase(isArabic ? "ar" : "en");
    return items.filter((r) => {
      if (group !== "all" && r.group !== group) return false;
      if (status !== "all" && r.status !== status) return false;
      if (from && r.createdAt < dayStart(from)) return false;
      if (to && r.createdAt > dayEnd(to)) return false;
      if (q && !r.employeeName.toLocaleLowerCase(isArabic ? "ar" : "en").includes(q)) return false;
      return true;
    });
  }, [items, group, status, from, to, search, isArabic]);

  const selected: UnifiedRequest | null =
    filtered.find((r) => r.key === selectedKey) ?? filtered[0] ?? null;

  const fmtCreated = (n: number) =>
    new Intl.DateTimeFormat(isArabic ? "ar-SA" : "en-US", { day: "2-digit", month: "short" }).format(new Date(n));

  const hasFilters = group !== "all" || status !== "all" || from || to || search;
  const clearFilters = () => { setGroup("all"); setStatus("all"); setFrom(""); setTo(""); setSearch(""); };

  const statCards = [
    { label: copy.statTotal, value: stats.total },
    { label: copy.statPending, value: stats.pending },
    { label: copy.statApproved, value: stats.approved },
    { label: copy.statRejected, value: stats.rejected },
  ];

  return (
    <main dir={isArabic ? "rtl" : "ltr"} className="min-h-[calc(100vh-76px)] bg-[var(--background)]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="mb-6">
          <span className="text-[11px] font-bold tracking-[0.14em] text-[var(--text-muted)]">{copy.eyebrow}</span>
          <h1 className="mt-2 text-2xl font-black tracking-[-0.03em] sm:text-3xl">{copy.title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">{copy.description}</p>
        </header>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {statCards.map((c) => (
            <article key={c.label} className="rounded-[20px] border border-[var(--border-default)] bg-[var(--surface)] p-4 shadow-[var(--shadow-small)]">
              <p className="text-2xl font-black tracking-tight">{c.value}</p>
              <p className="mt-0.5 text-xs font-bold text-[var(--text-muted)]">{c.label}</p>
            </article>
          ))}
        </section>

        {banner && (
          <div
            role={banner.kind === "error" ? "alert" : "status"}
            className={`mt-4 rounded-xl border px-4 py-3 text-sm font-bold ${
              banner.kind === "ok" ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : banner.kind === "warn" ? "border-amber-300 bg-amber-50 text-amber-900"
              : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {banner.text}
          </div>
        )}
        {warning && state === "loaded" && (
          <div role="status" className="mt-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-900">{warning}</div>
        )}

        <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.38fr)]">
          <article className="min-w-0 overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
            <div className="space-y-3 border-b border-[var(--border-default)] p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black">{copy.listTitle}</h2>
                <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[var(--surface-muted)] px-2 text-xs font-black">{filtered.length}</span>
              </div>
              <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={copy.search} className={fieldCls} />
              <div className="grid grid-cols-2 gap-2">
                <select value={group} onChange={(e) => setGroup(e.target.value as RequestGroup | "all")} className={fieldCls}>
                  <option value="all">{copy.allTypes}</option>
                  <option value="leave">{copy.groups.leave}</option>
                  <option value="letter">{copy.groups.letter}</option>
                  <option value="attendance">{copy.groups.attendance}</option>
                </select>
                <select value={status} onChange={(e) => setStatus(e.target.value as RequestStatus | "all")} className={fieldCls}>
                  <option value="all">{copy.allStatuses}</option>
                  {(["pending", "approved", "rejected", "cancelled"] as const).map((s) => (
                    <option key={s} value={s}>{s === "pending" ? copy.statPending : s === "approved" ? copy.statApproved : s === "rejected" ? copy.statRejected : (isArabic ? "ملغي" : "Cancelled")}</option>
                  ))}
                </select>
                <label className="text-[11px] font-black text-[var(--text-secondary)]">{copy.from}
                  <input type="date" dir="ltr" value={from} max={to || undefined} onChange={(e) => setFrom(e.target.value)} className={`${fieldCls} mt-1`} />
                </label>
                <label className="text-[11px] font-black text-[var(--text-secondary)]">{copy.to}
                  <input type="date" dir="ltr" value={to} min={from || undefined} onChange={(e) => setTo(e.target.value)} className={`${fieldCls} mt-1`} />
                </label>
              </div>
              {hasFilters && (
                <button type="button" onClick={clearFilters} className="text-xs font-black text-[var(--brand-primary)]">{copy.clear}</button>
              )}
            </div>

            <div className="max-h-[720px] overflow-y-auto p-3">
              {state === "loading" ? (
                <div className="flex min-h-56 flex-col items-center justify-center gap-3 text-center">
                  <Loader2 size={22} className="animate-spin text-[var(--brand-primary)]" />
                  <p className="text-sm font-bold text-[var(--text-muted)]">{copy.loading}</p>
                </div>
              ) : state === "error" ? (
                <div className="flex min-h-56 flex-col items-center justify-center gap-3 px-6 text-center">
                  <CircleAlert size={22} className="text-[var(--critical)]" />
                  <p className="text-sm font-bold">{copy.errorTitle}</p>
                  <p className="text-xs text-[var(--text-muted)]">{error}</p>
                  <button type="button" onClick={retry} className="rounded-lg border border-[var(--border-default)] px-3 py-1.5 text-xs font-bold hover:bg-[var(--surface-muted)]">{copy.retry}</button>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex min-h-56 flex-col items-center justify-center text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--text-muted)]">
                    {items.length === 0 ? <Inbox size={20} /> : <Search size={20} />}
                  </span>
                  <p className="mt-4 text-sm font-bold">{items.length === 0 ? copy.empty : copy.noMatch}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filtered.map((r) => {
                    const active = selected?.key === r.key;
                    return (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => setSelectedKey(r.key)}
                        className={`block w-full rounded-2xl border p-4 text-start transition ${
                          active ? "border-blue-200 bg-[var(--brand-subtle)]" : "border-transparent hover:border-[var(--border-default)] hover:bg-[var(--background)]"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${active ? "bg-[var(--brand-primary)] text-white" : "bg-[var(--surface-muted)] text-[var(--text-secondary)]"}`}>
                            {r.group === "leave" ? <CalendarDays size={16} /> : r.group === "letter" ? <FileText size={16} /> : <UserRound size={16} />}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-black">{r.employeeName}</p>
                            <p className="mt-0.5 truncate text-[11px] text-[var(--text-muted)]">{shortRef(r)} · {fmtCreated(r.createdAt)}</p>
                            <p className="mt-2 flex flex-wrap items-center gap-2 text-xs font-bold">
                              <span className="rounded-md bg-[var(--brand-subtle)] px-2 py-1 text-[10px] font-extrabold text-[var(--brand-primary)]">{copy.groups[r.group]}</span>
                              <span className="truncate">{typeLabel(r, copy)}</span>
                            </p>
                            <div className="mt-2"><StatusBadge status={r.status} isArabic={isArabic} /></div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </article>

          {selected ? (
            <RequestDetails
              request={selected}
              copy={copy}
              isArabic={isArabic}
              busy={busyKey === selected.key}
              onDecide={(item, action, note) => void decide(item, action, note)}
            />
          ) : (
            <article className="flex min-h-[420px] items-center justify-center rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-small)]">
              <p className="text-sm font-bold text-[var(--text-secondary)]">{copy.pick}</p>
            </article>
          )}
        </section>
      </div>
    </main>
  );
}