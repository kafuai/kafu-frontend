import { CircleAlert, Loader2, MessageSquareText, Search } from "lucide-react";
import { EmployeeRequest, RequestStatus } from "./types";
import { FilterButton, RequestListItem } from "./SharedUI";

type RequestsListProps = {
  copy: any;
  locale: "ar" | "en";
  search: string;
  setSearch: (v: string) => void;
  statusFilter: RequestStatus | "all";
  setStatusFilter: (v: RequestStatus | "all") => void;
  filteredRequests: EmployeeRequest[];
  loadState: "loading" | "loaded" | "error";
  loadError: string;
  loadRequests: () => void;
  selectedRequestId: string;
  setSelectedRequestId: (id: string) => void;
};

export default function RequestsList({
  copy,
  locale,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  filteredRequests,
  loadState,
  loadError,
  loadRequests,
  selectedRequestId,
  setSelectedRequestId,
}: RequestsListProps) {
  return (
    <article className="min-w-0 overflow-hidden rounded-[22px] border border-[var(--border-default)] bg-[var(--surface)] shadow-[var(--shadow-small)]">
      <div className="border-b border-[var(--border-default)] p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquareText size={19} className="text-[var(--brand-primary)]" />
              <h2 className="text-base font-black text-[var(--text-primary)]">{copy.requests}</h2>
            </div>
            <p className="mt-1.5 text-xs leading-5 text-[var(--text-muted)]">{copy.requestsDescription}</p>
          </div>
          <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[var(--surface-muted)] px-2 text-xs font-black text-[var(--text-primary)]">
            {filteredRequests.length}
          </span>
        </div>

        <div className="mt-4">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={copy.searchPlaceholder}
            className="h-11 w-full rounded-xl border border-[var(--border-default)] bg-[var(--background)] px-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--brand-primary)] focus:bg-[var(--surface)]"
          />
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            <FilterButton active={statusFilter === "all"} label={copy.all} onClick={() => setStatusFilter("all")} />
            <FilterButton active={statusFilter === "pending"} label={copy.pending} onClick={() => setStatusFilter("pending")} />
            <FilterButton active={statusFilter === "approved"} label={copy.approved} onClick={() => setStatusFilter("approved")} />
            <FilterButton active={statusFilter === "rejected"} label={copy.rejected} onClick={() => setStatusFilter("rejected")} />
          </div>
        </div>
      </div>

      <div className="p-3">
        {loadState === "loading" ? (
          <div className="flex min-h-56 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
            <Loader2 size={22} className="animate-spin text-[var(--brand-primary)]" />
            <p className="text-sm font-bold text-[var(--text-muted)]">{copy.loading}</p>
          </div>
        ) : loadState === "error" ? (
          <div className="flex min-h-56 flex-col items-center justify-center gap-3 px-6 py-10 text-center">
            <CircleAlert size={22} className="text-[var(--critical)]" />
            <p className="text-sm font-bold text-[var(--text-primary)]">{copy.loadErrorTitle}</p>
            <p className="text-xs text-[var(--text-muted)]">{loadError}</p>
            <button
              type="button"
              onClick={loadRequests}
              className="mt-1 rounded-lg border border-[var(--border-default)] px-3 py-1.5 text-xs font-bold text-[var(--text-primary)] hover:bg-[var(--surface-muted)]"
            >
              {copy.retry}
            </button>
          </div>
        ) : filteredRequests.length > 0 ? (
          <div className="space-y-2">
            {filteredRequests.map((request) => (
              <RequestListItem
                key={request.id}
                request={request}
                selected={selectedRequestId === request.id}
                locale={locale}
                onClick={() => setSelectedRequestId(request.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-56 flex-col items-center justify-center px-6 py-10 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-muted)] text-[var(--text-muted)]">
              <Search size={20} />
            </span>
            <p className="mt-4 text-sm font-bold text-[var(--text-primary)]">{copy.noRequests}</p>
          </div>
        )}
      </div>
    </article>
  );
}