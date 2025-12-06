import Link from "next/link";
import { categories } from "@/config/data";

type Params = { params: Promise<{ category: string }> };

export default async function CatalogCategoryPage({ params }: Params) {
  const { category: categorySlug } = await params;
  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-2xl font-semibold text-slate-900">Категория не найдена</h1>
        <Link href="/catalog" className="mt-4 inline-block text-sm font-semibold text-slate-900">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 space-y-10">
      <div className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Каталог</p>
        <h1 className="text-3xl font-semibold text-slate-900">{category.title}</h1>
        <p className="text-slate-600">{category.note}</p>
        <Link href="/catalog" className="text-sm font-semibold text-slate-900 hover:text-slate-700">
          ← Все категории
        </Link>
      </div>

      {category.subcategories?.length ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Подкатегории</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {category.subcategories.map((sub) => (
              <div key={sub} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                <span>{sub}</span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {category.products?.length ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Примеры товаров</h2>
            <Link href="/contacts" className="text-sm font-semibold text-slate-900 hover:text-slate-700">
              Запросить КП
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {category.products.map((prod) => (
              <Link
                key={prod.slug}
                href={`/catalog/${category.slug}/${prod.slug}`}
                className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {prod.badge ? (
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800">
                    {prod.badge}
                  </span>
                ) : null}
                <div className="mt-3 text-lg font-semibold text-slate-900">{prod.title}</div>
                {prod.status ? (
                  <div className="mt-2 text-sm text-slate-600">Статус: {prod.status}</div>
                ) : null}
                <div className="mt-4 text-sm font-semibold text-slate-900 hover:text-slate-700">
                  Подробнее →
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <div className="rounded-3xl border border-slate-200 bg-slate-900 px-6 py-8 text-white shadow-sm">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <h3 className="text-xl font-semibold">Нужна консультация по {category.title.toLowerCase()}?</h3>
            <p className="mt-2 text-sm text-slate-200">
              Свяжемся, уточним совместимость и подберем модели в наличии или на заказ.
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

