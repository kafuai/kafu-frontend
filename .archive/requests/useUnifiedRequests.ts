"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/components/attendance/shared";
import {
  CORRECTION_TIME_TYPES,
  type CorrectionItem,
  type LeaveBalanceInfo,
  type LeaveItem,
  type LetterItem,
  type RequestStatus,
  type TimePair,
  type UnifiedRequest,
} from "./types";

/* ------------------------- raw API shapes ------------------------- */

type RawEmployeeRequest = {
  id: string;
  employeeId: string;
  employeeName?: string;
  requestType: "leave" | "employment_letter";
  status: RequestStatus;
  reason: string;
  startDate?: number;
  endDate?: number;
  createdAt: number;
  leaveType?: string;
  reviewedByName?: string | null;
  leaveBalance?: LeaveBalanceInfo | null;
};

type RawCorrection = {
  id: string;
  user_id: string;
  userName?: string;
  status: RequestStatus;
  created_at: string;
  reason: string;
  correction_type: CorrectionItem["correctionType"];
  work_date: string;
  original_value?: TimePair | null;
  proposed_value?: TimePair | null;
  reviewedByName?: string | null;
  decision_note?: string | null;
};

/* ----------------------------- adapters ----------------------------- */

export function mapEmployeeRequest(r: RawEmployeeRequest): LeaveItem | LetterItem {
  const base = {
    id: r.id,
    key: `employee_requests:${r.id}`,
    source: "employee_requests" as const,
    status: r.status,
    employeeId: r.employeeId,
    employeeName: r.employeeName ?? r.employeeId,
    createdAt: r.createdAt,
    reason: r.reason ?? "",
    reviewedByName: r.reviewedByName ?? null,
  };
  if (r.requestType === "leave") {
    return {
      ...base,
      group: "leave",
      leaveType: r.leaveType ?? null,
      startDate: r.startDate ?? null,
      endDate: r.endDate ?? null,
      leaveBalance: r.leaveBalance ?? null,
    };
  }
  return { ...base, group: "letter" };
}

export function mapCorrection(r: RawCorrection): CorrectionItem {
  return {
    id: r.id,
    key: `attendance_corrections:${r.id}`,
    source: "attendance_corrections",
    group: "attendance",
    status: r.status,
    employeeId: r.user_id,
    employeeName: r.userName ?? r.user_id,
    createdAt: Date.parse(r.created_at),
    reason: r.reason ?? "",
    reviewedByName: r.reviewedByName ?? null,
    correctionType: r.correction_type,
    workDate: r.work_date,
    original: r.original_value ?? null,
    proposed: r.proposed_value ?? null,
    decisionNote: r.decision_note ?? null,
  };
}

/* ------------------------------- hook ------------------------------- */

export type Banner = { kind: "ok" | "error" | "warn"; text: string };
export type LoadState = "loading" | "loaded" | "error";

export function useUnifiedRequests(labels: {
  loadFailed: string;
  partialFailed: string;
  decisionSaved: string;
  evalFailed: string;
}) {
  const [items, setItems] = useState<UnifiedRequest[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [banner, setBanner] = useState<Banner | null>(null);
  const [busyKey, setBusyKey] = useState("");

  const load = useCallback(async () => {
    const [emp, att] = await Promise.allSettled([
      api<{ data?: RawEmployeeRequest[] }>("/api/employee-experience"),
      api<{ canManage?: boolean; data?: RawCorrection[] }>("/api/attendance/corrections"),
    ]);

    const next: UnifiedRequest[] = [];
    let failures = 0;

    if (emp.status === "fulfilled") {
      next.push(...(emp.value.data ?? []).map(mapEmployeeRequest));
    } else failures += 1;

    // The corrections endpoint also serves regular employees (their own rows).
    // Only include it when the caller is a real reviewer (canManage).
    // A 403/!canManage simply means "no attendance access": not a failure.
    if (att.status === "fulfilled") {
      if (att.value.canManage) next.push(...(att.value.data ?? []).map(mapCorrection));
    } else if (!/forbidden|unauthorized/i.test(String(att.reason?.message ?? ""))) {
      failures += 1;
    }

    if (failures === 2 || (failures === 1 && next.length === 0)) {
      const reason = emp.status === "rejected" ? emp.reason : att.status === "rejected" ? att.reason : null;
      setError(reason instanceof Error ? reason.message : labels.loadFailed);
      setState("error");
      return;
    }

    setWarning(failures > 0 ? labels.partialFailed : "");
    next.sort((a, b) => b.createdAt - a.createdAt);
    setItems(next);
    setState("loaded");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const retry = () => {
    setState("loading");
    void load();
  };

  /** Routes each decision to the API that owns the request. */
  async function decide(item: UnifiedRequest, action: "approve" | "reject", note = "") {
    setBusyKey(item.key);
    setBanner(null);
    try {
      if (item.source === "attendance_corrections") {
        await api(`/api/attendance/corrections/${item.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, note }),
        });

        // Same behaviour as the previous corrections page: re-evaluate the day.
        let evalFailed = false;
        if (action === "approve") {
          try {
            await api("/api/attendance/evaluate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ from: item.workDate, to: item.workDate }),
            });
          } catch {
            evalFailed = true;
          }
        }
        setBanner(
          evalFailed
            ? { kind: "warn", text: labels.evalFailed }
            : { kind: "ok", text: labels.decisionSaved },
        );
      } else {
        const base =
          item.group === "letter"
            ? "/api/employee-experience/letters"
            : "/api/employee-experience/requests";
        await api(`${base}/${item.id}/${action}`, { method: "POST" });
        setBanner({ kind: "ok", text: labels.decisionSaved });
      }
      await load();
    } catch (e) {
      setBanner({ kind: "error", text: e instanceof Error ? e.message : "Error" });
    } finally {
      setBusyKey("");
    }
  }

  return { items, state, error, warning, banner, busyKey, retry, decide };
}

export { CORRECTION_TIME_TYPES };