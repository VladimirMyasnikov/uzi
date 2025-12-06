import Link from "next/link";
import { siteConfig } from "@/config/site";

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/catalog", label: "Каталог" },
  { href: "/services/repair-scanners", label: "Ремонт сканеров" },
  { href: "/services/repair-probes", label: "Ремонт датчиков" },
  { href: "/specials", label: "Акции" },
  { href: "/news", label: "Новости" },
  { href: "/faq", label: "FAQ" },
  { href: "/contacts", label: "Контакты" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-semibold text-lg text-slate-900">
          {siteConfig.name}
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-slate-900">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 text-sm font-semibold">
          <span className="text-slate-500">{siteConfig.contacts.phoneMain}</span>
          <a
            href={`tel:${siteConfig.contacts.phoneTollFreeHref}`}
            className="rounded-full bg-slate-900 px-4 py-2 text-white hover:bg-slate-800"
          >
            {siteConfig.contacts.phoneTollFree}
          </a>
        </div>
      </div>
    </header>
  );
}

