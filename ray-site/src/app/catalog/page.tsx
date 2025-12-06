import Link from "next/link";
import { categories } from "@/config/data";

export default function CatalogPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Каталог</p>
          <h1 className="text-3xl font-semibold text-slate-900 mt-2">Оборудование и аксессуары</h1>
          <p className="text-slate-600 mt-3">
            Медицинские и ветеринарные УЗИ сканеры, датчики и биопсийные насадки. Примеры и тексты опираются на контент референса ray-systems.ru, позже подменим на свой.
          </p>
        </div>
        <Link
          href="/contacts"
          className="hidden rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 md:inline-flex"
        >
          Запросить прайс
        </Link>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((item) => (
          <Link
            key={item.slug}
            href={`/catalog/${item.slug}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-lg font-semibold text-slate-900">{item.title}</div>
            <div className="mt-2 text-sm text-slate-600">{item.note}</div>
            <div className="mt-4 text-sm font-semibold text-slate-900">Смотреть →</div>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-3xl border border-slate-200 bg-slate-900 px-6 py-8 text-white shadow-sm">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-2xl font-semibold">Не нашли нужную модель?</h2>
            <p className="mt-2 text-sm text-slate-200">
              Подберем совместимые датчики и предложим аналоги в наличии. Отправьте запрос — ответим быстро.
            </p>
          </div>
          <Link
            href="/contacts"
            className="inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100 md:w-auto"
          >
            Оставить заявку
          </Link>
        </div>
      </div>
    </div>
  );
}

