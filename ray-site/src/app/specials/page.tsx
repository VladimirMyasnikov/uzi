import Link from "next/link";
import { specialsList } from "@/config/data";

export default function SpecialsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Акции</p>
          <h1 className="text-3xl font-semibold text-slate-900 mt-2">Специальные предложения</h1>
          <p className="text-slate-600 mt-3">
            Примеры основаны на контенте ray-systems.ru, далее подменим на актуальные.
          </p>
        </div>
        <Link
          href="/contacts"
          className="hidden rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 md:inline-flex"
        >
          Получить КП
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {specialsList.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              {item.badge}
            </span>
            <div className="mt-3 text-lg font-semibold text-slate-900">{item.title}</div>
            <button className="mt-4 text-sm font-semibold text-slate-900 hover:text-slate-700">
              Подробнее →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

