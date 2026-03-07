"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { FaqItem } from "@/types/content";

export default function AdminContentFaqPage() {
  const [list, setList] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/content/faq")
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data: FaqItem[]) => setList(Array.isArray(data) ? data : []))
      .catch((e) => setMessage({ type: "err", text: e instanceof Error ? e.message : "Ошибка" }))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    fetch("/api/admin/content/faq", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(list),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((d) => Promise.reject(new Error(d.error ?? res.statusText)));
        setMessage({ type: "ok", text: "Сохранено" });
      })
      .catch((e) => setMessage({ type: "err", text: e instanceof Error ? e.message : "Ошибка" }))
      .finally(() => setSaving(false));
  };

  const update = (index: number, patch: Partial<FaqItem>) => {
    setList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  };

  const add = () => setList((prev) => [...prev, { q: "", a: "" }]);
  const remove = (index: number) => setList((prev) => prev.filter((_, i) => i !== index));

  if (loading) {
    return <p className="text-[color:var(--muted)]">Загрузка…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/content"
          className="text-sm font-medium text-[color:var(--muted)] hover:text-[color:var(--fg)]"
        >
          ← Контент
        </Link>
      </div>
      <h1 className="text-2xl font-semibold text-[color:var(--fg)]">FAQ</h1>
      {message && (
        <p
          className={
            message.type === "ok"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }
        >
          {message.text}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {list.map((item, i) => (
          <div
            key={i}
            className="rounded-xl border p-4"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-[color:var(--muted)]">Вопрос {i + 1}</span>
              <button
                type="button"
                onClick={() => remove(i)}
                className="text-sm text-red-600 dark:text-red-400"
              >
                Удалить
              </button>
            </div>
            <input
              value={item.q}
              onChange={(e) => update(i, { q: e.target.value })}
              placeholder="Вопрос"
              className="mb-2 w-full rounded border bg-transparent px-3 py-2 text-[color:var(--fg)]"
              style={{ borderColor: "var(--border)" }}
            />
            <textarea
              value={item.a}
              onChange={(e) => update(i, { a: e.target.value })}
              placeholder="Ответ"
              rows={2}
              className="w-full rounded border bg-transparent px-3 py-2 text-[color:var(--fg)]"
              style={{ borderColor: "var(--border)" }}
            />
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="rounded border border-dashed px-4 py-2 text-sm text-[color:var(--muted)]"
          style={{ borderColor: "var(--border)" }}
        >
          + Добавить вопрос
        </button>
        <div>
          <button
            type="submit"
            disabled={saving}
            className="rounded border px-4 py-2 text-sm font-medium text-[color:var(--fg)] disabled:opacity-50"
            style={{ borderColor: "var(--border)" }}
          >
            {saving ? "Сохранение…" : "Сохранить"}
          </button>
        </div>
      </form>
    </div>
  );
}
