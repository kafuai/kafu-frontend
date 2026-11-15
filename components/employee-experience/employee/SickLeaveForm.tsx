// SickLeaveForm.tsx
import { useState } from "react";
import { SickFormState } from "./types";

const SICK_MAX_BYTES = 4 * 1024 * 1024;

export default function SickLeaveForm({
  isArabic,
  state,
  onCancel,
  onSuccess,
}: {
  isArabic: boolean;
  state: SickFormState;
  onCancel: () => void;
  onSuccess: (message: string) => void | Promise<void>;
}) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const t = {
    type: isArabic ? "إجازة مرضية" : "Sick leave",
    start: isArabic ? "تاريخ البداية" : "Start date",
    end: isArabic ? "تاريخ النهاية" : "End date",
    cert: isArabic ? "شهادة الإجازة المرضية" : "Sick leave certificate",
    choose: isArabic ? "اضغط أو اسحب الملف هنا" : "Click or drag file here",
    hint: isArabic ? "PDF / JPG / PNG · حتى 4 ميجابايت" : "PDF / JPG / PNG · up to 4 MB",
    submit: isArabic ? "إرسال الطلب" : "Submit request",
    sending: isArabic ? "جارِ الإرسال..." : "Submitting...",
    cancel: isArabic ? "إلغاء" : "Cancel",
    tooLarge: isArabic ? "حجم الملف كبير جدًا (الحد 4 ميجابايت)." : "The selected file is too large (max 4 MB).",
    generic: isArabic ? "تعذر إرسال الطلب." : "Unable to submit the request.",
    submitted: isArabic ? "تم إرسال الطلب" : "Request submitted",
    cancelled: isArabic ? "تم إلغاء النموذج" : "Form cancelled",
  };

  const minStart = (() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    const p = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  })();

  const canSubmit = Boolean(startDate && endDate && file) && !submitting;

  const handleFileSelect = (f: File | null) => {
    if (f && f.size > SICK_MAX_BYTES) {
      setFile(null);
      setError(t.tooLarge);
      return;
    }
    setError("");
    setFile(f);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0] ?? null;
    handleFileSelect(droppedFile);
  };

  async function submit() {
    if (!canSubmit || !file) return;
    setSubmitting(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("leaveType", "sick");
      fd.append("startDate", startDate);
      fd.append("endDate", endDate);
      fd.append("certificate", file);
      fd.append("locale", isArabic ? "ar" : "en");

      const res = await fetch("/api/employee-experience/requests/leave", {
        method: "POST",
        body: fd,
      });
      const raw = await res.text();
      let payload: { error?: string; data?: { message?: string } };
      try {
        payload = JSON.parse(raw);
      } catch {
        throw new Error(t.generic);
      }
      if (!res.ok) throw new Error(payload.error ?? t.generic);
      await onSuccess(String(payload.data?.message ?? ""));
    } catch (e) {
      setError(e instanceof Error ? e.message : t.generic);
      setSubmitting(false);
    }
  }

  if (state !== "open") {
    return (
      <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
        {state === "submitted" ? "✅ " : "✕ "}
        {state === "submitted" ? t.submitted : t.cancelled}
        {state === "submitted" && startDate && endDate && (
          <span className="ms-1 font-medium text-slate-700">
            ({startDate} → {endDate})
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-3 border-t border-slate-100 pt-3">
      <span className="inline-block rounded-md bg-[var(--brand-subtle)] px-2 py-1 text-[10px] font-semibold text-[var(--brand-primary)]">
        {t.type}
      </span>

      <div className="grid grid-cols-2 gap-2">
        <label className="block text-[11px] font-medium text-slate-600">
          {t.start}
          <input
            type="date"
            value={startDate}
            min={minStart}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs outline-none focus:border-[var(--brand-primary)] focus:bg-white"
          />
        </label>
        <label className="block text-[11px] font-medium text-slate-600">
          {t.end}
          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(e) => setEndDate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-2 text-xs outline-none focus:border-[var(--brand-primary)] focus:bg-white"
          />
        </label>
      </div>

      <div>
        <p className="mb-1 text-[11px] font-medium text-slate-600">{t.cert}</p>
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl border-2 border-dashed px-3 py-4 text-center transition ${
            isDragging
              ? "border-[var(--brand-primary)] bg-[var(--brand-subtle)]"
              : "border-slate-200 bg-slate-50 hover:border-[var(--brand-primary)] hover:bg-white"
          }`}
        >
          <span className="max-w-full truncate text-xs font-medium text-slate-700">
            {file ? `📎 ${file.name}` : t.choose}
          </span>
          <span className="text-[10px] text-slate-400">{t.hint}</span>
          <input
            type="file"
            className="hidden"
            accept="application/pdf,image/jpeg,image/png,.pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] font-medium text-red-600">
          {error}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={submit}
          disabled={!canSubmit}
          className="flex-1 rounded-xl bg-[var(--brand-primary)] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? t.sending : t.submit}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40"
        >
          {t.cancel}
        </button>
      </div>
    </div>
  );
}