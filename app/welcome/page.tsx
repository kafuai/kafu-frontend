import Link from "next/link";

export default function WelcomePage() {
  const outcomes = [
    "فهم تنفيذي لواقع المؤسسة",
    "الملف الجيني للمؤسسة (Corporate DNA)",
    "تحديد فرص الأتمتة ذات الأولوية",
    "اقتراح القوى العاملة الرقمية (Digital Workforce)",
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white" dir="rtl">
      <section className="mx-auto flex min-h-screen max-w-6xl items-center px-8 py-16">
        <div className="w-full rounded-[2rem] border border-white/10 bg-white/5 p-10 shadow-2xl">
          <div className="mb-8 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-2 text-sm font-bold text-emerald-300">
            الجلسة التنفيذية • Executive Consultation
          </div>

          <h1 className="max-w-4xl text-5xl font-bold leading-tight md:text-6xl">
            أهلاً بك في جلسة كفو التنفيذية
          </h1>

          <p className="mt-6 max-w-4xl text-xl leading-10 text-slate-300">
            أنا كفو، المستشار التنفيذي الرقمي (Executive AI Advisor). قبل أن
            أقترح أي حلول أو أوصي بأي أتمتة، سأبدأ بفهم مؤسستكم، أهدافها،
            والتحديات الحالية. بنهاية هذه الجلسة سأبني تصورًا أوليًا يتضمن
            الملف الجيني للمؤسسة (Corporate DNA)، وأقترح القوى العاملة الرقمية
            (Digital Workforce) التي تحقق أكبر أثر ممكن.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6">
              <p className="text-sm font-bold text-emerald-300">
                مدة الجلسة التنفيذية
              </p>

              <h2 className="mt-4 text-4xl font-bold">10–15 دقيقة</h2>

              <p className="mt-4 leading-7 text-slate-400">
                جلسة مركزة لفهم المؤسسة وبناء التقييم التنفيذي الأولي.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 lg:col-span-2">
              <p className="text-sm font-bold text-emerald-300">
                ما الذي ستحصل عليه بنهاية الجلسة؟
              </p>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {outcomes.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-white/5 p-4 text-slate-200"
                  >
                    ✅ {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-6">
            <p className="font-bold text-emerald-300">مبدأ كفو</p>

            <p className="mt-3 leading-8 text-slate-300">
              لا أبدأ من الحلول، بل أبدأ من فهم مؤسستكم. لأن الحل الحقيقي لا
              يُقاس بمدى ذكائه، بل بقدرته على معالجة المشكلة الفعلية وتحقيق أثر
              يمكن قياسه.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="max-w-2xl leading-8 text-slate-400">
              جميع المعلومات التي تتم مشاركتها خلال الجلسة تعامل بسرية، وتستخدم
              فقط لبناء تصور عملي مناسب لواقع مؤسستكم.
            </p>

            <Link
              href="/company-profile"
              className="rounded-2xl bg-emerald-600 px-10 py-4 text-center text-lg font-bold text-white transition hover:bg-emerald-700"
            >
              ابدأ الجلسة التنفيذية
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}