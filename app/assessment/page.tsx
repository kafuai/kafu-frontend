import Link from "next/link";

export default function AssessmentPage() {
  return (
    <main
      className="min-h-screen bg-slate-50 flex items-center justify-center p-8"
      dir="rtl"
    >
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl p-12">
        <div className="text-center mb-10">
          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
            KAFU HR Assessment
          </span>

          <h1 className="text-5xl font-bold text-slate-900 mt-6 mb-4">
            تقييم احتياجات الموارد البشرية
          </h1>

          <p className="text-xl text-slate-600">
            ساعد كفو على فهم أولويات شركتك واقتراح الفريق الرقمي المناسب.
          </p>
        </div>

        <div className="space-y-8">
          <div>
            <label className="block mb-3 font-bold text-lg">
              ما أكبر تحدي تواجهه حالياً؟
            </label>

            <div className="space-y-3">
              <label className="block">
                <input type="checkbox" className="ml-2" />
                التوظيف واستقطاب المواهب
              </label>

              <label className="block">
                <input type="checkbox" className="ml-2" />
                خدمات الموظفين
              </label>

              <label className="block">
                <input type="checkbox" className="ml-2" />
                إدارة الوثائق والسياسات
              </label>

              <label className="block">
                <input type="checkbox" className="ml-2" />
                الامتثال والحوكمة
              </label>

              <label className="block">
                <input type="checkbox" className="ml-2" />
                التوطين وإدارة نسب السعودة
              </label>
            </div>
          </div>

          <div>
            <label className="block mb-3 font-bold text-lg">
              الأنظمة المستخدمة حالياً
            </label>

            <div className="space-y-3">
              <label className="block">
                <input type="checkbox" className="ml-2" />
                قوى
              </label>

              <label className="block">
                <input type="checkbox" className="ml-2" />
                مدد
              </label>

              <label className="block">
                <input type="checkbox" className="ml-2" />
                ERP
              </label>

              <label className="block">
                <input type="checkbox" className="ml-2" />
                SAP
              </label>

              <label className="block">
                <input type="checkbox" className="ml-2" />
                لا يوجد نظام حالياً
              </label>
            </div>
          </div>

          <div>
            <label className="block mb-3 font-bold text-lg">
              هل ترغب في أتمتة العمليات باستخدام الذكاء الاصطناعي؟
            </label>

            <select className="w-full border rounded-xl p-4">
              <option>نعم</option>
              <option>جزئياً</option>
              <option>أحتاج لمعرفة المزيد</option>
            </select>
          </div>

          <Link
            href="/digital-workforce"
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-bold transition"
          >
            بناء فريقي الرقمي
          </Link>
        </div>
      </div>
    </main>
  );
}