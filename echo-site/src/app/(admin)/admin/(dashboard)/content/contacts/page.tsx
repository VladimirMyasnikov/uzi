"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SiteConfig } from "@/types/content";

export default function AdminContentContactsPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/content/site")
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data: SiteConfig) => setConfig(data))
      .catch((e) => setMessage({ type: "err", text: e instanceof Error ? e.message : "Ошибка" }))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    setSaving(true);
    setMessage(null);
    fetch("/api/admin/content/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((d) => Promise.reject(new Error(d.error ?? res.statusText)));
        setMessage({ type: "ok", text: "Сохранено" });
      })
      .catch((e) => setMessage({ type: "err", text: e instanceof Error ? e.message : "Ошибка" }))
      .finally(() => setSaving(false));
  };

  if (loading || !config) {
    return (
      <p className="text-[color:var(--muted)]">
        {loading ? "Загрузка…" : "Не удалось загрузить конфиг."}
      </p>
    );
  }

  const set = (patch: Partial<SiteConfig>) => setConfig((c) => (c ? { ...c, ...patch } : c));
  const setContacts = (patch: Partial<SiteConfig["contacts"]>) =>
    setConfig((c) => (c ? { ...c, contacts: { ...c.contacts, ...patch } } : c));

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
      <h1 className="text-2xl font-semibold text-[color:var(--fg)]">Контакты и описание сайта</h1>
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
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-[color:var(--fg)]">Название сайта</label>
          <input
            type="text"
            value={config.name}
            onChange={(e) => set({ name: e.target.value })}
            className="mt-1 w-full rounded border bg-transparent px-3 py-2 text-[color:var(--fg)]"
            style={{ borderColor: "var(--border)" }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[color:var(--fg)]">Title (SEO)</label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => set({ title: e.target.value })}
            className="mt-1 w-full rounded border bg-transparent px-3 py-2 text-[color:var(--fg)]"
            style={{ borderColor: "var(--border)" }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[color:var(--fg)]">Description (SEO)</label>
          <textarea
            value={config.description}
            onChange={(e) => set({ description: e.target.value })}
            rows={2}
            className="mt-1 w-full rounded border bg-transparent px-3 py-2 text-[color:var(--fg)]"
            style={{ borderColor: "var(--border)" }}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[color:var(--fg)]">Телефон (основной)</label>
            <input
              type="text"
              value={config.contacts.phoneMain}
              onChange={(e) => setContacts({ phoneMain: e.target.value })}
              className="mt-1 w-full rounded border bg-transparent px-3 py-2 text-[color:var(--fg)]"
              style={{ borderColor: "var(--border)" }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[color:var(--fg)]">Телефон (бесплатный)</label>
            <input
              type="text"
              value={config.contacts.phoneTollFree}
              onChange={(e) => setContacts({ phoneTollFree: e.target.value })}
              className="mt-1 w-full rounded border bg-transparent px-3 py-2 text-[color:var(--fg)]"
              style={{ borderColor: "var(--border)" }}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[color:var(--fg)]">Телефон для ссылки (цифры)</label>
          <input
            type="text"
            value={config.contacts.phoneTollFreeHref}
            onChange={(e) => setContacts({ phoneTollFreeHref: e.target.value })}
            placeholder="+79531125416"
            className="mt-1 w-full rounded border bg-transparent px-3 py-2 text-[color:var(--fg)]"
            style={{ borderColor: "var(--border)" }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[color:var(--fg)]">Email</label>
          <input
            type="email"
            value={config.contacts.email}
            onChange={(e) => setContacts({ email: e.target.value })}
            className="mt-1 w-full rounded border bg-transparent px-3 py-2 text-[color:var(--fg)]"
            style={{ borderColor: "var(--border)" }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[color:var(--fg)]">Адрес</label>
          <input
            type="text"
            value={config.contacts.address}
            onChange={(e) => setContacts({ address: e.target.value })}
            className="mt-1 w-full rounded border bg-transparent px-3 py-2 text-[color:var(--fg)]"
            style={{ borderColor: "var(--border)" }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[color:var(--fg)]">Реквизиты</label>
          <textarea
            value={config.contacts.requisites}
            onChange={(e) => setContacts({ requisites: e.target.value })}
            rows={2}
            className="mt-1 w-full rounded border bg-transparent px-3 py-2 text-[color:var(--fg)]"
            style={{ borderColor: "var(--border)" }}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="rounded border px-4 py-2 text-sm font-medium text-[color:var(--fg)] disabled:opacity-50"
          style={{ borderColor: "var(--border)" }}
        >
          {saving ? "Сохранение…" : "Сохранить"}
        </button>
      </form>
    </div>
  );
}
