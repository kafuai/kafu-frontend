import { Loader2, ShieldAlert } from "lucide-react";

export function LoadingView({ copy }: { copy: any }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-[var(--text-muted)]">
      <Loader2 size={22} className="animate-spin" />
      {copy.loading}
    </div>
  );
}

export function ForbiddenView({ copy }: { copy: any }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-2 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)] p-8 text-center">
      <ShieldAlert size={24} className="text-[var(--critical)]" />
      <p className="font-bold text-[var(--text-primary)]">{copy.forbidden}</p>
    </div>
  );
}

export function ErrorView({ loadError, copy, onRetry }: { loadError: string; copy: any; onRetry: () => void }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-[var(--critical)]">
      {loadError}
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg border border-[var(--border-default)] px-3 py-1.5 text-xs font-bold"
      >
        {copy.retry}
      </button>
    </div>
  );
}