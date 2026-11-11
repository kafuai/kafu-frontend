"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Check, FileText, UserRound, X } from "lucide-react";
import { fmtTime, StatusBadge } from "@/components/attendance/shared";
import type { Copy } from "./copy";
import { shortRef, typeLabel } from "./helpers";
import {
  CORRECTION_TIME_TYPES,
  type CorrectionItem,
  type LeaveItem,
  type TimePair,
  type UnifiedRequest,
} from "./types";

const box = "rounded-2xl border border-[var(--border-default)] bg-[var(--background)] p-4";

function Stat({ label, value, critical }: { label: string; value: number; critical?: boolean }) {
  return (
    <div className="rounded-xl border border-[var(--border-default)] bg-[var(--surface)] px-2 py-2.5 text-center">
      <p className={`text-base font-black ${critical ? "text-[var(--critical)]" : "text-[var(--text-primary)]"}`}>{value}</p>
      <p className="mt-0.5 text-[10px] font-bold text-[var(--text-muted)]">{label}</p>
    </div>
  );
}

function LeaveBody({ r, copy, fmtDate }: { r: LeaveItem; copy: Copy; fmtDate: (n: number) => string }) {
  return (
    <>
      {r.leaveType && (
        <div className={box}>
          <p className="text-[11px] font-bold text-[var(--text-muted)]">{copy.leaveType}</p>
          <p className="font-bold">{copy.leaveTypes[r.leaveType] ?? r.leaveType}</p>
        </div>
      )}
      {r.startDate && r.endDate && (
        <div className={`${box} flex items-start gap-3`}>
          <CalendarDays size={17} className="mt-0.5 text-[var(--brand-primary)]" />
          <div>
            <p className="text-[11px] font-bold text-[var(--text-muted)]">{copy.period}</p>
            <p className="mt-0.5 text-sm font-extrabold">{fmtDate(r.startDate)} — {fmtDate(r.endDate)}</p>
          </div>
        </div>
      )}
      {r.status === "pending" && r.leaveBalance && (
        <div className={box}>
          <p className="text-[11px] font-bold text-[var(--text-muted)]">{copy.balance}</p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
            <Stat label={copy.balAllowance} value={r.leaveBalance.allowance} />
            <Stat label={copy.balUsed} value={r.leaveBalance.approved} />
            <Stat label={copy.balPending} value={r.leaveBalance.pending} />
            <Stat label={copy.balRequested} value={r.leaveBalance.requested} />
            <Stat label={copy.balAfter} value={r.leaveBalance.remainingAfter} critical={r.leaveBalance.remainingAfter < 0} />
          </div>
        </div>
      )}
    </>
  );
}

function CorrectionBody({ r, copy, isArabic }: { r: CorrectionItem; copy: Copy; isArabic: boolean }) {
  const pair = (v: TimePair | null) =>
    v && (v.checkIn || v.checkOut) ? (
      <span className="flex flex-col gap-1">
        <span>{copy.in}: <b dir="ltr">{fmtTime(v.checkIn, undefined, isArabic)}</b></span>
        <span>{copy.out}: <b dir="ltr">{fmtTime(v.checkOut, undefined, isArabic)}</b></span>
      </span>
    ) : "—";

  return (
    <>
      <div className={box}>
        <p className="text-[11px] font-bold text-[var(--text-muted)]">{copy.workDate}</p>
        <p dir="ltr" className="mt-1 font-black">{r.workDate}</p>
      </div>
      {CORRECTION_TIME_TYPES.includes(r.correctionType) ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className={box}>
            <span className="mb-2 block text-xs font-black text-[var(--text-muted)]">{copy.orig}</span>
            <div className="font-bold">{pair(r.original)}</div>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <span className="mb-2 block text-xs font-black text-blue-700">{copy.prop}</span>
            <div className="font-bold text-blue-900">{pair(r.proposed)}</div>
          </div>
        </div>
      ) : (
        <p className={`${box} text-xs font-bold leading-6 text-[var(--text-secondary)]`}>{copy.noTimes}</p>
      )}
    </>
  );
}

export function RequestDetails({
  request, copy, isArabic, busy, onDecide,
}: {
  request: UnifiedRequest;
  copy: Copy;
  isArabic: boolean;
  busy: boolean;
  onDecide: (item: UnifiedRequest, action: "approve" | "reject", note: string) => void;
}) {
  const [note, setNote] = useState("");
  useEffect(() => setNote(""), [request.key]);

  const fmtDate = (n: number) =>
    new Intl.DateTimeFormat(isArabic ? "ar-SA" : "en-US", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(n));
  const isCorrection = request.group === "attendance";

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
      <div className="border-b border-[var(--border-default)] px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-extrabold text-[var(--brand-primary)]" title={request.id}>{shortRef(request)}</span>
          <span className="rounded-full bg-[var(--surface-muted)] px-2.5 py-1 text-[10px] font-extrabold text-[var(--text-secondary)]">
            {copy.groups[request.group]}
          </span>
          <StatusBadge status={request.status} isArabic={isArabic} />
        </div>
        <h2 className="mt-2 text-xl font-black tracking-tight">{typeLabel(request, copy)}</h2>
        <p className="mt-1 text-xs text-[var(--text-muted)]">{copy.created}: {fmtDate(request.createdAt)}</p>
      </div>

      <div className="space-y-4 p-5 sm:p-6">
        <div className={`${box} flex items-center gap-3`}>
          <UserRound size={17} className="text-[var(--brand-primary)]" />
          <div>
            <p className="text-[10px] font-bold text-[var(--text-muted)]">{copy.employee}</p>
            <p className="font-extrabold">{request.employeeName}</p>
          </div>
        </div>

        {request.group === "leave" && <LeaveBody r={request} copy={copy} fmtDate={fmtDate} />}
        {request.group === "attendance" && <CorrectionBody r={request} copy={copy} isArabic={isArabic} />}

        <div className={box}>
          <p className="mb-2 flex items-center gap-2 text-[11px] font-bold text-[var(--text-muted)]">
            <FileText size={13} /> {copy.reason}
          </p>
          <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--text-secondary)]">{request.reason}</p>
        </div>

        {request.status !== "pending" && request.reviewedByName && (
          <div className={box}>
            <p className="text-xs font-bold text-[var(--text-secondary)]">
              {copy.decidedBy}: <b className="text-[var(--text-primary)]">{request.reviewedByName}</b>
              {isCorrection && (request as CorrectionItem).decisionNote ? ` — ${(request as CorrectionItem).decisionNote}` : ""}
            </p>
          </div>
        )}

        {request.status === "pending" && (
          <div className="space-y-3 border-t border-[var(--border-default)] pt-5">
            {isCorrection && CORRECTION_TIME_TYPES.includes((request as CorrectionItem).correctionType) && (
              <p className="text-[11px] font-bold text-[var(--text-muted)]">{copy.approveHint}</p>
            )}
            {isCorrection && (
              <input
                value={note}
                maxLength={500}
                placeholder={copy.note}
                onChange={(e) => setNote(e.target.value)}
                className="block h-11 w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-3 text-sm font-bold outline-none focus:border-[var(--brand-primary)]"
              />
            )}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button" disabled={busy} onClick={() => onDecide(request, "approve", note)}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--brand-primary)] px-4 text-sm font-extrabold text-white transition hover:bg-[var(--brand-hover)] disabled:opacity-50"
              >
                <Check size={17} strokeWidth={2.4} /> {copy.approve}
              </button>
              <button
                type="button" disabled={busy} onClick={() => onDecide(request, "reject", note)}
                className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-red-200 bg-[var(--surface)] px-4 text-sm font-extrabold text-[var(--critical)] transition hover:bg-[var(--critical-background)] disabled:opacity-50"
              >
                <X size={17} strokeWidth={2.4} /> {copy.reject}
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}