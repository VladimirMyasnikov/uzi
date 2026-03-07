"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { CatalogCategory } from "@/lib/catalog-loader";

export default function AdminCatalogPage() {
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newSlug, setNewSlug] = useState("");
  const [creating, setCreating] = useState(false);

  const load = () =>
    fetch("/api/admin/catalog/categories")
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data: { categories: CatalogCategory[] }) =>
        setCategories(data.categories ?? [])
      )
      .catch((e) => setError(e instanceof Error ? e.message : "Ошибка"))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = newSlug.trim().toLowerCase().replace(/\s+/g, "-");
    if (!slug) return;
    setCreating(true);
    setError(null);
    fetch("/api/admin/catalog/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, title: slug }),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((d) => Promise.reject(new Error(d.error ?? res.statusText)));
        setNewSlug("");
        return load();
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Ошибка"))
      .finally(() => setCreating(false));
  };

  const handleDelete = (slug: string) => {
    if (!confirm(`Удалить категорию «${slug}» и все товары?`)) return;
    fetch(`/api/admin/catalog/categories/${encodeURIComponent(slug)}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (!res.ok) return res.json().then((d) => Promise.reject(new Error(d.error ?? res.statusText)));
        return load();
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Ошибка"));
  };

  if (loading) {
    return (
      <p className="text-[color:var(--muted)]">Загрузка категорий…</p>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[color:var(--fg)]">
        Каталог — категории
      </h1>
      {error && (
        <p className="text-red-600 dark:text-red-400">Ошибка: {error}</p>
      )}
      <p className="mb-3 text-sm text-[color:var(--muted)]">
        Нажмите «Товары» у категории, чтобы просмотреть и редактировать товары или добавить новые.
      </p>
      <form
        onSubmit={handleCreate}
        className="flex flex-wrap items-end gap-3 rounded-xl border p-4"
        style={{ borderColor: "var(--border)" }}
      >
        <div>
          <label htmlFor="new-slug" className="block text-sm font-medium text-[color:var(--fg)]">
            Slug новой категории
          </label>
          <p className="text-xs text-[color:var(--muted)]">Часть URL: латиница, цифры, дефис (например datchiki-uzi)</p>
          <input
            id="new-slug"
            type="text"
            value={newSlug}
            onChange={(e) => setNewSlug(e.target.value)}
            placeholder="например: novaya-kategoriya"
            className="mt-1 rounded border px-3 py-2 text-[color:var(--fg)]"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          />
        </div>
        <button
          type="submit"
          disabled={creating || !newSlug.trim()}
          className="rounded bg-[color:var(--fg)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {creating ? "Создание…" : "Добавить категорию"}
        </button>
      </form>
      <div
        className="overflow-hidden rounded-xl border"
        style={{ borderColor: "var(--border)" }}
      >
        <table className="w-full text-left text-sm">
          <thead style={{ background: "var(--muted)/0.3" }}>
            <tr>
              <th className="px-4 py-3 font-medium text-[color:var(--fg)]">
                Название
              </th>
              <th className="px-4 py-3 font-medium text-[color:var(--fg)]">
                Slug
              </th>
              <th className="px-4 py-3 font-medium text-[color:var(--fg)]">
                Товаров
              </th>
              <th className="px-4 py-3 font-medium text-[color:var(--fg)]" />
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr
                key={cat.slug}
                className="border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <td className="px-4 py-3 text-[color:var(--fg)]">
                  {cat.title}
                </td>
                <td className="px-4 py-3 text-[color:var(--muted)]">
                  {cat.slug}
                </td>
                <td className="px-4 py-3 text-[color:var(--fg)]">
                  {cat.productsCount}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/catalog/${encodeURIComponent(cat.slug)}`}
                    className="mr-3 font-medium text-[color:var(--fg)] hover:underline"
                  >
                    Товары
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat.slug)}
                    className="text-red-600 hover:underline dark:text-red-400"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
