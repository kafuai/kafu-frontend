import { supabase } from "@/lib/supabase";

export default async function TestDbPage() {
  const { data, error } = await supabase
    .from("companies")
    .select("*");

  return (
    <main className="min-h-screen p-10">
      <h1 className="text-4xl font-bold mb-8">
        Database Test
      </h1>

      <pre className="bg-slate-100 p-6 rounded-xl overflow-auto">
        {JSON.stringify(
          {
            data,
            error,
          },
          null,
          2
        )}
      </pre>
    </main>
  );
}