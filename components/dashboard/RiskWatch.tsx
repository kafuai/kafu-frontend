type RiskWatchProps = {
  risks: string[];
};

export default function RiskWatch({ risks }: RiskWatchProps) {
  return (
    <div className="rounded-3xl border border-slate-700 bg-white p-8 text-slate-900 shadow-xl">
      <h2 className="text-3xl font-bold">Risk Watch</h2>

      <div className="mt-6 space-y-4">
        {risks.map((item) => (
          <div
            key={item}
            className="rounded-2xl bg-amber-50 p-4 leading-8 text-amber-950"
          >
            ⚠️ {item}
          </div>
        ))}
      </div>
    </div>
  );
}