export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-8">
      <section className="max-w-4xl text-center">
        <p className="text-cyan-400 font-semibold mb-4">KAFU AI</p>
        <h1 className="text-5xl font-bold mb-6">
          AI Workforce Platform for Modern Companies
        </h1>
        <p className="text-lg text-slate-300 mb-8">
          KAFU AI helps companies automate HR, recruitment, employee services,
          documents, and internal knowledge through intelligent AI agents.
        </p>
        <button className="rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950">
          Start Building
        </button>
      </section>
    </main>
  );
}