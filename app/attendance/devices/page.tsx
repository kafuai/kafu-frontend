"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Fingerprint, LoaderCircle, Pencil, Power, PowerOff, Save, Unlink, X } from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";
import { api, Banner, localizeErrorMessage } from "@/components/attendance/shared";

type Device = { id: string; name: string; serial_number: string; is_active: boolean; last_seen_at: string | null };
type Member = { userId: string; name: string; employeeNumber: string | null };
type DeviceUser = {
  deviceUserId: string; badgeNumber: string | null; name: string | null;
  mappingId: string | null; mappedUserId: string | null; pendingEvents: number;
};

const panelCls = "min-w-0 overflow-hidden rounded-[24px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]";
const panelHeadCls = "flex items-center justify-between gap-3 border-b border-[var(--border-default)] bg-[var(--surface-muted)] px-5 py-4";
const codeCls = "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white shadow-sm";
const countCls = "rounded-full bg-[var(--brand-subtle)] px-2.5 py-1 text-[11px] font-black text-[var(--brand-primary)]";
const labelCls = "block text-xs font-black text-[var(--text-secondary)]";
const inputCls = "mt-1.5 block h-11 w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm font-bold text-[var(--text-primary)] outline-none transition focus:border-[var(--brand-primary)] focus:bg-[var(--surface)] disabled:opacity-50";
const primaryBtn = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-5 text-sm font-black text-white shadow-sm transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
const iconBtn = "inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-[var(--border-default)] bg-[var(--surface)] px-3 text-xs font-black text-[var(--text-secondary)] transition hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)] disabled:cursor-not-allowed disabled:opacity-50";
const thCls = "whitespace-nowrap px-5 py-3 text-start text-xs font-black";
const badge = (on: boolean) =>
  `inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-black ${
    on ? "bg-[var(--success-background)] text-[var(--success)]" : "bg-[var(--surface-muted)] text-[var(--text-muted)]"
  }`;

const JSON_HEADERS = { "Content-Type": "application/json" };

export default function AttendanceDevicesPage() {
  const { locale } = useLocalization();
  const ar = locale === "ar";

  const copy = ar ? {
    title: "أجهزة البصمة وربط الموظفين",
    intro: "اربط كل موظف برقم المستخدم المسجّل على جهاز البصمة، وتحكّم بتفعيل الأجهزة. تعطيل الجهاز يتم داخل كفو فقط ولا يوقف الجهاز ولا يحذف أي ربط.",
    devices: "الأجهزة", name: "الاسم", serial: "الرقم التسلسلي", status: "الحالة", lastSeen: "آخر اتصال",
    active: "فعّال", inactive: "معطّل", enable: "تفعيل", disable: "تعطيل", never: "لم يتصل بعد",
    noDevices: "لا توجد أجهزة مسجلة.",
    linking: "ربط الموظفين", chooseDevice: "جهاز البصمة", employee: "الموظف", deviceUser: "رقم المستخدم على الجهاز",
    chooseEmployee: "اختر الموظف", chooseUser: "اختر رقم المستخدم", linked: "مربوط", unlinked: "غير مربوط",
    save: "حفظ الربط", saving: "جارٍ الحفظ...", cancel: "إلغاء", edit: "تعديل", unlink: "فك الربط",
    editing: "تعديل ربط", newLink: "ربط جديد",
    colUser: "رقم المستخدم", colBadge: "رقم البادج", colDevName: "الاسم على الجهاز", colEmp: "الموظف", colStatus: "حالة الربط",
    pending: "بصمة معلّقة", noUsers: "لا يوجد مستخدمون على هذا الجهاز بعد. تأكد من تشغيل برنامج المزامنة.",
    saved: "تم حفظ الربط.", removed: "تم فك الربط.", toggled: "تم تحديث حالة الجهاز.",
    confirmUnlink: "فك ربط هذا المستخدم بالموظف؟ البصمات القادمة منه ستبقى معلّقة حتى تعيد الربط.",
    inactiveNote: "هذا الجهاز معطّل: لا يظهر في إسناد الورديات، لكن الربط محفوظ.",
    loading: "جارٍ التحميل...",
  } : {
    title: "Fingerprint Devices & Employee Linking",
    intro: "Link each employee to their user ID on the fingerprint device and control device activation. Disabling a device only affects KAFU: the device keeps running and no link is deleted.",
    devices: "Devices", name: "Name", serial: "Serial number", status: "Status", lastSeen: "Last seen",
    active: "Active", inactive: "Inactive", enable: "Enable", disable: "Disable", never: "Never connected",
    noDevices: "No devices registered.",
    linking: "Employee links", chooseDevice: "Fingerprint device", employee: "Employee", deviceUser: "User ID on the device",
    chooseEmployee: "Select employee", chooseUser: "Select user ID", linked: "Linked", unlinked: "Not linked",
    save: "Save link", saving: "Saving...", cancel: "Cancel", edit: "Edit", unlink: "Unlink",
    editing: "Edit link", newLink: "New link",
    colUser: "User ID", colBadge: "Badge no.", colDevName: "Name on device", colEmp: "Employee", colStatus: "Link status",
    pending: "pending punches", noUsers: "No users on this device yet. Make sure the sync program is running.",
    saved: "Link saved.", removed: "Link removed.", toggled: "Device status updated.",
    confirmUnlink: "Unlink this device user from the employee? New punches stay pending until you link again.",
    inactiveNote: "This device is disabled: it is hidden from shift assignment, but its links are kept.",
    loading: "Loading...",
  };

  const [devices, setDevices] = useState<Device[]>([]);
  const [deviceId, setDeviceId] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [deviceUsers, setDeviceUsers] = useState<DeviceUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [form, setForm] = useState({ userId: "", deviceUserId: "" });
  const [editing, setEditing] = useState<string | null>(null); // deviceUserId قيد التعديل

  const err = (e: unknown) => (e instanceof Error ? localizeErrorMessage(e.message) : localizeErrorMessage(""));

  const loadDevices = useCallback(async () => {
    try {
      const r = await api("/api/attendance/devices");
      const list = (r.data ?? []) as Device[];
      setDevices(list);
      setDeviceId((cur) => cur || list[0]?.id || "");
    } catch (e) {
      setMsg({ kind: "error", text: err(e) });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMappings = useCallback(async (id: string) => {
    if (!id) { setDeviceUsers([]); setMembers([]); return; }
    try {
      const r = await api(`/api/attendance/devices/${id}/mappings`);
      setDeviceUsers((r.deviceUsers ?? []) as DeviceUser[]);
      setMembers((r.members ?? []) as Member[]);
    } catch (e) {
      setMsg({ kind: "error", text: err(e) });
    }
  }, []);

  useEffect(() => { void loadDevices(); }, [loadDevices]);
  useEffect(() => {
    setForm({ userId: "", deviceUserId: "" });
    setEditing(null);
    setDeviceUsers([]);
    void loadMappings(deviceId);
  }, [deviceId, loadMappings]);

  const device = devices.find((d) => d.id === deviceId) ?? null;
  const memberName = useMemo(() => new Map(members.map((m) => [m.userId, m])), [members]);
  const linkedEmployees = useMemo(
    () => new Set(deviceUsers.map((u) => u.mappedUserId).filter(Boolean) as string[]),
    [deviceUsers],
  );
  const editingUserId = editing ? deviceUsers.find((u) => u.deviceUserId === editing)?.mappedUserId ?? null : null;

  const call = (method: string, body: unknown) =>
    api(`/api/attendance/devices/${deviceId}/mappings`, { method, headers: JSON_HEADERS, body: JSON.stringify(body) });

  function resetForm() { setForm({ userId: "", deviceUserId: "" }); setEditing(null); }

  async function save() {
    if (!deviceId || !form.userId || !form.deviceUserId) return;
    setBusy(true); setMsg(null);
    try {
      if (editing && editing !== form.deviceUserId) {
        const oldUser = editingUserId;
        await call("DELETE", { deviceUserId: editing });
        try {
          await call("PUT", { deviceUserId: form.deviceUserId, userId: form.userId, replace: true });
        } catch (e) {
          // نرجّع الربط القديم كي لا يضيع
          if (oldUser) await call("PUT", { deviceUserId: editing, userId: oldUser, replace: true }).catch(() => {});
          throw e;
        }
      } else {
        await call("PUT", { deviceUserId: form.deviceUserId, userId: form.userId, replace: Boolean(editing) });
      }
      setMsg({ kind: "ok", text: copy.saved });
      resetForm();
    } catch (e) {
      setMsg({ kind: "error", text: err(e) });
    } finally {
      await loadMappings(deviceId);
      setBusy(false);
    }
  }

  async function unlink(deviceUserId: string) {
    if (!window.confirm(copy.confirmUnlink)) return;
    setBusy(true); setMsg(null);
    try {
      await call("DELETE", { deviceUserId });
      setMsg({ kind: "ok", text: copy.removed });
      if (editing === deviceUserId) resetForm();
    } catch (e) {
      setMsg({ kind: "error", text: err(e) });
    } finally {
      await loadMappings(deviceId);
      setBusy(false);
    }
  }

  async function toggleDevice(d: Device) {
    setBusy(true); setMsg(null);
    try {
      await api(`/api/attendance/devices/${d.id}`, {
        method: "PATCH", headers: JSON_HEADERS, body: JSON.stringify({ isActive: !d.is_active }),
      });
      setMsg({ kind: "ok", text: copy.toggled });
      await loadDevices();
    } catch (e) {
      setMsg({ kind: "error", text: err(e) });
    } finally {
      setBusy(false);
    }
  }

  function startEdit(u: DeviceUser) {
    setEditing(u.deviceUserId);
    setForm({ userId: u.mappedUserId ?? "", deviceUserId: u.deviceUserId });
  }

  const fmtDate = (v: string | null) =>
    v ? new Date(v).toLocaleString(ar ? "ar-SA-u-nu-latn" : "en-US") : copy.never;

  const activeCount = devices.filter((d) => d.is_active).length;
  const linkedCount = deviceUsers.filter((u) => u.mappedUserId).length;

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
                ATTENDANCE DEVICES
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-default)] bg-[var(--surface-muted)] px-3 py-1.5 text-[11px] font-bold text-[var(--text-secondary)]">
                <Fingerprint size={13} />
                {ar ? "ربط البصمة بالموظفين" : "Fingerprint linking"}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">{copy.title}</h1>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-[var(--text-secondary)] md:text-base md:leading-8">{copy.intro}</p>

            {!loading && devices.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)]">
                  {copy.devices}: {devices.length}
                </span>
                <span className="rounded-lg bg-[var(--success-background)] px-3 py-2 text-xs font-bold text-[var(--success)]">
                  {copy.active}: {activeCount}
                </span>
                <span className="rounded-lg bg-[var(--surface-muted)] px-3 py-2 text-xs font-bold text-[var(--text-secondary)]">
                  {copy.linked}: {linkedCount}/{deviceUsers.length}
                </span>
              </div>
            )}
          </div>
        </section>

        {msg && <div className="mt-5"><Banner kind={msg.kind}>{msg.text}</Banner></div>}

        {loading ? (
          <section className="mt-5 rounded-[28px] border border-[var(--border-default)] bg-[var(--surface)] p-10 text-center shadow-[var(--shadow-small)]">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--brand-subtle)]">
              <LoaderCircle size={22} className="animate-spin text-[var(--brand-primary)]" />
            </div>
            <p className="mt-4 text-base font-black">{copy.loading}</p>
          </section>
        ) : (
          <div className="mt-5 space-y-5">
            {/* ------------------------- الأجهزة ------------------------- */}
            <section className={panelCls}>
              <div className={panelHeadCls}>
                <div className="flex items-center gap-3">
                  <div className={codeCls}><Fingerprint size={20} /></div>
                  <h2 className="text-base font-black tracking-tight">{copy.devices}</h2>
                </div>
                <span className={countCls}>{devices.length}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-start text-sm">
                  <thead className="bg-[var(--muted)]/50 text-[var(--text-muted)]">
                    <tr>
                      {[copy.name, copy.serial, copy.status, copy.lastSeen, ""].map((h, i) => (
                        <th key={i} className={thCls}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-default)]">
                    {devices.map((d) => (
                      <tr key={d.id} className={`transition hover:bg-[var(--surface-muted)] ${d.id === deviceId ? "bg-[var(--brand-subtle)]" : ""}`}>
                        <td className="px-5 py-4 font-black">{d.name}</td>
                        <td dir="ltr" className="px-5 py-4 text-start font-bold text-[var(--text-secondary)]">{d.serial_number}</td>
                        <td className="px-5 py-4">
                          <span className={badge(d.is_active)}>
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {d.is_active ? copy.active : copy.inactive}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-xs font-bold text-[var(--text-muted)]">{fmtDate(d.last_seen_at)}</td>
                        <td className="px-5 py-4">
                          <button type="button" className={iconBtn} disabled={busy} onClick={() => void toggleDevice(d)}>
                            {d.is_active ? <PowerOff size={14} className="text-[var(--critical)]" /> : <Power size={14} className="text-[var(--success)]" />}
                            {d.is_active ? copy.disable : copy.enable}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {devices.length === 0 && (
                  <div className="flex flex-col items-center justify-center gap-3 px-4 py-14 text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--text-muted)]">
                      <Fingerprint size={22} />
                    </span>
                    <p className="text-sm font-bold text-[var(--text-secondary)]">{copy.noDevices}</p>
                  </div>
                )}
              </div>
            </section>

            {/* --------------------------- الربط --------------------------- */}
            {devices.length > 0 && (
              <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
                <section className={panelCls}>
                  <div className={panelHeadCls}>
                    <div className="min-w-0">
                      <p className="text-[11px] font-black text-[var(--brand-primary)]">{editing ? "EDIT LINK" : "NEW LINK"}</p>
                      <h2 className="mt-0.5 truncate text-base font-black tracking-tight">
                        {editing ? `${copy.editing} (${editing})` : copy.newLink}
                      </h2>
                    </div>
                    {editing && (
                      <button type="button" className={iconBtn} onClick={resetForm}><X size={14} /> {copy.cancel}</button>
                    )}
                  </div>
                  <div className="space-y-4 p-5">
                    <label className={labelCls}>
                      {copy.chooseDevice}
                      <select className={inputCls} value={deviceId} onChange={(e) => setDeviceId(e.target.value)} disabled={busy}>
                        {devices.map((d) => (
                          <option key={d.id} value={d.id}>{d.name}{d.is_active ? "" : ` (${copy.inactive})`}</option>
                        ))}
                      </select>
                    </label>
                    {device && !device.is_active && (
                      <p className="rounded-xl border border-[var(--border-default)] bg-[var(--warning-background)] px-4 py-3 text-xs font-bold leading-6 text-[var(--warning)]">
                        {copy.inactiveNote}
                      </p>
                    )}

                    <label className={labelCls}>
                      {copy.employee}
                      <select className={inputCls} value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} disabled={busy}>
                        <option value="">{copy.chooseEmployee}</option>
                        {members.map((m) => {
                          const taken = linkedEmployees.has(m.userId) && m.userId !== editingUserId;
                          return (
                            <option key={m.userId} value={m.userId} disabled={taken}>
                              {m.name}{m.employeeNumber ? ` · ${m.employeeNumber}` : ""}{taken ? ` (${copy.linked})` : ""}
                            </option>
                          );
                        })}
                      </select>
                    </label>

                    <label className={labelCls}>
                      {copy.deviceUser}
                      <select className={inputCls} value={form.deviceUserId} onChange={(e) => setForm({ ...form, deviceUserId: e.target.value })} disabled={busy}>
                        <option value="">{copy.chooseUser}</option>
                        {deviceUsers.map((u) => {
                          const taken = Boolean(u.mappedUserId) && u.deviceUserId !== editing;
                          return (
                            <option key={u.deviceUserId} value={u.deviceUserId} disabled={taken}>
                              {u.deviceUserId}{u.badgeNumber ? ` · #${u.badgeNumber}` : ""}{u.name ? ` · ${u.name}` : ""}{taken ? ` (${copy.linked})` : ""}
                            </option>
                          );
                        })}
                      </select>
                    </label>

                    <div className="border-t border-[var(--border-default)] pt-5">
                      <button
                        type="button"
                        className={`${primaryBtn} w-full`}
                        disabled={busy || !form.userId || !form.deviceUserId}
                        onClick={() => void save()}
                      >
                        {busy ? <LoaderCircle size={16} className="animate-spin" /> : <Save size={16} />}
                        {busy ? copy.saving : copy.save}
                      </button>
                    </div>
                  </div>
                </section>

                <section className={panelCls}>
                  <div className={panelHeadCls}>
                    <div className="flex min-w-0 items-center gap-3">
                      <div className={codeCls}><Fingerprint size={20} /></div>
                      <h2 className="truncate text-base font-black tracking-tight">
                        {copy.linking}{device ? ` — ${device.name}` : ""}
                      </h2>
                    </div>
                    <span className={countCls}>{deviceUsers.length}</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-start text-sm">
                      <thead className="bg-[var(--muted)]/50 text-[var(--text-muted)]">
                        <tr>
                          {[copy.colUser, copy.colBadge, copy.colDevName, copy.colEmp, copy.colStatus, ""].map((h, i) => (
                            <th key={i} className={thCls}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--border-default)]">
                        {deviceUsers.map((u) => {
                          const emp = u.mappedUserId ? memberName.get(u.mappedUserId) : null;
                          return (
                            <tr key={u.deviceUserId} className={`transition hover:bg-[var(--surface-muted)] ${editing === u.deviceUserId ? "bg-[var(--brand-subtle)]" : ""}`}>
                              <td className="px-5 py-4 font-black">{u.deviceUserId}</td>
                              <td className="px-5 py-4 font-bold text-[var(--text-secondary)]">{u.badgeNumber ?? "—"}</td>
                              <td className="px-5 py-4 font-bold text-[var(--text-secondary)]">{u.name ?? "—"}</td>
                              <td className="px-5 py-4 font-black">{u.mappedUserId ? (emp?.name ?? u.mappedUserId) : "—"}</td>
                              <td className="px-5 py-4">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className={badge(Boolean(u.mappedUserId))}>
                                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                    {u.mappedUserId ? copy.linked : copy.unlinked}
                                  </span>
                                  {!u.mappedUserId && u.pendingEvents > 0 && (
                                    <span className="rounded-full bg-[var(--warning-background)] px-2.5 py-1 text-[11px] font-black text-[var(--warning)]">
                                      {u.pendingEvents} {copy.pending}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-5 py-4">
                                {u.mappedUserId && (
                                  <div className="flex gap-2">
                                    <button type="button" className={iconBtn} disabled={busy} onClick={() => startEdit(u)}><Pencil size={14} /> {copy.edit}</button>
                                    <button
                                      type="button"
                                      className={`${iconBtn} !border-red-200 !text-[var(--critical)] hover:!bg-[var(--critical-background)]`}
                                      disabled={busy}
                                      onClick={() => void unlink(u.deviceUserId)}
                                    >
                                      <Unlink size={14} /> {copy.unlink}
                                    </button>
                                  </div>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                    {deviceUsers.length === 0 && (
                      <div className="flex flex-col items-center justify-center gap-3 px-4 py-14 text-center">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--text-muted)]">
                          <Unlink size={20} />
                        </span>
                        <p className="max-w-md text-sm font-bold leading-7 text-[var(--text-secondary)]">{copy.noUsers}</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}