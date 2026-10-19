import { Plus } from "lucide-react";

type PageHeaderProps = {
  copy: any;
  loadState: string;
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PageHeader({ copy, loadState, setShowForm }: PageHeaderProps) {
  return (
    <header className="mb-6 flex items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-black text-[var(--text-primary)]">{copy.pageTitle}</h1>
        <p className="mt-1 text-sm text-[var(--text-muted)]">{copy.pageDescription}</p>
      </div>
      {loadState === "loaded" && (
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand-primary)] px-4 py-2.5 text-sm font-extrabold text-white hover:bg-[var(--brand-hover)]"
        >
          <Plus size={16} />
          {copy.addPolicy}
        </button>
      )}
    </header>
  );
}