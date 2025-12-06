import Link from "next/link";
import { categories } from "@/config/data";

export default function CatalogPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Каталог</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">Оборудование и аксессуары</h1>
          <p className="mt-3 text-slate-600">
            Структура каталога на основе референса ray-systems.ru — датчики, сканеры, насадки, запасные части и спецпредложения.
          </p>
        </div>
        <Link
          href="/contacts"
          className="hidden rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 md:inline-flex"
        >
          Запросить прайс
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {categories.map((item) => (
          <div
            key={item.slug}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-lg font-semibold text-slate-900">{item.title}</div>
                <div className="mt-1 text-sm text-slate-600">{item.note}</div>
              </div>
              <Link
                href={`/catalog/${item.slug}`}
                className="text-sm font-semibold text-slate-900 hover:text-slate-700"
              >
                Смотреть →
              </Link>
            </div>
            {item.subcategories && (
              <div className="mt-4 space-y-1 text-sm text-slate-600">
                {item.subcategories.map((sub) => (
                  <div key={sub} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                    <span>{sub}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-900 px-6 py-8 text-white shadow-sm">
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

