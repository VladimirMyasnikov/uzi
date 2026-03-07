import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-[color:var(--fg)]">
        Админ-панель
      </h1>
      <p className="text-[color:var(--muted)]">
        Управление каталогом и контентом сайта.
      </p>
      <div className="flex flex-wrap gap-4">
        <Link
          href="/admin/catalog"
          className="rounded-xl border bg-[color:var(--card)] px-5 py-4 font-medium text-[color:var(--fg)] transition hover:opacity-90"
          style={{ borderColor: "var(--border)" }}
        >
          Каталог
        </Link>
      </div>
    </div>
  );
}
