export default function CompanyInsight() {
  const insights = [
    { label: "النطاق", value: "تشغيلي / إداري" },
    { label: "التركيز", value: "جاهزية وتحسين" },
    { label: "المرحلة", value: "تحليل أولي" },
  ];

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-500">رؤية الشركة</p>

          <h2 className="mt-3 text-2xl font-black text-slate-950 md:text-3xl">
            قراءة ذكية لوضع الشركة الحالي
          </h2>

          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600 md:text-base">
            تعرض هذه البطاقة ملخصًا سريعًا عن وضع الشركة بناءً على بيانات
            التسجيل والإجابات الأولية، لتساعد الإدارة على فهم مستوى الجاهزية،
            أهم المخاطر، وأولويات التحسين.
          </p>
        </div>

        <div className="grid min-w-full gap-3 sm:grid-cols-3 lg:min-w-[520px]">
          {insights.map((item) => (
            <div key={item.label} className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs font-medium text-slate-500">{item.label}</p>
              <p className="mt-2 font-black text-slate-950">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}