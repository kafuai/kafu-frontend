import Link from "next/link";

export default function DigitalWorkforcePage() {
  const team = [
    {
      title: "مدير تجربة الموظف الذكي",
      subtitle: "Employee Experience Manager",
      desc: "يدير طلبات الموظفين اليومية مثل الإجازات والخطابات والاستفسارات.",
    },
    {
      title: "مستشار المواهب الذكي",
      subtitle: "Talent Acquisition Advisor",
      desc: "يدعم استقطاب المواهب وتحليل المرشحين قبل المقابلات.",
    },
    {
      title: "مسؤول الوثائق والسياسات الذكي",
      subtitle: "Documents & Policies Advisor",
      desc: "يبحث داخل السياسات واللوائح وينشئ الخطابات والنماذج.",
    },
    {
      title: "مسؤول التوطين الذكي",
      subtitle: "Localization Intelligence Advisor",
      desc: "يتابع مؤشرات التوطين وينبه الإدارة للمخاطر المحتملة.",
    },
    {
      title: "مسؤول الامتثال الذكي",
      subtitle: "Compliance Intelligence Advisor",
      desc: "يساعد في متابعة الالتزام بالسياسات والمتطلبات التنظيمية.",
    },
    {
      title: "مدير الموارد البشرية التنفيذي الذكي",
      subtitle: "Executive HR Advisor",
      desc: "يعرض ملخصات تنفيذية ومؤشرات استراتيجية للإدارة.",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 p-8" dir="rtl">
      <section className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <span className="rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
            KAFU Digital Workforce
          </span>

          <h1 className="mt-6 text-5xl font-bold text-slate-900">
            تم بناء فريق كفو الرقمي
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-xl leading-9 text-slate-600">
            بناءً على احتياجات شركتك، يقترح كفو فريقاً رقمياً متخصصاً يعمل
            بجانب إدارة الموارد البشرية.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <div
              key={member.title}
              className="rounded-3xl border bg-white p-8 shadow-sm"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-2xl text-white">
                👤
              </div>

              <h2 className="text-2xl font-bold text-slate-900">
                {member.title}
              </h2>

              <p className="mt-2 text-sm font-semibold text-cyan-700">
                {member.subtitle}
              </p>

              <p className="mt-5 leading-8 text-slate-600">
                {member.desc}
              </p>

              <div className="mt-6 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
                جاهز للتفعيل
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/command-center"
            className="inline-block rounded-2xl bg-slate-900 px-10 py-4 text-lg font-bold text-white"
          >
            الانتقال إلى مركز قيادة الموارد البشرية
          </Link>
        </div>
      </section>
    </main>
  );
}