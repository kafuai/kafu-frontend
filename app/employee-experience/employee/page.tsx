"use client";

import {
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  ArrowUp,
  Bot,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  Headphones,
  Info,
  MessageCircle,
  RefreshCw,
  Send,
  Sparkles,
  UserRound,
  UsersRound,
  XCircle,
} from "lucide-react";

import { useLocalization } from "@/components/localization/LocalizationContext";

type MessageType = "assistant" | "user";
type RequestType = "inquiry" | "request";

type RequestCategory =
  | "leave"
  | "employment_letter"
  | "employee_inquiry"
  | "data_update"
  | "general";

type ChatMessage = {
  id: string;
  type: MessageType;
  content: string;
  category?: RequestCategory;
  requestType?: RequestType;
  time: string;
};

type HRRequestStatus = "pending" | "approved" | "rejected";

type HRRequest = {
  id: string;
  category: RequestCategory;
  title: string;
  status: HRRequestStatus;
  createdAt: string;
};

export default function EmployeeExperiencePage() {
  const { locale } = useLocalization();
  const isArabic = locale === "ar";

  const categoryLabels: Record<RequestCategory, string> = {
    leave: isArabic ? "طلب إجازة" : "Leave request",
    employment_letter: isArabic
      ? "خطاب تعريف"
      : "Employment letter",
    employee_inquiry: isArabic
      ? "استفسار موظف"
      : "Employee inquiry",
    data_update: isArabic ? "تحديث بيانات" : "Data update",
    general: isArabic ? "طلب موظف" : "Employee request",
  };

  const copy = {
    welcomeMessage: isArabic
      ? "مرحبًا 👋\nأنا Employee Experience Manager. أقدر أساعدك في استفساراتك اليومية أو أستقبل طلباتك وأوجّهها لفريق الموارد البشرية."
      : "Hello 👋\n I'm the Employee Experience Manager. I can help with your daily inquiries or take your requests and route them to HR.",
    headerTitle: "Employee Experience Manager",
    headerReady: isArabic ? "جاهز" : "Ready",
    headerSubtitle: isArabic
      ? "مساعد الموظفين الذكي للطلبات والاستفسارات اليومية"
      : "AI assistant for daily employee requests and inquiries",
    hrSupportTitle: isArabic
      ? "دعم الموارد البشرية"
      : "HR Support",
    hrSupportSubtitle: isArabic
      ? "متاح لمعالجة الطلبات"
      : "Available to process requests",
    chatHeaderTitle: "Employee Experience AI",
    chatHeaderSubtitle: isArabic
      ? "يفهم طلبك ويوجّه الإجراء المناسب"
      : "Understands your request and routes the right action",
    howItWorks: isArabic ? "كيف يعمل؟" : "How it works?",
    inputPlaceholder: isArabic
      ? "اكتب استفسارك أو طلبك هنا..."
      : "Type your inquiry or request here...",
    sendHint: isArabic
      ? "اضغط Enter للإرسال · Shift + Enter لسطر جديد"
      : "Press Enter to send · Shift + Enter for a new line",
    poweredByAI: isArabic
      ? "مدعوم بالذكاء الاصطناعي"
      : "Powered by AI",
    capabilitiesTitle: isArabic
      ? "ماذا أستطيع أن أفعل؟"
      : "What can I do?",
    capabilitiesSubtitle: isArabic
      ? "الخدمات المتاحة للموظفين"
      : "Services available to employees",
    myRequestsTitle: isArabic ? "طلباتي" : "My Requests",
    myRequestsSubtitle: isArabic
      ? "الطلبات المحولة إلى HR"
      : "Requests routed to HR",
    filterAll: isArabic ? "الكل" : "All",
    filterLeave: isArabic ? "إجازات" : "Leave",
    filterLetters: isArabic ? "خطابات" : "Letters",
    statusPending: isArabic ? "بانتظار HR" : "Pending HR",
    statusApproved: isArabic ? "تمت الموافقة" : "Approved",
    statusRejected: isArabic ? "مرفوض" : "Rejected",
    employeeRequestLabel: isArabic
      ? "طلب موظف"
      : "Employee request",
    noRequests: isArabic ? "لا توجد طلبات" : "No requests",
    footerNote: isArabic
      ? "الطلبات التي تحتاج إجراءً بشريًا يتم تحويلها إلى فريق الموارد البشرية"
      : "Requests requiring human action are routed to the HR team",
    genericErrorFallback: isArabic
      ? "حدث خطأ أثناء معالجة الطلب. حاول مرة أخرى."
      : "An error occurred while processing your request. Please try again.",
    processFailedFallback: isArabic
      ? "تعذر معالجة الطلب."
      : "Unable to process the request.",
    requestReceivedFallback: isArabic
      ? "تم استلام طلبك."
      : "Your request has been received.",
    capabilities: [
      {
        category: "leave" as const,
        title: isArabic ? "طلبات الإجازات" : "Leave Requests",
        description: isArabic
          ? "تقديم ومتابعة طلبات الإجازة"
          : "Submit and track leave requests",
        prompt: isArabic
          ? "أريد تقديم طلب إجازة"
          : "I'd like to submit a leave request",
      },
      {
        category: "employment_letter" as const,
        title: isArabic
          ? "خطابات التعريف"
          : "Employment Letters",
        description: isArabic
          ? "طلب خطابات ووثائق الموظف"
          : "Request employee letters and documents",
        prompt: isArabic
          ? "أحتاج إلى خطاب تعريف"
          : "I need an employment letter",
      },
      {
        category: "employee_inquiry" as const,
        title: isArabic
          ? "استفسارات الموظفين"
          : "Employee Inquiries",
        description: isArabic
          ? "الحصول على إجابات فورية"
          : "Get instant answers",
        prompt: isArabic
          ? "لدي استفسار للموارد البشرية"
          : "I have a question for HR",
      },
      {
        category: "data_update" as const,
        title: isArabic ? "تحديث البيانات" : "Data Update",
        description: isArabic
          ? "طلب تعديل البيانات الشخصية"
          : "Request personal data changes",
        prompt: isArabic
          ? "أريد تحديث بياناتي"
          : "I'd like to update my data",
      },
    ],
  };

  const initialMessages: ChatMessage[] = [
    {
      id: "welcome",
      type: "assistant",
      content: copy.welcomeMessage,
      time: isArabic ? "الآن" : "Now",
    },
  ];

  const [messages, setMessages] =
    useState<ChatMessage[]>(initialMessages);

  useEffect(() => {
  setMessages((current) =>
    current.map((message) =>
      message.id === "welcome"
        ? {
            ...message,
            content: copy.welcomeMessage,
            time: isArabic ? "الآن" : "Now",
          }
        : message,
    ),
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [isArabic]);

  const [requests, setRequests] = useState<HRRequest[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState
    <RequestCategory | "all">
  ("all");

  const visibleRequests = useMemo(() => {
    if (selectedCategory === "all") return requests;
    return requests.filter(
      (request) => request.category === selectedCategory,
    );
  }, [requests, selectedCategory]);

  function getTime() {
    return new Intl.DateTimeFormat(
      isArabic ? "ar-SA" : "en-US",
      { hour: "2-digit", minute: "2-digit" },
    ).format(new Date());
  }

  function formatRequestDate(timestamp: number) {
    return new Intl.DateTimeFormat(
      isArabic ? "ar-SA" : "en-US",
      { day: "2-digit", month: "short" },
    ).format(new Date(timestamp));
  }

  function mapApiStatusToHRStatus(
    status: "pending" | "approved" | "rejected" | "cancelled",
  ): HRRequestStatus {
    if (status === "approved") return "approved";
    if (status === "rejected") return "rejected";
    return "pending";
  }

  function formatShortReference(id: string): string {
  const shortId = id.replace(/-/g, "").slice(-6).toUpperCase();
  return `REQ-${shortId}`;
}

  function classifyMessage(message: string): {
    category: RequestCategory;
    requestType: RequestType;
  } {
    const value = message.toLowerCase();

    if (
      value.includes("إجاز") ||
      value.includes("اجاز") ||
      value.includes("leave") ||
      value.includes("vacation") ||
      value.includes("عطلة")
    ) {
      return { category: "leave", requestType: "request" };
    }

    if (
      value.includes("خطاب") ||
      value.includes("تعريف") ||
      value.includes("شهادة") ||
      value.includes("employment") ||
      value.includes("certificate")
    ) {
      return {
        category: "employment_letter",
        requestType: "request",
      };
    }

    if (
      value.includes("تحديث") ||
      value.includes("تعديل") ||
      value.includes("بيانات") ||
      value.includes("update") ||
      value.includes("change my")
    ) {
      return { category: "data_update", requestType: "request" };
    }

    if (
      value.includes("كيف") ||
      value.includes("كم") ||
      value.includes("هل") ||
      value.includes("ما هي") ||
      value.includes("متى") ||
      value.includes("why") ||
      value.includes("how") ||
      value.includes("what") ||
      value.includes("?")
    ) {
      return {
        category: "employee_inquiry",
        requestType: "inquiry",
      };
    }

    return { category: "general", requestType: "request" };
  }

  function CategoryIcon({
    category,
  }: {
    category: RequestCategory;
  }) {
    if (category === "leave")
      return <CalendarDays size={17} strokeWidth={1.8} />;
    if (category === "employment_letter")
      return <FileText size={17} strokeWidth={1.8} />;
    if (category === "data_update")
      return <RefreshCw size={17} strokeWidth={1.8} />;
    return <MessageCircle size={17} strokeWidth={1.8} />;
  }

  function StatusIcon({ status }: { status: HRRequestStatus }) {
    if (status === "approved")
      return <CheckCircle2 size={11} />;
    if (status === "rejected") return <XCircle size={11} />;
    return <Clock3 size={11} />;
  }

  function statusBadgeClasses(status: HRRequestStatus) {
    if (status === "approved")
      return "bg-emerald-50 text-emerald-600";
    if (status === "rejected") return "bg-red-50 text-red-600";
    return "bg-amber-50 text-amber-600";
  }

  function statusLabel(status: HRRequestStatus) {
    if (status === "approved") return copy.statusApproved;
    if (status === "rejected") return copy.statusRejected;
    return copy.statusPending;
  }

  async function loadMyRequests() {
    try {
      const response = await fetch(
        "/api/employee-experience?mine=true",
        { method: "GET" },
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ?? "Unable to load requests.",
        );
      }

      const mapped: HRRequest[] = (
        (payload.data ?? []) as Array<{
          id: string;
          requestType: "leave" | "employment_letter";
          status:
            | "pending"
            | "approved"
            | "rejected"
            | "cancelled";
          createdAt: number;
        }>
      ).map((item) => ({
        id: item.id,
        category: item.requestType,
        title: categoryLabels[item.requestType],
        status: mapApiStatusToHRStatus(item.status),
        createdAt: formatRequestDate(item.createdAt),
      }));

      setRequests(mapped);
    } catch (error) {
      console.error(
        "Failed to load employee requests:",
        error,
      );
    }
  }

  useEffect(() => {
    loadMyRequests();

    const interval = setInterval(loadMyRequests, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
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
        body: JSON.stringify({
          message,
          locale: isArabic ? "ar" : "en",
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(
          payload.error ?? copy.processFailedFallback,
        );
      }

      const realCategory =
        payload.data?.classification?.category ??
        optimisticClassification.category;

      const realRequestType =
        payload.data?.classification?.kind ??
        optimisticClassification.requestType;

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        type: "assistant",
        content: String(
          payload.data?.message ?? copy.requestReceivedFallback,
        ),
        category: realCategory,
        requestType: realRequestType,
        time: getTime(),
      };

      setMessages((current) => [...current, assistantMessage]);

      if (payload.data?.requestId) {
        await loadMyRequests();
      }
    } catch (error) {
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        type: "assistant",
        content:
          error instanceof Error
            ? error.message
            : copy.genericErrorFallback,
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
        {/* Page Header */}
        <section className="flex flex-col gap-4 rounded-[24px] border border-[var(--border)] bg-white px-5 py-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-primary)] text-white shadow-sm">
              <Sparkles size={23} strokeWidth={1.8} />
            </div>

            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)] sm:text-2xl">
                  {copy.headerTitle}
                </h1>

                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {copy.headerReady}
                </span>
              </div>

              <p className="text-sm text-slate-500">
                {copy.headerSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[var(--brand-primary)] shadow-sm">
              <Headphones size={18} strokeWidth={1.8} />
            </div>

            <div>
              <p className="text-xs font-medium text-slate-700">
                {copy.hrSupportTitle}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                {copy.hrSupportSubtitle}
              </p>
            </div>

            <CheckCircle2
              className="mr-1 text-emerald-500"
              size={17}
              strokeWidth={1.8}
            />
          </div>
        </section>

        {/* Main Workspace */}
        <section className="grid min-h-[680px] grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* Chat */}
          <div className="flex min-h-[680px] flex-col overflow-hidden rounded-[26px] border border-[var(--border)] bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-[var(--brand-primary)]">
                  <Bot size={20} strokeWidth={1.8} />
                  <span className="absolute bottom-0 left-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {copy.chatHeaderTitle}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {copy.chatHeaderSubtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="flex h-9 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-medium text-slate-500 transition hover:bg-slate-50"
              >
                <Info size={15} />
                {copy.howItWorks}
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-[linear-gradient(to_bottom,#ffffff,#fbfcfe)] px-4 py-6 sm:px-7">
              <div className="mx-auto flex max-w-4xl flex-col gap-5">
                {messages.map((message) => {
                  const isUser = message.type === "user";

                  return (
                    <div
                      key={message.id}
                      className={`flex items-end gap-2.5 ${
                        isUser ? "justify-start" : "justify-end"
                      }`}
                    >
                      {!isUser && (
                        <div className="order-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white">
                          <Bot size={16} strokeWidth={1.8} />
                        </div>
                      )}

                      <div className="order-1 max-w-[85%] sm:max-w-[72%]">
                        <div
                          className={`rounded-[20px] px-4 py-3.5 text-sm leading-7 ${
                            isUser
                              ? "rounded-bl-md bg-[var(--brand-primary)] text-white"
                              : "rounded-br-md border border-slate-100 bg-white text-slate-700 shadow-[0_4px_18px_rgba(15,23,42,0.045)]"
                          }`}
                        >
                          {message.content
                            .split("\n")
                            .map((line, index) => (
                              <span key={index}>
                                {line}
                                {index !==
                                  message.content.split("\n")
                                    .length -
                                    1 && <br />}
                              </span>
                            ))}
                        </div>

                        <div
                          className={`mt-1.5 flex items-center gap-2 px-1 text-[10px] text-slate-400 ${
                            isUser
                              ? "justify-start"
                              : "justify-end"
                          }`}
                        >
                          {message.category && (
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 ${
                                isUser
                                  ? "bg-slate-100 text-slate-500"
                                  : "bg-blue-50 text-[var(--brand-primary)]"
                              }`}
                            >
                              <CategoryIcon
                                category={message.category}
                              />
                              {categoryLabels[message.category]}
                            </span>
                          )}

                          <span>{message.time}</span>
                        </div>
                      </div>

                      {isUser && (
                        <div className="order-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                          <UserRound size={16} strokeWidth={1.8} />
                        </div>
                      )}
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex items-end justify-end gap-2.5">
                    <div className="max-w-[72%] rounded-[20px] rounded-br-md border border-slate-100 bg-white px-5 py-4 shadow-[0_4px_18px_rgba(15,23,42,0.045)]">
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300 [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300" />
                      </div>
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--brand-primary)] text-white">
                      <Bot size={16} strokeWidth={1.8} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Composer */}
            <div className="border-t border-slate-100 bg-white px-4 py-4 sm:px-6">
              <form
                onSubmit={handleSubmit}
                className="mx-auto max-w-4xl"
              >
                <div className="relative flex items-end gap-2 rounded-[20px] border border-slate-200 bg-slate-50 p-2 transition focus-within:border-[var(--brand-primary)] focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50">
                  <textarea
                    value={input}
                    onChange={(event) =>
                      setInput(event.target.value)
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        !event.shiftKey
                      ) {
                        event.preventDefault();
                        event.currentTarget.form?.requestSubmit();
                      }
                    }}
                    rows={1}
                    placeholder={copy.inputPlaceholder}
                    className="min-h-[48px] flex-1 resize-none border-0 bg-transparent px-3 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                  />

                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] bg-[var(--brand-primary)] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Send"
                  >
                    <Send size={18} strokeWidth={2} />
                  </button>
                </div>

                <div className="mt-2 flex items-center justify-between px-1">
                  <p className="text-[10px] text-slate-400">
                    {copy.sendHint}
                  </p>

                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <Sparkles size={12} />
                    {copy.poweredByAI}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Sidebar */}
          <aside className="flex flex-col gap-5">
            {/* Capabilities */}
            <div className="rounded-[26px] border border-[var(--border)] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {copy.capabilitiesTitle}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {copy.capabilitiesSubtitle}
                  </p>
                </div>

                <Sparkles
                  size={17}
                  className="text-[var(--brand-primary)]"
                />
              </div>

              <div className="space-y-2">
                {copy.capabilities.map((item) => (
                  <button
                    key={item.category}
                    type="button"
                    onClick={() => setInput(item.prompt)}
                    className="group flex w-full items-center gap-3 rounded-2xl border border-transparent px-3 py-3 text-start transition hover:border-slate-100 hover:bg-slate-50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-[var(--brand-primary)] transition group-hover:bg-white">
                      <CategoryIcon category={item.category} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-slate-700">
                        {item.title}
                      </p>
                      <p className="mt-0.5 truncate text-[10px] text-slate-400">
                        {item.description}
                      </p>
                    </div>

                    <ArrowUp
                      size={14}
                      className={`text-slate-300 transition group-hover:text-[var(--brand-primary)] ${
                        isArabic
                          ? "rotate-[-45deg]"
                          : "rotate-45"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* HR Requests */}
            <div className="flex-1 rounded-[26px] border border-[var(--border)] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {copy.myRequestsTitle}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {copy.myRequestsSubtitle}
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-500">
                  {requests.length}
                </span>
              </div>

              <div className="mb-3 flex items-center gap-1">
                {[
                  { value: "all" as const, label: copy.filterAll },
                  {
                    value: "leave" as const,
                    label: copy.filterLeave,
                  },
                  {
                    value: "employment_letter" as const,
                    label: copy.filterLetters,
                  },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(filter.value)
                    }
                    className={`rounded-lg px-2.5 py-1.5 text-[10px] font-medium transition ${
                      selectedCategory === filter.value
                        ? "bg-slate-100 text-slate-700"
                        : "text-slate-400 hover:bg-slate-50"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <div className="space-y-2.5">
                {visibleRequests.slice(0, 4).map((request) => (
                  <div
                    key={request.id}
                    className="rounded-2xl border border-slate-100 p-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-[var(--brand-primary)]">
                        <CategoryIcon
                          category={request.category}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-slate-700">
                          {request.title}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-400">
                          {formatShortReference(request.id)}
                          {" "}
                          ·{" "}
                          {request.createdAt}
                      </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-50 pt-2.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-medium ${statusBadgeClasses(
                          request.status,
                        )}`}
                      >
                        <StatusIcon status={request.status} />
                        {statusLabel(request.status)}
                      </span>

                      <span className="text-[9px] text-slate-400">
                        {copy.employeeRequestLabel}
                      </span>
                    </div>
                  </div>
                ))}

                {visibleRequests.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 px-4 py-8 text-center">
                    <UsersRound
                      size={22}
                      className="text-slate-300"
                    />
                    <p className="mt-2 text-xs font-medium text-slate-500">
                      {copy.noRequests}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </section>

        {/* Footer Note */}
        <div className="flex items-center justify-center gap-2 pb-2 text-[10px] text-slate-400">
          <CheckCircle2
            size={12}
            className="text-emerald-500"
          />
          {copy.footerNote}
        </div>
      </div>
    </main>
  );
}