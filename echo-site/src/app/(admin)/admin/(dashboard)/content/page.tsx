import Link from "next/link";

const sections = [
  { href: "/admin/content/contacts", label: "Контакты", desc: "Телефон, email, адрес, реквизиты, название и описание сайта" },
  { href: "/admin/content/services", label: "Услуги", desc: "Список услуг: ремонт сканеров, датчиков и т.д." },
  { href: "/admin/content/specials", label: "Акции", desc: "Специальные предложения на главной и странице /specials" },
  { href: "/admin/content/faq", label: "FAQ", desc: "Вопросы и ответы на главной и странице /faq" },
];

export default function AdminContentPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[color:var(--fg)]">Контент сайта</h1>
      <p className="text-sm text-[color:var(--muted)]">
        Редактирование контактов, услуг, акций и FAQ. Данные хранятся в <code className="rounded bg-[color:var(--border)] px-1">content-data/*.json</code>.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="block rounded-xl border p-5 text-[color:var(--fg)] transition hover:bg-[color:var(--card)]"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="font-semibold">{s.label}</div>
            <div className="mt-1 text-sm text-[color:var(--muted)]">{s.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
