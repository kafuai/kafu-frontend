"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocalization } from "@/components/localization/LocalizationContext";

// Types & Hooks
import { ApiLeaveRequest, EmployeeRequest, RequestStatus } from "@/components/employee-experience/requests/types";
import { useAppCopy } from "@/components/employee-experience/requests/useAppCopy";

// Components
import PageHeader from "@/components/employee-experience/requests/PageHeader";
import ManagerStats from "@/components/employee-experience/requests/ManagerStats";
import RequestsList from "@/components/employee-experience/requests/RequestsList";
import RequestDetails from "@/components/employee-experience/requests/RequestDetails";

export default function EmployeeExperienceRequestsPage() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const { copy, leaveTypeLabels } = useAppCopy(isArabic);

  // States
  const [rawRequests, setRawRequests] = useState<ApiLeaveRequest[]>([]);
  const [loadState, setLoadState] = useState<"loading" | "loaded" | "error">("loading");
  const [loadError, setLoadError] = useState<string>("");
  const [selectedRequestId, setSelectedRequestId] = useState<string>("");
  const [actionState, setActionState] = useState<"idle" | "working" | "error">("idle");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");
  const [attachmentError, setAttachmentError] = useState("");

  function formatDate(timestamp: number) {
    return new Intl.DateTimeFormat(isArabic ? "ar-SA" : "en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(timestamp));
  }

  function mapApiRequest(item: ApiLeaveRequest): EmployeeRequest {
    const isLeave = item.requestType === "leave";
    return {
      id: item.id,
      employeeId: item.employeeId,
      employeeName: item.employeeName,
      requestType: item.requestType,
      title: isLeave
        ? (isArabic ? "طلب إجازة" : "Leave request")
        : (isArabic ? "طلب خطاب تعريف" : "Employment letter request"),
      description: item.reason,
      status: item.status,
      createdAt: formatDate(item.createdAt),
      requestedDates:
        isLeave && item.startDate && item.endDate
          ? `${formatDate(item.startDate)} — ${formatDate(item.endDate)}`
          : undefined,
      leaveTypeLabel:
        isLeave && item.leaveType
          ? leaveTypeLabels[item.leaveType] ?? item.leaveType
          : undefined,
      leaveBalance: isLeave && item.status === "pending" ? item.leaveBalance ?? null : null,
      hasAttachment: isLeave && Boolean(item.hasAttachment),
      attachmentName: item.attachmentName ?? null,
    };
  }

  const requests = useMemo(
    () => rawRequests.map(mapApiRequest),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rawRequests, isArabic]
  );

  async function loadRequests() {
    setLoadState("loading");
    setLoadError("");
    try {
      const response = await fetch("/api/employee-experience", { method: "GET" });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? (isArabic ? "تعذر تحميل الطلبات." : "Unable to load requests."));
      }
      const raw = (payload.data ?? []) as ApiLeaveRequest[];
      setRawRequests(raw);
      setSelectedRequestId((current) => current || raw[0]?.id || "");
      setLoadState("loaded");
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : (isArabic ? "تعذر تحميل الطلبات." : "Unable to load requests."));
      setLoadState("error");
    }
  }

  useEffect(() => {
    loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedRequest = requests.find((r) => r.id === selectedRequestId) ?? requests[0] ?? null;

  const filteredRequests = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return requests.filter((request) => {
      const matchesStatus = statusFilter === "all" || request.status === statusFilter;
      if (!matchesStatus) return false;
      if (!normalizedSearch) return true;
      return [
        request.id,
        request.employeeId,
        request.employeeName,
        request.description,
      ].some((value) => value.toLowerCase().includes(normalizedSearch));
    });
  }, [requests, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      pending: requests.filter((r) => r.status === "pending").length,
      approved: requests.filter((r) => r.status === "approved").length,
      rejected: requests.filter((r) => r.status === "rejected").length,
    };
  }, [requests]);

  async function openAttachment(requestId: string) {
    setAttachmentError("");
    try {
      const res = await fetch(`/api/employee-experience/requests/${requestId}/attachment`);
      const payload = await res.json();
      if (!res.ok || !payload.data?.url) {
        throw new Error(payload.error ?? copy.attachmentError);
      }
      const a = document.createElement("a");
      a.href = payload.data.url;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      setAttachmentError(e instanceof Error ? e.message : copy.attachmentError);
    }
  }

  async function handleDecision(requestId: string, decision: "approve" | "reject") {
    setActionState("working");
    const currentRequest = requests.find((r) => r.id === requestId);
    const basePath =
      currentRequest?.requestType === "employment_letter"
        ? "/api/employee-experience/letters"
        : "/api/employee-experience/requests";
    try {
      const response = await fetch(`${basePath}/${requestId}/${decision}`, { method: "POST" });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error ?? "Action failed.");
      }
      await loadRequests();
      setActionState("idle");
    } catch (error) {
      console.error(`Failed to ${decision} request:`, error);
      setActionState("error");
    }
  }

  return (
    <main dir={isArabic ? "rtl" : "ltr"} className="min-h-[calc(100vh-76px)] bg-[var(--background)]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        
        <PageHeader copy={copy} />

        <ManagerStats copy={copy} isArabic={isArabic} stats={stats} />

        <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.38fr)]">
          <RequestsList
            copy={copy}
            locale={locale as "ar" | "en"}
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            filteredRequests={filteredRequests}
            loadState={loadState}
            loadError={loadError}
            loadRequests={loadRequests}
            selectedRequestId={selectedRequestId}
            setSelectedRequestId={setSelectedRequestId}
          />

          <RequestDetails
            copy={copy}
            locale={locale as "ar" | "en"}
            isArabic={isArabic}
            selectedRequest={selectedRequest}
            handleDecision={handleDecision}
            actionState={actionState}
            openAttachment={openAttachment}
            attachmentError={attachmentError}
          />
        </section>
        
      </div>
    </main>
  );
}