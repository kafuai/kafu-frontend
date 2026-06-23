import Link from "next/link";

export default function WelcomePage() {
  return (
    <main
      className="min-h-screen bg-slate-50 flex items-center justify-center p-8"
      dir="rtl"
    >
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl p-12 text-center">
        <div className="mb-6">
          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
            KAFU Discovery Journey
          </span>
        </div>

        <h1 className="text-5xl font-bold text-slate-900 mb-6">
          أهلاً بك في كفو
        </h1>

        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
          خلال أقل من 10 دقائق سنقوم بالتعرف على شركتك وبناء فريقك الرقمي
          المتخصص في الموارد البشرية.
        </p>

        <div className="bg-slate-100 rounded-2xl p-8 mb-10">
          <h2 className="text-2xl font-bold mb-4">ماذا سيحدث؟</h2>

          <ul className="space-y-4 text-lg text-slate-700">
            <li>✅ التعرف على شركتك</li>
            <li>✅ تحليل احتياجات الموارد البشرية</li>
            <li>✅ اقتراح الوكلاء المناسبين</li>
            <li>✅ بناء فريق كفو الرقمي</li>
          </ul>
        </div>

        <Link
          href="/company-profile"
          className="inline-block bg-green-600 hover:bg-green-700 text-white px-10 py-4 rounded-xl text-xl font-bold transition"
        >
          ابدأ بناء فريقي الرقمي
        </Link>
      </div>
    </main>
  );
}