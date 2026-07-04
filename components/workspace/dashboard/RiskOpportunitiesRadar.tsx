export default function RiskOpportunitiesRadar() {
  const risks = [
    {
      title: "بطء الموافقات",
      level: "مرتفع",
      score: "78%",
      owner: "الإدارة التنفيذية",
      action: "تقليل دورة الموافقة",
    },
    {
      title: "اعتماد عالي على المعالجة اليدوية",
      level: "متوسط",
      score: "61%",
      owner: "العمليات",
      action: "أتمتة الطلبات المتكررة",
    },
    {
      title: "تشتت بيانات الموظفين",
      level: "متوسط",
      score: "54%",
      owner: "الموارد البشرية",
      action: "توحيد مصدر البيانات",
    },
  ];

  const opportunities = [
    {
      title: "أتمتة طلبات الموظفين",
      impact: "أثر عالي",
      value: "تقليل وقت المعالجة بنسبة 35%",
      action: "ابدأ بمسار الإجازات والخطابات",
    },
    {
      title: "تفعيل تقارير تنفيذية أسبوعية",
      impact: "Quick Win",
      value: "رفع وضوح القرارات للإدارة",
      action: "توليد تقرير أسبوعي تلقائي",
    },
    {
      title: "تحسين تجربة المدير المباشر",
      impact: "استراتيجي",
      value: "تسريع الموافقات اليومية",
      action: "لوحة موافقات مختصرة للمدير",
    },
  ];

  return (
    <section className="grid gap-6 xl:grid-cols-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black text-rose-500">Risk Radar</p>

            <h2 className="mt-3 text-3xl font-black text-slate-950">
              المخاطر التنفيذية
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
              مؤشرات خطر تحتاج متابعة إدارية قبل أن تتحول إلى عوائق تشغيلية.
            </p>
          </div>

          <span className="rounded-full bg-rose-50 px-4 py-2 text-xs font-black text-rose-600">
            3 مخاطر
          </span>
        </div>

        <div className="mt-8 space-y-4">
          {risks.map((risk) => (
            <div
              key={risk.title}
              className="rounded-3xl border border-rose-100 bg-rose-50/60 p-5 transition hover:bg-white hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    {risk.title}
                  </h3>

                  <p className="mt-2 text-sm font-bold text-slate-500">
                    المسؤول: {risk.owner}
                  </p>
                </div>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-rose-600">
                  {risk.level}
                </span>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white">
                <div
                  className="h-full rounded-full bg-rose-500"
                  style={{ width: risk.score }}
                />
              </div>

              <div className="mt-4 flex items-center justify-between gap-4">
                <p className="text-xs font-black text-slate-500">
                  احتمالية الخطر: {risk.score}
                </p>

                <p className="text-xs font-black text-rose-600">
                  {risk.action}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-black text-emerald-600">
              Opportunity Radar
            </p>

            <h2 className="mt-3 text-3xl font-black text-slate-950">
              فرص التحسين
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-slate-500">
              فرص قصيرة ومتوسطة المدى يمكن تحويلها إلى مبادرات تنفيذية واضحة.
            </p>
          </div>

          <span className="rounded-full bg-emerald-50 px-4 py-2 text-xs font-black text-emerald-700">
            3 فرص
          </span>
        </div>

        <div className="mt-8 space-y-4">
          {opportunities.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-5 transition hover:bg-white hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-950">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm font-bold text-slate-500">
                    {item.value}
                  </p>
                </div>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-emerald-700">
                  {item.impact}
                </span>
              </div>

              <div className="mt-5 rounded-2xl bg-white p-4">
                <p className="text-xs font-bold text-slate-400">
                  الإجراء المقترح
                </p>

                <p className="mt-1 text-sm font-black text-slate-700">
                  {item.action}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}