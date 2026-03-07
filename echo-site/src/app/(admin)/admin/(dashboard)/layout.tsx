import { auth } from "auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOutAction } from "./actions";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[color:var(--page-surface)]">
      <header
        className="sticky top-0 z-10 flex items-center justify-between border-b px-4 py-3"
        style={{ borderColor: "var(--border)", background: "var(--card)" }}
      >
        <nav className="flex items-center gap-4">
          <Link
            href="/admin"
            className="text-sm font-medium text-[color:var(--fg)] hover:underline"
          >
            Дашборд
          </Link>
          <Link
            href="/admin/catalog"
            className="text-sm font-medium text-[color:var(--fg)] hover:underline"
          >
            Каталог
          </Link>
          <Link
            href="/admin/content"
            className="text-sm font-medium text-[color:var(--fg)] hover:underline"
          >
            Контент
          </Link>
        </nav>
        <span className="text-sm text-[color:var(--muted)]">
          {session.user.name ?? "Админ"}
        </span>
        <form action={signOutAction}>
          <button
            type="submit"
            className="rounded border px-3 py-1.5 text-sm font-medium text-[color:var(--fg)] hover:bg-[color:var(--muted)]/20"
            style={{ borderColor: "var(--border)" }}
          >
            Выйти
          </button>
        </form>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
