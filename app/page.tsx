import Link from "next/link";

export default function Home() {
  const agents = [
    ["مساعد الموارد البشرية", "يرد على استفسارات الموظفين ويقود الطلبات اليومية."],
    ["مساعد التوظيف", "يفرز السير الذاتية ويدعم قرارات الاختيار والمقابلات."],
    ["مساعد الوثائق والسياسات", "يبحث داخل اللوائح والعقود والنماذج ويولد الخطابات."],
    ["مساعد خدمات الموظفين", "يسهّل طلب الإجازات والخطابات والتحديثات من مكان واحد."],
    ["مساعد المعرفة الداخلية", "يحوّل سياسات الشركة إلى إجابات سهلة وفورية."],
    ["مساعد التقارير والإدارة", "يعرض مؤشرات مختصرة تساعد الإدارة على اتخاذ القرار."],
  ];

  return (
    <main dir="rtl" className="min-h-screen bg-[#f7fafc] text-slate-900">
      <header className="border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="text-2xl font-bold text-[#082f49]">كفو AI</div>

          <nav className="hidden gap-8 text-sm font-medium text-slate-600 md:flex">
            <a>الرئيسية</a>
            <a>الحلول</a>
            <a>الوكلاء الذكيون</a>
            <a>الأسعار</a>
            <a>تواصل معنا</a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="text-sm font-semibold text-slate-700">
              تسجيل الدخول
            </button>

            <Link
              href="/welcome"
              className="rounded-xl bg-[#0f766e] px-5 py-3 text-sm font-semibold text-white"
            >
              ابدأ الآن
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-6 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-5 inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              منصة سعودية الطابع لإدارة الموارد البشرية بالذكاء الاصطناعي
            </p>

            <h1 className="mb-6 text-5xl font-bold leading-tight text-[#082f49] md:text-6xl">
              دع كفو يتعرف على شركتك خلال 10 دقائق
            </h1>

            <p className="mb-8 max-w-2xl text-xl leading-9 text-slate-600">
              كفو يساعد الشركات على أتمتة خدمات الموظفين، التوظيف، الوثائق،
              والسياسات الداخلية عبر وكلاء ذكاء اصطناعي متخصصين يناسبون بيئة
              العمل في السوق السعودي.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/welcome"
                className="rounded-2xl bg-[#0f766e] px-8 py-4 font-bold text-white shadow-sm"
              >
                ابدأ جلسة التعارف مع كفو
              </Link>

              <button className="rounded-2xl border border-slate-300 bg-white px-8 py-4 font-bold text-slate-800">
                شاهد كيف يعمل كفو
              </button>
            </div>
          </div>

          <div className="rounded-3xl border bg-white p-6 shadow-sm">
            <div className="mb-5 rounded-2xl bg-[#082f49] p-5 text-white">
              <p className="text-sm text-cyan-200">KAFU Discovery Session</p>
              <h2 className="mt-2 text-2xl font-bold">أهلاً بك، أنا كفو 👋</h2>
              <p className="mt-3 text-slate-200">
                سأتعرف على شركتك، أحدد تحديات الموارد البشرية، ثم أقترح لك أفضل
                الوكلاء المناسبين.
              </p>
            </div>

            <div className="space-y-4">
              {[
                "كم عدد موظفي شركتك؟",
                "ما أكثر إجراء يستهلك وقت فريق الموارد البشرية؟",
                "هل تستخدمون قوى أو مدد أو نظام ERP؟",
                "ما الهدف الأهم: تقليل الوقت، تحسين الخدمة، أم ضبط الإجراءات؟",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-slate-50 p-4 text-slate-700"
                >
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-emerald-800">
              النتيجة: تقرير فوري يوضح أفضل حلول كفو لشركتك.
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="font-semibold text-emerald-700">وكلاء كفو</p>
            <h2 className="mt-3 text-4xl font-bold text-[#082f49]">
              وكلاء ذكيون يخدمون الموارد البشرية من البداية للنهاية
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {agents.map(([title, description]) => (
              <div
                key={title}
                className="rounded-3xl border bg-white p-7 shadow-sm"
              >
                <div className="mb-5 h-12 w-12 rounded-2xl bg-cyan-50" />
                <h3 className="mb-3 text-xl font-bold text-[#082f49]">
                  {title}
                </h3>
                <p className="leading-7 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl rounded-3xl bg-[#082f49] p-10 text-white md:p-16">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="font-semibold text-cyan-300">رحلة العميل الجديدة</p>
              <h2 className="mt-4 text-4xl font-bold leading-tight">
                بدلاً من حجز ديمو تقليدي، اجعل كفو يحاور العميل أولاً
              </h2>
              <p className="mt-6 leading-8 text-slate-200">
                خلال دقائق قليلة، يفهم كفو حجم الشركة، مشاكل الموارد البشرية،
                الأنظمة المستخدمة، ثم يقدم توصية ذكية تقنع العميل بقيمة المنصة.
              </p>
            </div>

            <div className="grid gap-4">
              {[
                "1. يتعرف كفو على حجم الشركة",
                "2. يحدد أكثر العمليات استهلاكاً للوقت",
                "3. يقترح الوكلاء المناسبين",
                "4. يصدر ملخصاً أولياً للفرص والتوفير المتوقع",
              ].map((step) => (
                <div key={step} className="rounded-2xl bg-white/10 p-5">
                  {step}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 text-center">
        <h2 className="mx-auto max-w-3xl text-4xl font-bold leading-tight text-[#082f49]">
          جاهز لتجربة مستقبل الموارد البشرية؟
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-600">
          ابدأ مع كفو واكتشف كيف يمكن للذكاء الاصطناعي أن يختصر الوقت، يقلل
          الأعمال المتكررة، ويحسن تجربة الموظفين.
        </p>

        <Link
          href="/welcome"
          className="mt-8 inline-block rounded-2xl bg-[#0f766e] px-10 py-4 font-bold text-white"
        >
          ابدأ الآن
        </Link>
      </section>

      <footer className="border-t bg-white px-6 py-8 text-center text-slate-500">
        © 2026 KAFU AI. جميع الحقوق محفوظة.
      </footer>
    </main>
  );
}