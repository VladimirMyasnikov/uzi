"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SpecialItem } from "@/types/content";

export default function AdminContentSpecialsPage() {
  const [list, setList] = useState<SpecialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/content/specials")
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data: SpecialItem[]) => setList(Array.isArray(data) ? data : []))
      .catch((e) => setMessage({ type: "err", text: e instanceof Error ? e.message : "Ошибка" }))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    fetch("/api/admin/content/specials", {
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

  const update = (index: number, patch: Partial<SpecialItem>) => {
    setList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  };

  const add = () => setList((prev) => [...prev, { title: "", badge: "" }]);
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
      <h1 className="text-2xl font-semibold text-[color:var(--fg)]">Акции</h1>
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
            className="flex flex-wrap items-center gap-3 rounded-xl border p-3"
            style={{ borderColor: "var(--border)" }}
          >
            <input
              value={item.title}
              onChange={(e) => update(i, { title: e.target.value })}
              placeholder="Название"
              className="min-w-[200px] flex-1 rounded border bg-transparent px-3 py-2 text-[color:var(--fg)]"
              style={{ borderColor: "var(--border)" }}
            />
            <input
              value={item.badge}
              onChange={(e) => update(i, { badge: e.target.value })}
              placeholder="Бейдж"
              className="w-32 rounded border bg-transparent px-3 py-2 text-[color:var(--fg)]"
              style={{ borderColor: "var(--border)" }}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-red-600 dark:text-red-400"
            >
              Удалить
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="rounded border border-dashed px-4 py-2 text-sm text-[color:var(--muted)]"
          style={{ borderColor: "var(--border)" }}
        >
          + Добавить акцию
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
