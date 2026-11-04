// SharedUI.tsx
import { CalendarDays, CheckCircle2, Clock3, FileText, MessageCircle, RefreshCw, XCircle } from "lucide-react";
import { HRRequestStatus, RequestCategory } from "./types";

export function CategoryIcon({ category }: { category: RequestCategory }) {
  if (category === "leave") return <CalendarDays size={17} strokeWidth={1.8} />;
  if (category === "employment_letter") return <FileText size={17} strokeWidth={1.8} />;
  if (category === "data_update") return <RefreshCw size={17} strokeWidth={1.8} />;
  return <MessageCircle size={17} strokeWidth={1.8} />;
}

export function StatusIcon({ status }: { status: HRRequestStatus }) {
  if (status === "approved") return <CheckCircle2 size={11} />;
  if (status === "rejected") return <XCircle size={11} />;
  return <Clock3 size={11} />;
}

export function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`animate-pulse rounded-lg bg-slate-100 ${className}`} />
  );
}

export function LeaveBalanceSkeleton() {
  return (
    <div aria-busy="true" className="rounded-[26px] border border-[var(--border)] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <SkeletonBlock className="h-4 w-36" />
          <SkeletonBlock className="mt-2 h-3 w-10" />
        </div>
        <SkeletonBlock className="h-4 w-4" />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <SkeletonBlock key={i} className="h-[58px] rounded-xl" />
        ))}
      </div>
      <SkeletonBlock className="mt-4 h-1.5 w-full rounded-full" />
    </div>
  );
}

export function RequestCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 p-3">
      <div className="flex items-start gap-3">
        <SkeletonBlock className="h-8 w-8 shrink-0" />
        <div className="min-w-0 flex-1">
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="mt-2 h-2.5 w-32" />
          <div className="mt-2 flex gap-2">
            <SkeletonBlock className="h-5 w-20" />
            <SkeletonBlock className="h-5 w-28" />
          </div>
        </div>
      </div>
      <div className="mt-3 border-t border-slate-50 pt-2.5">
        <SkeletonBlock className="h-5 w-20 rounded-full" />
      </div>
    </div>
  );
}