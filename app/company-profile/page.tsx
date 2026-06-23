import Link from "next/link";

export default function CompanyProfilePage() {
  return (
    <main
      className="min-h-screen bg-slate-50 flex items-center justify-center p-8"
      dir="rtl"
    >
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl p-12">
        <div className="text-center mb-10">
          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
            KAFU Company Profile
          </span>

          <h1 className="text-5xl font-bold text-slate-900 mt-6 mb-4">
            معلومات الشركة
          </h1>

          <p className="text-xl text-slate-600">
            دعنا نتعرف على شركتك لنبني فريق كفو الرقمي المناسب.
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold">اسم الشركة</label>
            <input
              type="text"
              placeholder="مثال: Nexora Solutions"
              className="w-full border rounded-xl p-4"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold">الدولة</label>
            <select className="w-full border rounded-xl p-4">
              <option>المملكة العربية السعودية</option>
              <option>الإمارات العربية المتحدة</option>
              <option>البحرين</option>
              <option>الكويت</option>
              <option>قطر</option>
              <option>الأردن</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold">عدد الموظفين</label>
            <select className="w-full border rounded-xl p-4">
              <option>1 - 50</option>
              <option>51 - 200</option>
              <option>201 - 500</option>
              <option>500+</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-semibold">القطاع</label>
            <select className="w-full border rounded-xl p-4">
              <option>تقنية المعلومات</option>
              <option>المقاولات</option>
              <option>التجزئة</option>
              <option>الخدمات اللوجستية</option>
              <option>التصنيع</option>
              <option>الرعاية الصحية</option>
              <option>أخرى</option>
            </select>
          </div>

          <Link
            href="/assessment"
            className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl text-lg font-bold transition"
          >
            التالي
          </Link>
        </div>
      </div>
    </main>
  );
}