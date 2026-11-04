"use client";

import { useCallback, useEffect, useState } from "react";
import { Building2, Plus, Save, Trash2, UserRound } from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { api, Banner } from "@/components/attendance/shared";

type Person = { userId: string; name: string };
type Dept = { id: string; name: string; managers: Person[]; members: Person[] };
type Candidate = { userId: string; name: string; role: string };

const card = "overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]";
const input = "block h-11 w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm font-bold text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:bg-[var(--surface)]";
const btn = "inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 text-sm font-black text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";
const ghost = "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-5 text-sm font-black text-[var(--text-secondary)] transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-50";
const send = (url: string, body: unknown, method = "POST") =>
  api(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

export default function DepartmentsPage() {
  const { locale } = useLocalization();
  const ar = locale === "ar";
  const t = (a: string, e: string) => (ar ? a : e);

  const [depts, setDepts] = useState<Dept[]>([]);
  const [cands, setCands] = useState<Candidate[]>([]);
  const [heads, setHeads] = useState<Record<string, string[]>>({}); // departmentId -> selected head ids
  const [names, setNames] = useState<Record<string, string>>({});
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await api("/api/departments");
      const list = (r.data ?? []) as Dept[];
      setDepts(list);
      setCands(r.candidates ?? []);
      setHeads(Object.fromEntries(list.map((d) => [d.id, d.managers.map((m) => m.userId)])));
      setNames(Object.fromEntries(list.map((d) => [d.id, d.name])));
    } catch (e) { setMsg({ kind: "error", text: e instanceof Error ? e.message : "Error" }); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function run(fn: () => Promise<unknown>, ok: string) {
    setBusy(true); setMsg(null);
    try { await fn(); setMsg({ kind: "ok", text: ok }); await load(); }
    catch (e) { setMsg({ kind: "error", text: e instanceof Error ? e.message : "Error" }); }
    finally { setBusy(false); }
  }

  const create = () => run(async () => { await send("/api/departments", { name: newName }); setNewName(""); }, t("تمت إضافة القسم.", "Department added."));
  const saveDept = (d: Dept) => run(async () => {
    if (names[d.id].trim() !== d.name) await send(`/api/departments/${d.id}`, { name: names[d.id] }, "PATCH");
    await send(`/api/departments/${d.id}/managers`, { userIds: heads[d.id] ?? [] }, "PUT");
  }, t("تم الحفظ.", "Saved."));
  const remove = (d: Dept) => {
    if (!window.confirm(t("حذف القسم سيزيل ارتباط موظفيه ورؤسائه. المتابعة؟", "Deleting removes its members and heads. Continue?"))) return;
    return run(() => api(`/api/departments/${d.id}`, { method: "DELETE" }), t("تم حذف القسم.", "Department deleted."));
  };
  const toggleHead = (deptId: string, userId: string) =>
    setHeads((h) => {
      const cur = h[deptId] ?? [];
      return { ...h, [deptId]: cur.includes(userId) ? cur.filter((x) => x !== userId) : [...cur, userId] };
    });

  const stats = [
    { code: "DEP", label: t("الأقسام", "Departments"), value: depts.length, note: t("إجمالي الأقسام المسجلة", "Total registered departments") },
    {
      code: "HED",
      label: t("رؤساء الأقسام", "Department heads"),
      value: new Set(depts.flatMap((d) => d.managers.map((m) => m.userId))).size,
      note: t("أشخاص مختلفون يرأسون قسمًا", "Distinct people heading a department"),
    },
    { code: "MEM", label: t("الموظفون", "Members"), value: depts.reduce((n, d) => n + d.members.length, 0), note: t("موظفون مرتبطون بأقسام", "Employees linked to departments") },
    { code: "NOH", label: t("أقسام بلا رئيس", "Without a head"), value: depts.filter((d) => d.managers.length === 0).length, note: t("تحتاج إلى تحديد رئيس", "Need a head assigned") },
  ];

  return (
    <main dir={ar ? "rtl" : "ltr"} className="min-h-[calc(100vh-64px)] bg-[var(--background)] px-4 py-5 text-[var(--text-primary)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1540px]">
        {/* ------------------------------ Hero ------------------------------ */}
        <section className="relative overflow-hidden rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
          <div className="absolute inset-y-0 start-0 w-1 bg-[var(--brand-primary)]" />
          <div className="px-6 py-7 md:px-8 lg:py-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--brand-subtle)] px-3 py-1.5 text-[11px] font-black text-[var(--brand-primary)]">
                <span className="h-2 w-2 rounded-full bg-[var(--brand-primary)]" />
                DEPARTMENTS
              </span>
              <span className="rounded-full border border-[var(--border-default)] bg-[var(--surface-muted)] px-3 py-1.5 text-[11px] font-bold text-[var(--text-secondary)]">
                {t("الأقسام", "Departments")}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">{t("الأقسام", "Departments")}</h1>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--text-secondary)] md:text-base md:leading-8">
              {t("أنشئ الأقسام وحدد رئيس كل قسم. تعيين الموظفين للأقسام يتم من صفحة الموظفين (الرواتب).", "Create departments and choose each head. Assign employees to departments from the Employees (payroll) page.")}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {[t("أقسام المنشأة", "Organization departments"), t("رؤساء الأقسام", "Department heads"), t("ربط الموظفين", "Employee linking")].map((chip) => (
                <span key={chip} className="rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)]">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </section>

        {msg && (
          <div className="mt-4">
            <Banner kind={msg.kind}>{msg.text}</Banner>
          </div>
        )}

        {/* ------------------------------ Stats ------------------------------ */}
        <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((c) => (
            <article
              key={c.code}
              className="group relative overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)] transition duration-200 hover:-translate-y-0.5 hover:border-[var(--brand-primary)] hover:shadow-[var(--shadow-medium)]"
            >
              <div className="absolute inset-x-0 top-0 h-0.5 origin-start scale-x-0 bg-[var(--brand-primary)] transition-transform duration-200 group-hover:scale-x-100" />
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-black text-[var(--text-muted)]">{c.label}</p>
                  <h2 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">{c.value}</h2>
                </div>
                <span className="flex h-9 min-w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-muted)] px-2 text-[10px] font-black text-[var(--brand-primary)]">
                  {c.code}
                </span>
              </div>
              <div className="mt-4 border-t border-[var(--border-default)] pt-3">
                <p className="text-[11px] font-bold text-[var(--text-secondary)]">{c.note}</p>
              </div>
            </article>
          ))}
        </section>

        {/* ---------------------------- Add department ---------------------------- */}
        <section className={`${card} mt-5`}>
          <div className="flex items-center gap-2 border-b border-[var(--border-default)] bg-[var(--surface-muted)] px-5 py-4">
            <Plus size={16} className="text-[var(--brand-primary)]" />
            <h2 className="text-sm font-black">{t("إضافة قسم جديد", "Add a new department")}</h2>
          </div>
          <div className="flex flex-wrap items-end gap-3 p-5">
            <label className="min-w-[240px] flex-1 text-xs font-black text-[var(--text-secondary)]">
              {t("اسم القسم", "Department name")}
              <input className={`${input} mt-1`} maxLength={80} value={newName} onChange={(e) => setNewName(e.target.value)} />
            </label>
            <button type="button" className={btn} disabled={busy || !newName.trim()} onClick={() => void create()}>
              <Plus size={16} />{t("إضافة قسم", "Add department")}
            </button>
          </div>
        </section>

        {/* ------------------------------ Departments ------------------------------ */}
        <section className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {depts.map((d) => (
            <article key={d.id} className={card}>
              <div className="flex items-center gap-3 border-b border-[var(--border-default)] bg-[var(--surface-muted)] px-5 py-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white shadow-sm">
                  <Building2 size={20} />
                </span>
                <input className={input} maxLength={80} value={names[d.id] ?? ""} onChange={(e) => setNames((n) => ({ ...n, [d.id]: e.target.value }))} />
              </div>

              <div className="space-y-5 p-5">
                <div>
                  <p className="mb-2 text-xs font-black text-[var(--text-secondary)]">{t("رئيس القسم (يمكن أكثر من واحد)", "Department head(s)")}</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {cands.map((c) => {
                      const on = (heads[d.id] ?? []).includes(c.userId);
                      return (
                        <label
                          key={c.userId}
                          className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-bold transition ${
                            on
                              ? "border-[var(--brand-primary)] bg-[var(--brand-subtle)] text-[var(--brand-primary)]"
                              : "border-[var(--border-default)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--brand-primary)]"
                          }`}
                        >
                          <input type="checkbox" className="h-4 w-4 accent-[var(--brand-primary)]" checked={on} onChange={() => toggleHead(d.id, c.userId)} />
                          <span className="truncate">{c.name}</span>
                          <span className="ms-auto text-[10px] font-black text-[var(--text-muted)]">{c.role}</span>
                        </label>
                      );
                    })}
                    {cands.length === 0 && <p className="text-xs font-bold text-[var(--text-muted)]">{t("لا يوجد مستخدمون بدور manager أو owner.", "No users with the manager or owner role.")}</p>}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-black text-[var(--text-secondary)]">{t("الموظفون", "Members")} ({d.members.length})</p>
                  <div className="flex flex-wrap gap-2 rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-3">
                    {d.members.map((m) => (
                      <span key={m.userId} className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--surface)] px-2.5 py-1.5 text-xs font-bold">
                        <UserRound size={12} className="text-[var(--brand-primary)]" />{m.name}
                      </span>
                    ))}
                    {d.members.length === 0 && <span className="text-xs font-bold text-[var(--text-muted)]">{t("لا يوجد موظفون بعد.", "No members yet.")}</span>}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 border-t border-[var(--border-default)] bg-[var(--surface-muted)] px-5 py-4">
                <button type="button" className={btn} disabled={busy || !(names[d.id] ?? "").trim()} onClick={() => void saveDept(d)}><Save size={16} />{t("حفظ", "Save")}</button>
                <button type="button" className={ghost} disabled={busy} onClick={() => void remove(d)}><Trash2 size={14} />{t("حذف", "Delete")}</button>
              </div>
            </article>
          ))}
          {depts.length === 0 && (
            <div className="col-span-full rounded-[28px] border border-dashed border-[var(--border-default)] bg-[var(--surface)] px-4 py-14 text-center shadow-[var(--shadow-small)]">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-subtle)] text-[var(--brand-primary)]">
                <Building2 size={22} />
              </span>
              <p className="mt-4 text-sm font-bold text-[var(--text-secondary)]">{t("لا توجد أقسام بعد.", "No departments yet.")}</p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}