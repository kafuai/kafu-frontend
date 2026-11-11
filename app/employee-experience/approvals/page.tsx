"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, Eye, Plus, Power, Save, Trash2 } from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { api, Banner } from "@/components/attendance/shared";

type Step = { name?: string | null; approverType: string; approverUserId?: string | null; approverRole?: string | null; isRequired: boolean };
type Workflow = {
  id: string; request_type: string; name: string; version: number; status: string;
  steps: { name: string | null; approver_type: string; approver_user_id: string | null; approver_role: string | null; is_required: boolean }[];
};
type Member = { userId: string; name: string; role: string };

const TYPES = ["leave", "attendance_correction", "attendance_dispute"];
const TYPE_CODES: Record<string, string> = { leave: "LV", attendance_correction: "AC", attendance_dispute: "AD" };

const input = "mt-1.5 block h-11 w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm font-bold text-[var(--text-primary)] outline-none transition focus:border-[var(--brand-primary)] focus:bg-[var(--surface)]";
const btn = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 text-sm font-black text-white shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
const ghost = "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-3.5 text-xs font-black text-[var(--text-secondary)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] disabled:cursor-not-allowed disabled:opacity-50";
const iconBtn = "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-default)] bg-[var(--surface)] text-[var(--text-secondary)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] disabled:cursor-not-allowed disabled:opacity-50";
const send = (url: string, body: unknown, method = "POST") =>
  api(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

export default function ApprovalSettingsPage() {
  const { locale } = useLocalization();
  const ar = locale === "ar";
  const t = (a: string, e: string) => (ar ? a : e);
  const typeLabel = (k: string) =>
    ({ leave: t("الإجازات", "Leave"), attendance_correction: t("تصحيح الحضور", "Attendance corrections"), attendance_dispute: t("اعتراض / عذر", "Disputes & excuses") } as Record<string, string>)[k] ?? k;
  const approverLabel = (k: string) =>
    ({ direct_manager: t("المدير المباشر", "Direct manager"), department_manager: t("مدير القسم", "Department manager"), specific_user: t("مستخدم محدد", "Specific user"), role: t("دور", "Role"), previous_approver_manager: t("مدير قسم الموافق السابق", "Department head of previous approver"),} as Record<string, string>)[k] ?? k;

  const [wfs, setWfs] = useState<Workflow[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editSteps, setEditSteps] = useState<Step[]>([]);
  const [newType, setNewType] = useState(TYPES[0]);

  const load = useCallback(async () => {
    try {
      const r = await api("/api/approvals/workflows");
      setWfs(r.data ?? []);
      setMembers(r.members ?? []);
    } catch (e) { setMsg({ kind: "error", text: e instanceof Error ? e.message : "Error" }); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const toSteps = (w: Workflow): Step[] => w.steps.map((s) => ({ name: s.name, approverType: s.approver_type, approverUserId: s.approver_user_id, approverRole: s.approver_role, isRequired: s.is_required }));
  const startEdit = (w: Workflow) => {
    setSelectedId(w.id);
    setEditId(w.id);
    setEditName(w.name);
    setEditSteps(toSteps(w));
  };
  const selectWorkflow = (w: Workflow) => {
    setSelectedId(w.id);
    if (w.status === "active") {
      setEditId("");
      setEditName(w.name);
      setEditSteps(toSteps(w));
    } else {
      startEdit(w);
    }
  };
  const patchStep = (i: number, p: Partial<Step>) => setEditSteps((s) => s.map((x, j) => (j === i ? { ...x, ...p } : x)));
  const move = (i: number, d: number) => setEditSteps((s) => { const n = [...s]; const j = i + d; if (j < 0 || j >= n.length) return s; [n[i], n[j]] = [n[j], n[i]]; return n; });

  async function run(fn: () => Promise<unknown>, ok: string) {
    setBusy(true); setMsg(null);
    try { await fn(); setMsg({ kind: "ok", text: ok }); await load(); }
    catch (e) { setMsg({ kind: "error", text: e instanceof Error ? e.message : "Error" }); }
    finally { setBusy(false); }
  }
  const createDraft = () => run(async () => {
    const r = await send("/api/approvals/workflows", { requestType: newType, name: typeLabel(newType), steps: [{ approverType: "department_manager", isRequired: true }] });
    startEdit(r.data);
  }, t("تم إنشاء مسودة.", "Draft created."));
  const saveDraft = () => run(() => send(`/api/approvals/workflows/${editId}`, { name: editName, steps: editSteps }, "PUT"), t("تم الحفظ.", "Saved."));
  const act = (id: string, action: string) => run(async () => {
    const r = await send(`/api/approvals/workflows/${id}`, { action });
    if (action === "deactivate") startEdit(r.data);
    else if (action === "activate") { setSelectedId(id); setEditId(""); }
    else if (action === "clone") startEdit(r.data);
  }, t("تم التنفيذ.", "Done."));
  const del = (id: string) => run(async () => { await api(`/api/approvals/workflows/${id}`, { method: "DELETE" }); if (editId === id) setEditId(""); if (selectedId === id) setSelectedId(""); }, t("تم الحذف.", "Deleted."));

  const statusLabel = (s: string) => (s === "active" ? t("فعّال", "Active") : s === "draft" ? t("مسودة", "Draft") : t("معطّل", "Inactive"));
  const statusClasses = (s: string) =>
    s === "active"
      ? "bg-[var(--success-background)] text-[var(--success)]"
      : s === "draft"
        ? "bg-[var(--warning-background)] text-[var(--warning)]"
        : "bg-[var(--surface-muted)] text-[var(--text-muted)]";

  const activeCount = wfs.filter((w) => w.status === "active").length;
  const draftCount = wfs.filter((w) => w.status === "draft").length;
  const selectedWorkflow = wfs.find((w) => w.id === selectedId) ?? null;
  const isReadOnly = selectedWorkflow?.status === "active" && editId !== selectedWorkflow.id;

  return (
    <main dir={ar ? "rtl" : "ltr"} className="min-h-[calc(100vh-64px)] bg-[var(--background)] px-4 py-5 text-[var(--text-primary)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1540px]">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
          <div className="absolute inset-y-0 start-0 w-1 bg-[var(--brand-primary)]" />
          <div className="px-6 py-7 md:px-8 lg:py-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border-default)] bg-[var(--brand-subtle)] px-3 py-1.5 text-[11px] font-black text-[var(--brand-primary)]">
                <span className="h-2 w-2 rounded-full bg-[var(--brand-primary)]" />
                APPROVAL WORKFLOWS
              </span>
              <span className="rounded-full border border-[var(--border-default)] bg-[var(--surface-muted)] px-3 py-1.5 text-[11px] font-bold text-[var(--text-secondary)]">
                {t("حوكمة الموافقات", "Approval Governance")}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">{t("مسارات الموافقات", "Approval workflows")}</h1>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--text-secondary)] md:text-base md:leading-8">
              {t("حدّد من يوافق على كل نوع طلب. الطلبات المفتوحة تحتفظ بمسارها عند أي تعديل.", "Define who approves each request type. Open requests keep their frozen path when you change a workflow.")}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)]">
                {t("المسارات", "Workflows")}: {wfs.length}
              </span>
              <span className="rounded-lg bg-[var(--success-background)] px-3 py-2 text-xs font-bold text-[var(--success)]">
                {t("فعّال", "Active")}: {activeCount}
              </span>
              <span className="rounded-lg bg-[var(--warning-background)] px-3 py-2 text-xs font-bold text-[var(--warning)]">
                {t("مسودة", "Draft")}: {draftCount}
              </span>
            </div>
          </div>
        </section>

        {msg && <div className="mt-5"><Banner kind={msg.kind}>{msg.text}</Banner></div>}

        <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          {/* Left column */}
          <div className="space-y-4">
            <div className="rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] p-5 shadow-[var(--shadow-small)]">
              <p className="text-xs font-black text-[var(--brand-primary)]">{t("إنشاء", "CREATE")}</p>
              <div className="mt-3 flex flex-wrap items-end gap-3">
                <label className="min-w-[180px] flex-1 text-xs font-black text-[var(--text-secondary)]">
                  {t("نوع الطلب", "Request type")}
                  <select className={input} value={newType} onChange={(e) => setNewType(e.target.value)}>
                    {TYPES.map((k) => <option key={k} value={k}>{typeLabel(k)}</option>)}
                  </select>
                </label>
                <button type="button" className={btn} disabled={busy} onClick={() => void createDraft()}>
                  <Plus size={16} />
                  {t("مسار جديد", "New workflow")}
                </button>
              </div>
            </div>

            {wfs.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-[var(--border-default)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-small)]">
                <p className="mx-auto max-w-md text-sm font-bold leading-7 text-[var(--text-secondary)]">
                  {t("لا توجد مسارات. بدون مسار فعّال يبقى الاعتماد المباشر من الوارد البشرية كما هو.", "No workflows yet. Without an active one, direct HR approval stays as is.")}
                </p>
              </div>
            ) : (
              wfs.map((w) => {
                const selected = selectedId === w.id;
                return (
                  <article
                    key={w.id}
                    className={`overflow-hidden rounded-[24px] border bg-[var(--surface)] shadow-[var(--shadow-small)] transition duration-200 hover:border-[var(--brand-primary)] hover:shadow-[var(--shadow-medium)] ${
                      selected ? "border-[var(--brand-primary)]" : "border-[var(--border-default)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 border-b border-[var(--border-default)] bg-[var(--surface-muted)] px-5 py-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-sm font-black text-white shadow-sm">
                        {TYPE_CODES[w.request_type] ?? "WF"}
                      </div>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-black ${statusClasses(w.status)}`}>
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {statusLabel(w.status)}
                      </span>
                    </div>

                    <div className="p-5">
                      <button type="button" className="text-start text-lg font-black tracking-tight hover:text-[var(--brand-primary)]" onClick={() => selectWorkflow(w)}>{typeLabel(w.request_type)}</button>
                      <p className="mt-1.5 text-[11px] font-black text-[var(--brand-primary)]">
                        v{w.version} · {w.steps.length} {t("خطوات", "steps")}
                      </p>

                      {w.steps.length > 0 && (
                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                          {w.steps.map((s, i) => (
                            <div key={i} className="flex min-h-10 items-center rounded-xl border border-[var(--border-default)] bg-[var(--surface-muted)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)]">
                              <span className="me-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-primary)]" />
                              {approverLabel(s.approver_type)}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-5 flex flex-wrap gap-2">
                        {w.status === "active" && <button type="button" className={ghost} disabled={busy} onClick={() => selectWorkflow(w)}><Eye size={14} />{t("عرض الخطوات", "View steps")}</button>}
                        {(w.status === "draft" || w.status === "inactive") && <button type="button" className={ghost} disabled={busy} onClick={() => startEdit(w)}>{t("تعديل", "Edit")}</button>}
                        {(w.status === "draft" || w.status === "inactive") && <button type="button" className={ghost} disabled={busy} onClick={() => void act(w.id, "activate")}><Power size={14} />{t("تفعيل", "Activate")}</button>}
                        {w.status === "active" && <button type="button" className={ghost} disabled={busy} onClick={() => void act(w.id, "deactivate")}>{t("تعطيل", "Deactivate")}</button>}
                        {w.status === "draft" && <button type="button" className={iconBtn} disabled={busy} onClick={() => void del(w.id)}><Trash2 size={14} /></button>}
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {/* Editor */}
          <div className="overflow-hidden rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)] xl:self-start">
            {!selectedWorkflow ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-subtle)]">
                  <span className="h-5 w-5 rounded-full bg-[var(--brand-primary)] opacity-60" />
                </div>
                <p className="mt-4 text-base font-black">{t("اختر مساراً لعرض خطواته أو تعديله.", "Select a workflow to view its steps or edit it.")}</p>
              </div>
            ) : isReadOnly ? (
              <>
                <div className="border-b border-[var(--border-default)] bg-[var(--brand-subtle)] p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-black text-[var(--brand-primary)]">WORKFLOW DETAILS · v{selectedWorkflow.version}</p>
                      <h2 className="mt-2 text-xl font-black">{typeLabel(selectedWorkflow.request_type)}</h2>
                      <p className="mt-1 text-sm font-bold text-[var(--text-secondary)]">{selectedWorkflow.name}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1.5 text-xs font-black ${statusClasses(selectedWorkflow.status)}`}>{statusLabel(selectedWorkflow.status)}</span>
                  </div>
                  <p className="mt-4 text-xs font-bold text-[var(--text-secondary)]">{t("هذا المسار فعّال. يمكنك استعراض الخطوات، لكن يجب تعطيله قبل التعديل.", "This workflow is active. You can review its steps, but must deactivate it before editing.")}</p>
                </div>
                <div className="space-y-3 p-6">
                  {selectedWorkflow.steps.map((step, i) => (
                    <article key={i} className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--surface)] text-xs font-black text-[var(--brand-primary)]">{String(i + 1).padStart(2, "0")}</span>
                        <span className="text-xs font-black text-[var(--text-muted)]">{step.is_required ? t("إلزامية", "Required") : t("اختيارية", "Optional")}</span>
                      </div>
                      <p className="mt-3 text-sm font-black">{step.name || approverLabel(step.approver_type)}</p>
                      <p className="mt-1 text-xs font-bold text-[var(--text-secondary)]">{approverLabel(step.approver_type)}{step.approver_type === "role" && step.approver_role ? ` · ${step.approver_role}` : ""}</p>
                      {step.approver_type === "specific_user" && <p className="mt-1 break-all text-xs text-[var(--text-muted)]">{members.find((m) => m.userId === step.approver_user_id)?.name ?? step.approver_user_id}</p>}
                    </article>
                  ))}
                  <button type="button" className={ghost} disabled={busy} onClick={() => void act(selectedWorkflow.id, "deactivate")}><Power size={14} />{t("تعطيل", "Deactivate")}</button>
                </div>
              </>
            ) : (
              <>
                <div className="border-b border-[var(--border-default)] bg-[var(--brand-subtle)] p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-sm font-black text-white shadow-sm">
                    WF
                  </div>
                  <p className="mt-5 text-xs font-black text-[var(--brand-primary)]">{selectedWorkflow.status === "inactive" ? t("تعديل مسار معطّل", "EDIT INACTIVE WORKFLOW") : t("محرر مسار الموافقات", "WORKFLOW EDITOR")}</p>
                  <label className="mt-3 block text-xs font-black text-[var(--text-secondary)]">
                    {t("الاسم", "Name")}
                    <input className={input} value={editName} maxLength={120} onChange={(e) => setEditName(e.target.value)} />
                  </label>
                </div>

                <div className="space-y-3 p-6">
                  {editSteps.map((s, i) => (
                    <article key={i} className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--surface)] text-xs font-black text-[var(--brand-primary)] shadow-sm">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] font-black text-[var(--text-muted)]">
                          {t(`الخطوة ${i + 1}`, `Step ${i + 1}`)}
                        </span>
                      </div>

                      <div className="mt-3 grid gap-3 sm:grid-cols-2">
                        <select
                          className={`${input} !mt-0`}
                          value={s.approverType}
                          onChange={(e) => patchStep(i, { approverType: e.target.value, approverUserId: null, approverRole: e.target.value === "role" ? "manager" : null })}
                        >
                        {["department_manager", "specific_user", "role", ...(i > 0 ? ["previous_approver_manager"] : [])].map((k) => <option key={k} value={k}>{approverLabel(k)}</option>)}
                        </select>
                        {s.approverType === "specific_user" ? (
                          <select className={`${input} !mt-0`} value={s.approverUserId ?? ""} onChange={(e) => patchStep(i, { approverUserId: e.target.value || null })}>
                            <option value="">{t("اختر مستخدمًا", "Choose a user")}</option>
                            {members.map((m) => <option key={m.userId} value={m.userId}>{m.name}</option>)}
                          </select>
                        ) : s.approverType === "role" ? (
                          <select className={`${input} !mt-0`} value={s.approverRole ?? "manager"} onChange={(e) => patchStep(i, { approverRole: e.target.value })}>
                            <option value="manager">{t("مدير", "Manager")}</option>
                            <option value="owner">{t("الموارد البشرية", "HR")}</option>
                          </select>
                        ) : <span />}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border-default)] pt-3">
                        <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-[var(--text-secondary)]">
                          <input type="checkbox" className="h-4 w-4 accent-[var(--brand-primary)]" checked={s.isRequired} onChange={(e) => patchStep(i, { isRequired: e.target.checked })} />
                          {t("إلزامية", "Required")}
                        </label>
                        <div className="flex gap-1.5">
                          <button type="button" className={iconBtn} onClick={() => move(i, -1)}><ArrowUp size={14} /></button>
                          <button type="button" className={iconBtn} onClick={() => move(i, 1)}><ArrowDown size={14} /></button>
                          <button type="button" className={iconBtn} onClick={() => setEditSteps((x) => x.filter((_, j) => j !== i))}><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </article>
                  ))}

                  <div className="flex flex-wrap gap-2 pt-1">
                    <button type="button" className={ghost} onClick={() => setEditSteps((x) => [...x, { approverType: "role", approverRole: "manager", isRequired: true }])}>
                      <Plus size={14} />{t("خطوة", "Step")}
                    </button>
                    <button type="button" className={btn} disabled={busy || editSteps.length === 0} onClick={() => void saveDraft()}>
                      <Save size={16} />{t("حفظ", "Save")}
                    </button>
                  </div>

                  <p className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface-muted)] px-4 py-3 text-[11px] font-bold leading-6 text-[var(--text-muted)]">
                    {t("خطوة إلزامية بلا موافق مؤهل تنتقل إلى الموارد البشرية. الاختيارية تُتخطى. لا يعتمد الموظف طلبه بنفسه.", "A required step with no eligible approver falls back to HR; an optional one is skipped. Requesters never approve their own request.")}
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}