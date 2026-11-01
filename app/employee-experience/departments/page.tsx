"use client";

import { useCallback, useEffect, useState } from "react";
import { Building2, Plus, Save, Trash2, UserRound } from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { api, Banner } from "@/components/attendance/shared";

type Person = { userId: string; name: string };
type Dept = { id: string; name: string; managers: Person[]; members: Person[] };
type Candidate = { userId: string; name: string; role: string };

const card = "rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]";
const input = "block h-10 w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm font-bold outline-none focus:border-[var(--brand-primary)]";
const btn = "inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-4 text-sm font-black text-white disabled:opacity-50";
const ghost = "inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-4 text-sm font-black text-[var(--text-secondary)] disabled:opacity-50";
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

  return (
    <main dir={ar ? "rtl" : "ltr"} className="min-h-[calc(100vh-64px)] bg-[var(--background)] px-4 py-5 text-[var(--text-primary)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px] space-y-5">
        <header className={`${card} px-6 py-6`}>
          <h1 className="text-2xl font-black">{t("الأقسام", "Departments")}</h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {t("أنشئ الأقسام وحدد رئيس كل قسم. تعيين الموظفين للأقسام يتم من صفحة الموظفين (الرواتب).", "Create departments and choose each head. Assign employees to departments from the Employees (payroll) page.")}
          </p>
        </header>

        {msg && <Banner kind={msg.kind}>{msg.text}</Banner>}

        <section className={`${card} flex flex-wrap items-end gap-3 p-5`}>
          <label className="min-w-[240px] flex-1 text-xs font-black text-[var(--text-secondary)]">
            {t("اسم القسم", "Department name")}
            <input className={`${input} mt-1`} maxLength={80} value={newName} onChange={(e) => setNewName(e.target.value)} />
          </label>
          <button type="button" className={btn} disabled={busy || !newName.trim()} onClick={() => void create()}>
            <Plus size={16} />{t("إضافة قسم", "Add department")}
          </button>
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {depts.map((d) => (
            <article key={d.id} className={`${card} space-y-4 p-5`}>
              <div className="flex items-center gap-2">
                <Building2 size={18} className="text-[var(--brand-primary)]" />
                <input className={input} maxLength={80} value={names[d.id] ?? ""} onChange={(e) => setNames((n) => ({ ...n, [d.id]: e.target.value }))} />
              </div>

              <div>
                <p className="mb-2 text-xs font-black text-[var(--text-secondary)]">{t("رئيس القسم (يمكن أكثر من واحد)", "Department head(s)")}</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {cands.map((c) => (
                    <label key={c.userId} className="flex cursor-pointer items-center gap-2 rounded-xl border border-[var(--border-default)] px-3 py-2 text-sm font-bold">
                      <input type="checkbox" checked={(heads[d.id] ?? []).includes(c.userId)} onChange={() => toggleHead(d.id, c.userId)} />
                      <span className="truncate">{c.name}</span>
                      <span className="text-[10px] text-[var(--text-muted)]">{c.role}</span>
                    </label>
                  ))}
                  {cands.length === 0 && <p className="text-xs text-[var(--text-muted)]">{t("لا يوجد مستخدمون بدور manager أو owner.", "No users with the manager or owner role.")}</p>}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-black text-[var(--text-secondary)]">{t("الموظفون", "Members")} ({d.members.length})</p>
                <div className="flex flex-wrap gap-2">
                  {d.members.map((m) => (
                    <span key={m.userId} className="inline-flex items-center gap-1 rounded-lg bg-[var(--surface-muted)] px-2.5 py-1 text-xs font-bold">
                      <UserRound size={12} />{m.name}
                    </span>
                  ))}
                  {d.members.length === 0 && <span className="text-xs text-[var(--text-muted)]">{t("لا يوجد موظفون بعد.", "No members yet.")}</span>}
                </div>
              </div>

              <div className="flex gap-2">
                <button type="button" className={btn} disabled={busy || !(names[d.id] ?? "").trim()} onClick={() => void saveDept(d)}><Save size={16} />{t("حفظ", "Save")}</button>
                <button type="button" className={ghost} disabled={busy} onClick={() => void remove(d)}><Trash2 size={14} />{t("حذف", "Delete")}</button>
              </div>
            </article>
          ))}
          {depts.length === 0 && <p className="col-span-full py-10 text-center text-sm font-bold text-[var(--text-secondary)]">{t("لا توجد أقسام بعد.", "No departments yet.")}</p>}
        </section>
      </div>
    </main>
  );
}