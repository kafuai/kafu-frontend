export default function CommandCenterPage() {
  return (
    <main
      className="min-h-screen bg-slate-100 p-8"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <span className="bg-cyan-100 text-cyan-700 px-4 py-2 rounded-full text-sm font-semibold">
            KAFU Command Center
          </span>

          <h1 className="text-5xl font-bold mt-6 text-slate-900">
            مركز قيادة كفو
          </h1>

          <p className="mt-4 text-xl text-slate-600">
            لوحة القيادة الذكية لإدارة الموارد البشرية.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-10">

          <div className="bg-white rounded-3xl p-6 shadow">
            <h3 className="text-slate-500">الموظفون</h3>
            <p className="text-4xl font-bold mt-2">245</p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow">
            <h3 className="text-slate-500">معدل التوطين</h3>
            <p className="text-4xl font-bold mt-2 text-green-600">
              87%
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow">
            <h3 className="text-slate-500">طلبات الموظفين</h3>
            <p className="text-4xl font-bold mt-2">
              12
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow">
            <h3 className="text-slate-500">وظائف مفتوحة</h3>
            <p className="text-4xl font-bold mt-2">
              8
            </p>
          </div>

        </div>

        <div className="grid lg:grid-cols-2 gap-8">

          <div className="bg-white rounded-3xl p-8 shadow">

            <h2 className="text-2xl font-bold mb-6">
              الوكلاء النشطون
            </h2>

            <div className="space-y-4">

              <div className="p-4 rounded-xl bg-slate-50">
                مدير تجربة الموظف الذكي
              </div>

              <div className="p-4 rounded-xl bg-slate-50">
                مستشار المواهب الذكي
              </div>

              <div className="p-4 rounded-xl bg-slate-50">
                مسؤول التوطين الذكي
              </div>

              <div className="p-4 rounded-xl bg-slate-50">
                مسؤول الامتثال الذكي
              </div>

              <div className="p-4 rounded-xl bg-slate-50">
                المدير التنفيذي للموارد البشرية الذكي
              </div>

            </div>

          </div>

          <div className="bg-white rounded-3xl p-8 shadow">

            <h2 className="text-2xl font-bold mb-6">
              التنبيهات الذكية
            </h2>

            <div className="space-y-4">

              <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
                مراجعة نسبة التوطين خلال 30 يوماً.
              </div>

              <div className="p-4 rounded-xl bg-red-50 border border-red-200">
                3 عقود تحتاج تحديثاً.
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                12 طلب موظف بانتظار المعالجة.
              </div>

            </div>

          </div>

        </div>

      </div>
    </main>
  );
}