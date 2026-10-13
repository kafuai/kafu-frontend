"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { useLocalization } from "@/components/localization/LocalizationContext";

// Components
import PageHeader from "@/components/employee-experience/employee/PageHeader";
import LeaveBalanceCard from "@/components/employee-experience/employee/LeaveBalanceCard";
import ChatArea from "@/components/employee-experience/employee/ChatArea";
import Sidebar from "@/components/employee-experience/employee/Sidebar";

// Hooks & Types
import { useAppCopy } from "@/components/employee-experience/employee/useAppCopy";
import { ChatMessage, HRRequest, HRRequestStatus, LeaveBalance, RequestCategory, RequestType, SickFormState } from "@/components/employee-experience/employee/types";

export default function EmployeeExperiencePage() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";
  const { copy } = useAppCopy(isArabic);

  const initialMessages: ChatMessage[] = [
    {
      id: "welcome",
      type: "assistant",
      content: copy.welcomeMessage,
      time: isArabic ? "الآن" : "Now",
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [requests, setRequests] = useState<HRRequest[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<RequestCategory | "all">("all");
  const [balance, setBalance] = useState<LeaveBalance | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  // Update welcome message on locale change
  useEffect(() => {
    setMessages((current) =>
      current.map((message) =>
        message.id === "welcome"
          ? {
              ...message,
              content: copy.welcomeMessage,
              time: isArabic ? "الآن" : "Now",
            }
          : message
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isArabic]);

  function getTime() {
    return new Intl.DateTimeFormat(isArabic ? "ar-SA" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());
  }

  function mapApiStatusToHRStatus(status: string): HRRequestStatus {
    if (status === "approved") return "approved";
    if (status === "rejected") return "rejected";
    return "pending";
  }

  function classifyMessage(message: string): {
    category: RequestCategory;
    requestType: RequestType;
  } {
    const value = message.toLowerCase();
    if (
      value.includes("إجاز") || value.includes("اجاز") || value.includes("leave") ||
      value.includes("vacation") || value.includes("عطلة")
    ) {
      return { category: "leave", requestType: "request" };
    }
    if (
      value.includes("خطاب") || value.includes("تعريف") || value.includes("شهادة") ||
      value.includes("employment") || value.includes("certificate")
    ) {
      return { category: "employment_letter", requestType: "request" };
    }
    if (
      value.includes("تحديث") || value.includes("تعديل") || value.includes("بيانات") ||
      value.includes("update") || value.includes("change my")
    ) {
      return { category: "data_update", requestType: "request" };
    }
    if (
      value.includes("كيف") || value.includes("كم") || value.includes("هل") ||
      value.includes("ما هي") || value.includes("متى") || value.includes("why") ||
      value.includes("how") || value.includes("what") || value.includes("?")
    ) {
      return { category: "employee_inquiry", requestType: "inquiry" };
    }
    return { category: "general", requestType: "request" };
  }

  async function loadMyRequests() {
    try {
      const response = await fetch("/api/employee-experience?mine=true", { method: "GET" });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? "Unable to load requests.");
      }

      const mapped: HRRequest[] = (payload.data ?? []).map((item: any) => ({
        id: item.id,
        category: item.requestType,
        status: mapApiStatusToHRStatus(item.status),
        createdAt: item.createdAt,
        reviewedByName: item.reviewedByName ?? null,
        reviewedAt: item.reviewedAt ?? null,
        startDate: item.startDate ? Number(item.startDate) : null,
        endDate: item.endDate ? Number(item.endDate) : null,
        leaveType: item.leaveType ?? null,
      }));

      setRequests(mapped);
      setBalance(payload.balance ?? null);
    } catch (error) {
      console.error("Failed to load employee requests:", error);
    } finally {
      setInitialLoading(false);
    }
  }

  useEffect(() => {
    loadMyRequests();
    const interval = setInterval(loadMyRequests, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setSickFormState(messageId: string, state: SickFormState) {
    setMessages((current) =>
      current.map((m) => (m.id === messageId ? { ...m, sickForm: state } : m))
    );
  }

  async function handleSickSuccess(messageId: string, text: string) {
    setSickFormState(messageId, "submitted");
    setMessages((c) => [
      ...c,
      {
        id: `assistant-${Date.now()}`,
        type: "assistant",
        content: text,
        category: "leave",
        requestType: "request",
        time: getTime(),
      },
    ]);
    await loadMyRequests();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = input.trim();
    if (!message || isTyping) return;

    const optimisticClassification = classifyMessage(message);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: message,
      category: optimisticClassification.category,
      requestType: optimisticClassification.requestType,
      time: getTime(),
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/employee-experience", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, locale: isArabic ? "ar" : "en" }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error ?? copy.processFailedFallback);
      }

      const realCategory = payload.data?.classification?.category ?? optimisticClassification.category;
      const realRequestType = payload.data?.classification?.kind ?? optimisticClassification.requestType;

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        type: "assistant",
        content: String(payload.data?.message ?? copy.requestReceivedFallback),
        category: realCategory,
        requestType: realRequestType,
        time: getTime(),
        sickForm: payload.data?.nextAction === "sick_leave_form" ? "open" : undefined,
      };

      setMessages((current) => [...current, assistantMessage]);

      if (payload.data?.requestId) {
        await loadMyRequests();
      }
    } catch (error) {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        type: "assistant",
        content: error instanceof Error ? error.message : copy.genericErrorFallback,
        time: getTime(),
      };
      setMessages((current) => [...current, assistantMessage]);
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <main
      dir={isArabic ? "rtl" : "ltr"}
      className="min-h-[calc(100vh-64px)] bg-[var(--background)] px-4 py-5 sm:px-6 lg:px-8"
    >
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-5">
        
        <PageHeader isArabic={isArabic} />

        <LeaveBalanceCard 
          balance={balance} 
          initialLoading={initialLoading} 
          isArabic={isArabic} 
        />

        <section className="grid min-h-[680px] grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          
          <ChatArea
            isArabic={isArabic}
            messages={messages}
            input={input}
            setInput={setInput}
            isTyping={isTyping}
            handleSubmit={handleSubmit}
            setSickFormState={setSickFormState}
            handleSickSuccess={handleSickSuccess}
          />

          <Sidebar
            isArabic={isArabic}
            requests={requests}
            initialLoading={initialLoading}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            setInput={setInput}
          />
          
        </section>

        {/* Footer Note */}
        <div className="flex items-center justify-center gap-2 pb-2 text-[10px] text-slate-400">
          <CheckCircle2 size={12} className="text-emerald-500" />
          {copy.footerNote}
        </div>
        
      </div>
    </main>
  );
}