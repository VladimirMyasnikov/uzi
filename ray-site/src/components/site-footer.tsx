import Link from "next/link";

const footerLinks = [
  { href: "/services/repair-scanners", label: "Услуги" },
  { href: "/catalog", label: "Каталог" },
  { href: "/contacts", label: "Контакты" },
  { href: "/faq", label: "FAQ" },
  { href: "/news", label: "Новости" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white/80 py-6 text-sm text-slate-600 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 sm:flex-row sm:items-center sm:justify-between">
        <div>© 2025 Ray Systems. Все права защищены.</div>
        <div className="flex flex-wrap gap-4">
          {footerLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-slate-800">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}

