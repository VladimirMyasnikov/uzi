"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CatalogProduct } from "@/lib/catalog-loader";
import type { ProductDataJson } from "@/types/catalog";

type ProductPayload = CatalogProduct & { data: ProductDataJson };

export default function AdminProductEditPage({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}) {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [productSlug, setProductSlug] = useState("");
  const [payload, setPayload] = useState<ProductPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [form, setForm] = useState<ProductDataJson>({
    category: "",
    product: "",
    desc: "",
  });

  useEffect(() => {
    params.then((p) => {
      const cat = decodeURIComponent(p.category);
      const prod = decodeURIComponent(p.product);
      setCategory(cat);
      setProductSlug(prod);
      return fetch(
        `/api/admin/catalog/categories/${encodeURIComponent(cat)}/products/${encodeURIComponent(prod)}`
      );
    })
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data: ProductPayload) => {
        setPayload(data);
        setImages(data.images ?? []);
        setForm({
          category: data.data?.category ?? data.categoryTitle ?? "",
          product: data.data?.product ?? data.title ?? "",
          desc: data.data?.desc ?? data.desc ?? "",
          url: data.data?.url,
          images: data.data?.images,
          badge: data.data?.badge,
          status: data.data?.status,
        });
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Ошибка"))
      .finally(() => setLoading(false));
  }, [params]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    fetch(
      `/api/admin/catalog/categories/${encodeURIComponent(category)}/products/${encodeURIComponent(productSlug)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    )
      .then((res) => {
        if (!res.ok)
          return res.json().then((d) => Promise.reject(new Error(d.error ?? res.statusText)));
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Ошибка"))
      .finally(() => setSaving(false));
  };

  const handleDelete = () => {
    if (!confirm("Удалить товар? Это действие нельзя отменить.")) return;
    fetch(
      `/api/admin/catalog/categories/${encodeURIComponent(category)}/products/${encodeURIComponent(productSlug)}`,
      { method: "DELETE" }
    )
      .then((res) => {
        if (!res.ok)
          return res.json().then((d) => Promise.reject(new Error(d.error ?? res.statusText)));
        router.push(`/admin/catalog/${encodeURIComponent(category)}`);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Ошибка"));
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !category || !productSlug) return;
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.set("file", file);
    fetch(
      `/api/admin/catalog/categories/${encodeURIComponent(category)}/products/${encodeURIComponent(productSlug)}/images`,
      { method: "POST", body: formData }
    )
      .then((res) => {
        if (!res.ok)
          return res.json().then((d) => Promise.reject(new Error(d.error ?? res.statusText)));
        return res.json();
      })
      .then((data: { url: string }) => {
        setImages((prev) => [...prev, data.url]);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Ошибка загрузки"))
      .finally(() => {
        setUploading(false);
        e.target.value = "";
      });
  };

  const handleDeleteImage = (imageUrl: string) => {
    const filename = imageUrl.split("/").pop();
    if (!filename || !confirm("Удалить изображение?")) return;
    fetch(
      `/api/admin/catalog/categories/${encodeURIComponent(category)}/products/${encodeURIComponent(productSlug)}/images/${encodeURIComponent(filename)}`,
      { method: "DELETE" }
    )
      .then((res) => {
        if (!res.ok)
          return res.json().then((d) => Promise.reject(new Error(d.error ?? res.statusText)));
        setImages((prev) => prev.filter((u) => u !== imageUrl));
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Ошибка"));
  };

  if (loading) {
    return <p className="text-[color:var(--muted)]">Загрузка…</p>;
  }
  if (error && !payload) {
    return (
      <p className="text-red-600 dark:text-red-400">
        Ошибка: {error}
        <Link href={`/admin/catalog/${encodeURIComponent(category)}`} className="ml-2 underline">
          Назад к товарам
        </Link>
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href={`/admin/catalog/${encodeURIComponent(category)}`}
          className="text-sm text-[color:var(--muted)] hover:underline"
        >
          ← Товары
        </Link>
      </div>
      <h1 className="text-2xl font-semibold text-[color:var(--fg)]">
        Редактирование: {payload?.title ?? productSlug}
      </h1>
      <p className="text-sm text-[color:var(--muted)]">
        Измените название, описание, статус и изображения. Адрес товара (slug) менять нельзя.
      </p>
      {error && (
        <p className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </p>
      )}
      <form
        onSubmit={handleSave}
        className="flex max-w-2xl flex-col gap-4 rounded-xl border p-4"
        style={{ borderColor: "var(--border)" }}
      >
        <div>
          <label className="block text-sm font-medium text-[color:var(--fg)]">
            Название товара (product)
          </label>
          <input
            type="text"
            value={form.product}
            onChange={(e) => setForm((f) => ({ ...f, product: e.target.value }))}
            className="mt-1 w-full rounded border px-3 py-2 text-[color:var(--fg)]"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[color:var(--fg)]">
            Название категории (category)
          </label>
          <input
            type="text"
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="mt-1 w-full rounded border px-3 py-2 text-[color:var(--fg)]"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[color:var(--fg)]">
            Описание (desc)
          </label>
          <textarea
            value={form.desc}
            onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
            rows={6}
            className="mt-1 w-full rounded border px-3 py-2 text-[color:var(--fg)]"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[color:var(--fg)]">
            URL (опционально)
          </label>
          <input
            type="url"
            value={form.url ?? ""}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value || undefined }))}
            className="mt-1 w-full rounded border px-3 py-2 text-[color:var(--fg)]"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[color:var(--fg)]">
              Badge
            </label>
            <input
              type="text"
              value={form.badge ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value || undefined }))}
              className="mt-1 w-full rounded border px-3 py-2 text-[color:var(--fg)]"
              style={{ borderColor: "var(--border)", background: "var(--card)" }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[color:var(--fg)]">
              Status
            </label>
            <input
              type="text"
              value={form.status ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value || undefined }))}
              className="mt-1 w-full rounded border px-3 py-2 text-[color:var(--fg)]"
              style={{ borderColor: "var(--border)", background: "var(--card)" }}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-[color:var(--fg)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Сохранение…" : "Сохранить"}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded border px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400"
            style={{ borderColor: "var(--border)" }}
          >
            Удалить товар
          </button>
        </div>
      </form>

      <section
        className="rounded-xl border p-4"
        style={{ borderColor: "var(--border)" }}
      >
        <h2 className="mb-3 text-lg font-medium text-[color:var(--fg)]">
          Изображения
        </h2>
        <div className="mb-3 flex flex-wrap gap-3">
          {images.map((url) => (
            <div
              key={url}
              className="relative inline-block rounded border overflow-hidden"
              style={{ borderColor: "var(--border)" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="h-24 w-32 object-cover"
              />
              <button
                type="button"
                onClick={() => handleDeleteImage(url)}
                className="absolute right-1 top-1 rounded bg-black/60 px-2 py-0.5 text-xs text-white hover:bg-black/80"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
        <label className="inline-block rounded bg-[color:var(--fg)] px-4 py-2 text-sm font-semibold text-white cursor-pointer disabled:opacity-50">
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            className="hidden"
            disabled={uploading}
            onChange={handleUpload}
          />
          {uploading ? "Загрузка…" : "Загрузить изображение"}
        </label>
      </section>
    </div>
  );
}
