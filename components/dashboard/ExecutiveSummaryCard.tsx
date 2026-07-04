type ExecutiveSummaryCardProps = {
  summary: string;
};

export default function ExecutiveSummaryCard({
  summary,
}: ExecutiveSummaryCardProps) {
  return (
    <div className="rounded-3xl border border-slate-700 bg-white p-8 text-slate-900 shadow-xl lg:col-span-2">
      <h2 className="text-3xl font-bold">Executive Summary</h2>

      <p className="mt-4 max-w-5xl text-lg leading-9 text-slate-600">
        {summary}
      </p>
    </div>
  );
}