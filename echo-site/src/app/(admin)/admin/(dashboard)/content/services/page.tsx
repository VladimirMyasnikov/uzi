"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ServiceItem } from "@/types/content";

export default function AdminContentServicesPage() {
  const [list, setList] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/content/services")
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data: ServiceItem[]) => setList(Array.isArray(data) ? data : []))
      .catch((e) => setMessage({ type: "err", text: e instanceof Error ? e.message : "Ошибка" }))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    fetch("/api/admin/content/services", {
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

  const update = (index: number, patch: Partial<ServiceItem>) => {
    setList((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  };

  const updateStep = (serviceIndex: number, stepIndex: number, value: string) => {
    setList((prev) =>
      prev.map((item, i) => {
        if (i !== serviceIndex) return item;
        const steps = [...(item.steps ?? [])];
        steps[stepIndex] = value;
        return { ...item, steps };
      })
    );
  };

  const addStep = (serviceIndex: number) => {
    setList((prev) =>
      prev.map((item, i) =>
        i === serviceIndex
          ? { ...item, steps: [...(item.steps ?? []), ""] }
          : item
      )
    );
  };

  const removeStep = (serviceIndex: number, stepIndex: number) => {
    setList((prev) =>
      prev.map((item, i) =>
        i === serviceIndex
          ? { ...item, steps: item.steps.filter((_, j) => j !== stepIndex) }
          : item
      )
    );
  };

  const addService = () => {
    setList((prev) => [
      ...prev,
      { slug: "", title: "", desc: "", steps: [] },
    ]);
  };

  const removeService = (index: number) => {
    setList((prev) => prev.filter((_, i) => i !== index));
  };

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
      <h1 className="text-2xl font-semibold text-[color:var(--fg)]">Услуги</h1>
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
      <form onSubmit={handleSubmit} className="space-y-6">
        {list.map((item, i) => (
          <div
            key={i}
            className="rounded-xl border p-4"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm font-medium text-[color:var(--muted)]">Услуга {i + 1}</span>
              <button
                type="button"
                onClick={() => removeService(i)}
                className="text-sm text-red-600 dark:text-red-400"
              >
                Удалить
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-[color:var(--muted)]">Slug (URL)</label>
                <input
                  value={item.slug}
                  onChange={(e) => update(i, { slug: e.target.value })}
                  className="mt-1 w-full rounded border bg-transparent px-2 py-1.5 text-sm text-[color:var(--fg)]"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
              <div>
                <label className="block text-xs text-[color:var(--muted)]">Название</label>
                <input
                  value={item.title}
                  onChange={(e) => update(i, { title: e.target.value })}
                  className="mt-1 w-full rounded border bg-transparent px-2 py-1.5 text-sm text-[color:var(--fg)]"
                  style={{ borderColor: "var(--border)" }}
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs text-[color:var(--muted)]">Описание</label>
              <textarea
                value={item.desc}
                onChange={(e) => update(i, { desc: e.target.value })}
                rows={2}
                className="mt-1 w-full rounded border bg-transparent px-2 py-1.5 text-sm text-[color:var(--fg)]"
                style={{ borderColor: "var(--border)" }}
              />
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between">
                <label className="text-xs text-[color:var(--muted)]">Этапы (шаги)</label>
                <button
                  type="button"
                  onClick={() => addStep(i)}
                  className="text-xs text-[color:var(--accent)]"
                >
                  + шаг
                </button>
              </div>
              {(item.steps ?? []).map((step, si) => (
                <div key={si} className="mt-1 flex gap-1">
                  <input
                    value={step}
                    onChange={(e) => updateStep(i, si, e.target.value)}
                    className="flex-1 rounded border bg-transparent px-2 py-1 text-sm text-[color:var(--fg)]"
                    style={{ borderColor: "var(--border)" }}
                  />
                  <button
                    type="button"
                    onClick={() => removeStep(i, si)}
                    className="text-red-600 dark:text-red-400"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addService}
          className="rounded border border-dashed px-4 py-2 text-sm text-[color:var(--muted)]"
          style={{ borderColor: "var(--border)" }}
        >
          + Добавить услугу
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
