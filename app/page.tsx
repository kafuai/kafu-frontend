import Link from "next/link";

export default function Home() {
  const capabilities = [
    {
      title: "التقييم التنفيذي",
      term: "Executive Assessment",
      desc: "يفهم كفو سياق المؤسسة قبل اقتراح أي حل.",
    },
    {
      title: "الملف الجيني للمؤسسة",
      term: "Corporate DNA",
      desc: "يبني صورة تشغيلية عن الهوية، التحديات، والفرص.",
    },
    {
      title: "العقل المؤسسي",
      term: "Corporate Brain",
      desc: "يوحد المعرفة والسياسات لتصبح قابلة للاستخدام.",
    },
    {
      title: "القوى العاملة الرقمية",
      term: "Digital Workforce",
      desc: "يقترح وكلاء رقميين متخصصين حسب احتياج المؤسسة.",
    },
    {
      title: "مركز القيادة",
      term: "Command Center",
      desc: "يراقب الوكلاء، المهام، التنبيهات، والأنشطة.",
    },
    {
      title: "لوحة القيادة التنفيذية",
      term: "Executive Dashboard",
      desc: "يعرض للإدارة العليا المؤشرات، المخاطر، والتوصيات.",
    },
  ];

  const journey = [
    "يفهم كفو المؤسسة من خلال جلسة استكشاف تنفيذية.",
    "يبني الملف الجيني للمؤسسة (Corporate DNA).",
    "ينشئ العقل المؤسسي (Corporate Brain).",
    "يقترح القوى العاملة الرقمية (Digital Workforce).",
    "يشغل مركز القيادة ولوحة الإدارة التنفيذية.",
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="text-2xl font-bold text-slate-900">كفو AI</div>

          <nav className="hidden gap-8 text-sm font-bold text-slate-600 md:flex">
            <a>الرئيسية</a>
            <a>المنصة</a>
            <a>القوى العاملة الرقمية</a>
            <a>رحلة كفو</a>
            <a>تواصل معنا</a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="text-sm font-bold text-slate-700">
              تسجيل الدخول
            </button>

            <Link
              href="/welcome"
              className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              ابدأ الجلسة التنفيذية
            </Link>
          </div>
        </div>
      </header>

      <section className="px-6 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-5 inline-flex rounded-full bg-emerald-50 px-5 py-2 text-sm font-bold text-emerald-700">
              منصة ذكاء تنفيذي تبدأ بالموارد البشرية
            </p>

            <h1 className="mb-6 text-5xl font-bold leading-tight text-slate-900 md:text-6xl">
              كفو يحوّل فهم المؤسسة إلى قرارات ووكلاء رقميين
            </h1>

            <p className="mb-8 max-w-2xl text-xl leading-9 text-slate-600">
              كفو AI يساعد الإدارة على فهم واقع المؤسسة، بناء الملف الجيني
              للمؤسسة (Corporate DNA)، إنشاء العقل المؤسسي (Corporate Brain)،
              ثم اقتراح القوى العاملة الرقمية (Digital Workforce) المناسبة.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/welcome"
                className="rounded-2xl bg-emerald-600 px-8 py-4 text-center font-bold text-white shadow-sm transition hover:bg-emerald-700"
              >
                ابدأ الجلسة التنفيذية
              </Link>

              <Link
                href="/journey"
                className="rounded-2xl border border-slate-300 bg-white px-8 py-4 text-center font-bold text-slate-800 transition hover:bg-slate-50"
              >
                استعراض رحلة كفو
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="mb-5 rounded-3xl bg-slate-900 p-6 text-white">
              <p className="font-bold text-emerald-300">
                جلسة الاستكشاف التنفيذية
              </p>

              <p className="mt-1 text-sm text-slate-300">
                Executive Discovery Session
              </p>

              <h2 className="mt-5 text-3xl font-bold">
                أهلاً، أنا كفو.
              </h2>

              <p className="mt-4 leading-8 text-slate-300">
                لن أبدأ بتقديم حلول جاهزة. سأفهم مؤسستكم أولاً، ثم أوصي
                بما يمكن تنفيذه وتحقيق أثر واضح.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "ما أكثر تحديات الإدارة التنفيذية اليوم؟",
                "ما أكثر إجراء يستهلك وقت فريق الموارد البشرية؟",
                "ما الأنظمة الحالية مثل قوى، مدد، أو نظام تخطيط الموارد (ERP)؟",
                "ما المؤشر الذي سيجعل المبادرة ناجحة خلال 12 شهرًا؟",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-slate-50 p-4 text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>
                
            <div className="mt-5 rounded-2xl bg-emerald-50 p-4 font-bold text-emerald-800">
              النتيجة: فهم تنفيذي، Corporate DNA، وتوصية أولية بالفريق الرقمي.
            </div>
            
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="font-bold text-emerald-700">قدرات كفو</p>

            <h2 className="mt-3 text-4xl font-bold text-slate-900">
              من الاستكشاف إلى التشغيل التنفيذي
            </h2>

            <p className="mx-auto mt-4 max-w-3xl leading-8 text-slate-600">
              كل قدرة داخل كفو تخدم هدفًا واحدًا: مساعدة الإدارة على اتخاذ
              قرارات أفضل وتحقيق نتائج قابلة للقياس.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((item) => (
              <div
                key={item.title}
                className="rounded-3xl border bg-white p-7 shadow-sm"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-xl">
                  ✅
                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm font-bold text-emerald-700">
                  {item.term}
                </p>

                <p className="mt-4 leading-7 text-slate-600">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl rounded-3xl bg-slate-900 p-10 text-white md:p-16">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="font-bold text-emerald-300">
                رحلة العميل الجديدة
              </p>

              <h2 className="mt-4 text-4xl font-bold leading-tight">
                بدلاً من عرض تقليدي، يبدأ كفو بفهم المؤسسة أولاً
              </h2>

              <p className="mt-6 leading-8 text-slate-300">
                خلال دقائق، يقود كفو جلسة تنفيذية لفهم المؤسسة، ثم يبني
                توصيات عملية يمكن تحويلها إلى خطة تشغيل وفريق رقمي.
              </p>
            </div>

            <div className="grid gap-4">
              {journey.map((step, index) => (
                <div key={step} className="rounded-2xl bg-white/10 p-5">
                  <span className="font-bold text-emerald-300">
                    {index + 1}.
                  </span>{" "}
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 text-center">
        <h2 className="mx-auto max-w-3xl text-4xl font-bold leading-tight text-slate-900">
          جاهز لبناء أول فريق رقمي لمؤسستك؟
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          ابدأ الجلسة التنفيذية مع كفو، ودع المنصة تحول المعلومات إلى فهم،
          والفهم إلى توصيات، والتوصيات إلى تشغيل.
        </p>

        <Link
          href="/welcome"
          className="mt-8 inline-block rounded-2xl bg-emerald-600 px-10 py-4 font-bold text-white transition hover:bg-emerald-700"
        >
          ابدأ الجلسة التنفيذية
        </Link>
      </section>

      <footer className="border-t bg-white px-6 py-8 text-center text-slate-500">
        © 2026 KAFU AI. جميع الحقوق محفوظة.
      </footer>
    </main>
  );
}