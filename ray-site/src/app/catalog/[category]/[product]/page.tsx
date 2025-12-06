import Image from "next/image";
import Link from "next/link";
import { categories } from "@/config/data";

type Params = { params: Promise<{ category: string; product: string }> };

export default async function ProductPage({ params }: Params) {
  const { category, product: productSlug } = await params;
  const categoryData = categories.find((c) => c.slug === category);
  const product = categoryData?.products?.find((p) => p.slug === productSlug);

  if (!categoryData || !product) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-2xl font-semibold text-slate-900">Товар не найден</h1>
        <Link href="/catalog" className="mt-4 inline-block text-sm font-semibold text-slate-900">
          Вернуться в каталог
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 space-y-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-10">
        <div className="w-full md:w-1/2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <Image
              src={product.image || "https://via.placeholder.com/900x540?text=Product"}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
        </div>
        <div className="flex-1 space-y-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Каталог · {categoryData.title}</p>
            <h1 className="text-3xl font-semibold text-slate-900">{product.title}</h1>
            <p className="text-sm text-slate-600">{product.desc}</p>
          </div>

          <div className="flex flex-wrap gap-3 text-sm">
            {product.badge ? (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 font-semibold text-slate-800">
                {product.badge}
              </span>
            ) : null}
            {product.status ? (
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-800">
                {product.status}
              </span>
            ) : null}
          </div>

          {product.tags?.length ? (
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
              {product.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-3 py-1">
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          <div className="space-y-2 text-sm text-slate-600">
            <div>Совместимость и доступность уточняем по запросу.</div>
            <div>Сервис: тестирование и гарантия сервисного центра.</div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/contacts"
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Получить КП
            </Link>
            <Link
              href="/catalog"
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 hover:border-slate-400"
            >
              В каталог
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-900 px-6 py-8 text-white shadow-sm">
        <div className="grid gap-6 md:grid-cols-2 md:items-center">
          <div>
            <h3 className="text-xl font-semibold">Нужна консультация по {product.title}?</h3>
            <p className="mt-2 text-sm text-slate-200">
              Подберем совместимость с вашим аппаратом, уточним наличие и предложим аналог, если требуется.
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

