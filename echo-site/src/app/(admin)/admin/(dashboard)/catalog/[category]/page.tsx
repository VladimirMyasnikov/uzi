"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CatalogProduct } from "@/lib/catalog-loader";

export default function AdminCatalogCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const [category, setCategory] = useState<string>("");
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newSlug, setNewSlug] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);

  const load = (cat: string) => {
    setError(null);
    return fetch(
      `/api/admin/catalog/categories/${encodeURIComponent(cat)}/products`
    )
      .then((res) => {
        if (!res.ok) return res.json().then((body) => Promise.reject(new Error(body?.error ?? res.statusText)));
        return res.json();
      })
      .then((data: { products: CatalogProduct[] }) =>
        setProducts(data.products ?? [])
      )
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Ошибка загрузки");
        setProducts([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    params.then((p) => {
      const slug = decodeURIComponent(p.category);
      setCategory(slug);
      setError(null);
      setLoading(true);
      return load(slug);
    });
  }, [params]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = newSlug.trim().toLowerCase().replace(/\s+/g, "-");
    if (!slug || !category) return;
    setCreating(true);
    setError(null);
    fetch(
      `/api/admin/catalog/categories/${encodeURIComponent(category)}/products`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          product: newTitle.trim() || slug,
          category: category,
          desc: "",
        }),
      }
    )
      .then((res) => {
        if (!res.ok)
          return res.json().then((d) => Promise.reject(new Error(d.error ?? res.statusText)));
        setNewSlug("");
        setNewTitle("");
        return load(category);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Ошибка"))
      .finally(() => setCreating(false));
  };

  if (loading) {
    return (
      <p className="text-[color:var(--muted)]">Загрузка товаров…</p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/catalog"
          className="text-sm text-[color:var(--muted)] hover:underline"
        >
          ← Категории
        </Link>
      </div>
      <h1 className="text-2xl font-semibold text-[color:var(--fg)]">
        Товары: {category}
      </h1>
      {error && (
        <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}

      <section
        className="rounded-xl border p-4"
        style={{ borderColor: "var(--border)" }}
      >
        <h2 className="mb-3 text-lg font-medium text-[color:var(--fg)]">
          Список товаров
        </h2>
        {products.length === 0 && !loading && (
          <p className="mb-3 text-sm text-[color:var(--muted)]">
            В этой категории пока нет товаров. Добавьте первый товар формой ниже.
          </p>
        )}
        <div
          className="overflow-hidden rounded-lg border"
          style={{ borderColor: "var(--border)" }}
        >
          <table className="w-full text-left text-sm">
            <thead style={{ background: "var(--muted)/0.3" }}>
              <tr>
                <th className="px-4 py-3 font-medium text-[color:var(--fg)]">
                  Название
                </th>
                <th className="px-4 py-3 font-medium text-[color:var(--fg)]">
                  Slug (часть URL)
                </th>
                <th className="px-4 py-3 font-medium text-[color:var(--fg)]">
                  Превью
                </th>
                <th className="px-4 py-3 font-medium text-[color:var(--fg)]" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
              <tr
                key={p.productSlug}
                className="border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <td className="px-4 py-3 text-[color:var(--fg)]">
                  {p.title}
                </td>
                <td className="px-4 py-3 text-[color:var(--muted)]">
                  {p.productSlug}
                </td>
                <td className="px-4 py-3">
                  {p.thumb ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={p.thumb}
                        alt=""
                        className="h-12 w-16 rounded object-cover"
                      />
                    </>
                  ) : (
                    <span className="text-[color:var(--muted)]">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/catalog/${encodeURIComponent(p.categorySlug)}/${encodeURIComponent(p.productSlug)}`}
                    className="font-medium text-[color:var(--fg)] hover:underline"
                  >
                    Редактировать
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </section>

      <section
        className="rounded-xl border p-4"
        style={{ borderColor: "var(--border)" }}
      >
        <h2 className="mb-2 text-lg font-medium text-[color:var(--fg)]">
          Добавить новый товар
        </h2>
        <p className="mb-3 text-sm text-[color:var(--muted)]">
          <strong>Slug</strong> — часть адреса товара (латиница, цифры, дефис). Например: <code className="rounded bg-[color:var(--muted)]/20 px-1">acs-314</code>. Менять после создания нельзя. <strong>Название</strong> — как товар показывается на сайте, его можно править в карточке товара.
        </p>
        <form
          onSubmit={handleCreate}
          className="flex flex-wrap items-end gap-3"
        >
          <div>
            <label htmlFor="new-slug" className="block text-sm font-medium text-[color:var(--fg)]">
              Slug товара
            </label>
            <input
              id="new-slug"
              type="text"
              value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              placeholder="acs-314 или novyy-tovar"
              className="mt-1 rounded border px-3 py-2 text-[color:var(--fg)]"
              style={{ borderColor: "var(--border)", background: "var(--card)" }}
            />
          </div>
          <div>
            <label htmlFor="new-title" className="block text-sm font-medium text-[color:var(--fg)]">
              Название
            </label>
            <input
              id="new-title"
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Новый товар"
              className="mt-1 rounded border px-3 py-2 text-[color:var(--fg)]"
              style={{ borderColor: "var(--border)", background: "var(--card)" }}
            />
          </div>
          <button
            type="submit"
            disabled={creating || !newSlug.trim()}
            className="rounded bg-[color:var(--fg)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {creating ? "Создание…" : "Добавить товар"}
          </button>
        </form>
      </section>
    </div>
  );
}
