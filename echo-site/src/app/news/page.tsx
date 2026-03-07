import { newsList } from "@/config/data";

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 space-y-8">
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Новости</p>
        <h1 className="text-3xl font-semibold text-slate-900">Новости и статьи</h1>
        <p className="text-slate-600">
          Примерные записи; позже заменим на актуальные материалы.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {newsList.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="text-xs uppercase tracking-wide text-slate-500">{item.date}</div>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">{item.title}</h2>
            <button className="mt-4 text-sm font-semibold text-slate-900 hover:text-slate-700">
              Читать →
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

