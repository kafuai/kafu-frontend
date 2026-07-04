export default function ExecutiveDecisionBar() {
  const decisions = [
    {
      title: "اعتماد سياسة العمل المرن",
      priority: "عالية",
      waiting: "بانتظارك منذ يومين",
      impact: "أثر مباشر على تجربة الموظفين",
      tone: "border-rose-200 bg-rose-50 text-rose-700",
      dot: "bg-rose-500",
    },
    {
      title: "مراجعة خطة التوظيف",
      priority: "متوسطة",
      waiting: "بانتظارك منذ 6 ساعات",
      impact: "مرتبطة بسرعة التوسع",
      tone: "border-amber-200 bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
    },
    {
      title: "الموافقة على ميزانية التدريب",
      priority: "منخفضة",
      waiting: "بانتظارك منذ 30 دقيقة",
      impact: "تحسين جاهزية الفريق",
      tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
      dot: "bg-emerald-500",
    },
  ];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-black text-slate-500">
            Executive Decision Center
          </p>

          <h2 className="mt-3 text-3xl font-black text-slate-950">
            القرارات التي تحتاج موافقتك
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            قرارات مختصرة، مرتبة حسب الأولوية، مع توضيح الأثر التنفيذي لكل قرار.
          </p>
        </div>

        <button className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800">
          عرض جميع القرارات
        </button>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {decisions.map((decision) => (
          <div
            key={decision.title}
            className="rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-md"
          >
            <div className="flex items-center justify-between gap-3">
              <span
                className={`rounded-full border px-3 py-1 text-xs font-black ${decision.tone}`}
              >
                أولوية {decision.priority}
              </span>

              <span className={`h-3 w-3 rounded-full ${decision.dot}`} />
            </div>

            <h3 className="mt-5 text-xl font-black text-slate-950">
              {decision.title}
            </h3>

            <p className="mt-3 text-sm leading-7 text-slate-600">
              {decision.impact}
            </p>

            <div className="mt-5 rounded-2xl bg-white p-4">
              <p className="text-xs font-bold text-slate-400">حالة القرار</p>
              <p className="mt-1 text-sm font-black text-slate-700">
                {decision.waiting}
              </p>
            </div>

            <div className="mt-5 flex gap-2">
              <button className="flex-1 rounded-2xl bg-slate-950 px-4 py-3 text-xs font-bold text-white transition hover:bg-slate-800">
                مراجعة
              </button>

              <button className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-xs font-bold text-slate-700 transition hover:bg-slate-100">
                لاحقًا
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}