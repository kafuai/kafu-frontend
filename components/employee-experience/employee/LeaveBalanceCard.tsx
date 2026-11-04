// LeaveBalanceCard.tsx
import { CalendarDays } from "lucide-react";
import { LeaveBalance } from "./types";
import { useAppCopy } from "./useAppCopy";
import { LeaveBalanceSkeleton } from "./SharedUI";

export default function LeaveBalanceCard({
  balance,
  initialLoading,
  isArabic,
}: {
  balance: LeaveBalance | null;
  initialLoading: boolean;
  isArabic: boolean;
}) {
  const { copy } = useAppCopy(isArabic);

  if (initialLoading) return <LeaveBalanceSkeleton />;
  if (!balance) return null;

  const usedPct =
    balance.allowance > 0
      ? Math.min(100, Math.round((balance.used / balance.allowance) * 100))
      : 0;

  return (
    <div className="rounded-[26px] border border-[var(--border)] bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800">{copy.balanceTitle}</p>
          <p className="mt-1 text-[11px] text-slate-400">{balance.year}</p>
        </div>
        <CalendarDays size={17} className="text-[var(--brand-primary)]" />
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        {[
          { label: copy.balanceAllowance, value: balance.allowance },
          { label: copy.balanceUsed, value: balance.approved },
          { label: copy.balancePending, value: balance.pending },
          { label: copy.balanceRemaining, value: balance.remaining },
        ].map((item) => (
          <div key={item.label} className="rounded-xl bg-slate-50 px-1 py-2.5">
            <p className="text-base font-bold text-slate-800">{item.value}</p>
            <p className="mt-0.5 text-[10px] text-slate-400">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[var(--brand-primary)] transition-all"
          style={{ width: `${usedPct}%` }}
        />
      </div>
    </div>
  );
}