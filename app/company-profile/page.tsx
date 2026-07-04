import Link from "next/link";

export default function ExecutiveRoleSelectionPage() {
  const roles = [
    {
      icon: "🏢",
      title: "مالك الشركة / المؤسس",
      subtitle: "Owner / Founder",
      focus:
        "سأركز على بناء قيمة الشركة، التوسع، الاستثمار، والاستعداد للنمو.",
      color: "from-amber-500 to-orange-500",
    },
    {
      icon: "🎯",
      title: "الرئيس التنفيذي",
      subtitle: "Chief Executive Officer (CEO)",
      focus:
        "سأركز على القرارات الاستراتيجية، النمو، المخاطر، والعائد على الاستثمار.",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: "👥",
      title: "مدير الموارد البشرية",
      subtitle: "CHRO / HR Director",
      focus:
        "سأركز على الموظفين، السياسات، التوظيف، تجربة الموظف، والامتثال.",
      color: "from-sky-500 to-blue-600",
    },
    {
      icon: "⚙️",
      title: "مدير العمليات",
      subtitle: "COO",
      focus:
        "سأركز على العمليات اليومية، الكفاءة، الاختناقات، وتحسين الأداء.",
      color: "from-violet-500 to-purple-600",
    },
    {
      icon: "💰",
      title: "المدير المالي",
      subtitle: "Chief Financial Officer",
      focus:
        "سأركز على التكاليف، الربحية، التدفقات النقدية، ومؤشرات الأداء المالية.",
      color: "from-green-500 to-emerald-600",
    },
    {
      icon: "💻",
      title: "مدير التقنية",
      subtitle: "CIO / CTO",
      focus:
        "سأركز على الأنظمة، الأمن السيبراني، التكاملات، والجاهزية التقنية.",
      color: "from-cyan-500 to-indigo-600",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">

        {/* Hero */}

        <section className="text-center">

          <div className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-sm font-semibold text-emerald-300">
            KAFU Executive AI
          </div>

          <h1 className="mt-8 text-5xl font-black leading-tight lg:text-6xl">
            أهلاً بك في كفو
          </h1>

          <p className="mt-5 text-2xl text-slate-300">
            مستشارك التنفيذي الذكي لاتخاذ القرارات وتحليل الأعمال.
          </p>

          <p className="mx-auto mt-8 max-w-4xl text-lg leading-9 text-slate-400">
            قبل أن نبدأ، أحتاج أن أعرف من تمثل داخل المؤسسة.
            <br />
            سأغيّر طريقة الحوار، الأسئلة، التحليلات، والمؤشرات بالكامل
            بحسب مسؤولياتك التنفيذية.
          </p>

        </section>

        {/* Cards */}

        <section className="mt-16 grid gap-7 md:grid-cols-2 xl:grid-cols-3">

          {roles.map((role) => (

            <Link
              key={role.title}
              href="/assessment"
              className="group overflow-hidden rounded-3xl border border-slate-700 bg-slate-900/60 transition duration-300 hover:-translate-y-2 hover:border-emerald-500 hover:shadow-2xl hover:shadow-emerald-500/10"
            >

              <div className={`h-2 bg-gradient-to-r ${role.color}`} />

              <div className="p-8">

                <div className="text-5xl">
                  {role.icon}
                </div>

                <h2 className="mt-6 text-2xl font-bold">
                  {role.title}
                </h2>

                <p className="mt-2 text-sm font-semibold text-emerald-400">
                  {role.subtitle}
                </p>

                <p className="mt-6 leading-8 text-slate-300">
                  {role.focus}
                </p>

                <div className="mt-8 flex items-center justify-between rounded-2xl bg-slate-800 px-5 py-4 transition group-hover:bg-emerald-500 group-hover:text-white">
                  <span className="font-semibold">
                    بدء الجلسة بهذا الدور
                  </span>

                  <span className="text-xl">
                    →
                  </span>
                </div>

              </div>

            </Link>

          ))}

        </section>

        {/* Bottom */}

        <section className="mt-16 rounded-3xl border border-slate-700 bg-slate-900/60 p-10">

          <h3 className="text-3xl font-bold">
            لماذا نبدأ بهذه الخطوة؟
          </h3>

          <div className="mt-6 space-y-5 text-lg leading-9 text-slate-300">

            <p>
              لأن المدير التنفيذي لا يرى المؤسسة بالطريقة نفسها التي يراها
              مدير الموارد البشرية أو المدير المالي.
            </p>

            <p>
              KAFU لا يقدم إجابات عامة، بل يبني جلسة استشارية مختلفة لكل
              مسؤول داخل الشركة.
            </p>

            <p className="font-semibold text-emerald-300">
              بمجرد اختيار دورك، سأتكيف مع طريقة تفكيرك وأبدأ جلسة تناسب
              مسؤولياتك وقراراتك.
            </p>

          </div>

        </section>

      </div>
    </main>
  );
}