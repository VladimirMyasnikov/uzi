"use client";

import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-provider";
import type { SiteConfig } from "@/types/content";

export function SiteHeader({ siteConfig }: { siteConfig: SiteConfig }) {
  return (
    <header
      className="sticky top-0 z-20 border-b bg-[color:var(--bg)]/85 backdrop-blur"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/" className="text-base font-semibold text-[color:var(--fg)] sm:text-lg">
          {siteConfig.name}
        </Link>

        <nav className="hidden items-center gap-5 text-sm font-medium text-[color:var(--muted)] md:flex">
          <Link href="/catalog" className="hover:text-[color:var(--fg)]">
            Каталог
          </Link>
          <Link href="/services/repair-scanners" className="hover:text-[color:var(--fg)]">
            Услуги
          </Link>
          <Link href="/specials" className="hover:text-[color:var(--fg)]">
            Акции
          </Link>
          <Link href="/faq" className="hover:text-[color:var(--fg)]">
            FAQ
          </Link>
        </nav>

        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="hidden text-[color:var(--muted)] sm:inline">{siteConfig.contacts.phoneTollFree}</span>
          <ThemeSwitcher compact />
          <Link
            href="/contacts"
            className="hidden rounded-full border px-3 py-2 text-[color:var(--fg)] transition hover:-translate-y-0.5 sm:inline-flex"
            style={{ borderColor: "var(--border)" }}
          >
            Контакты
          </Link>
          <a
            href={`tel:${siteConfig.contacts.phoneTollFreeHref}`}
            className="hidden rounded-full bg-[color:var(--fg)] px-3 py-2 text-white transition hover:-translate-y-0.5 md:inline-flex"
          >
            Позвонить
          </a>
          <Link
            href="/#quote"
            className="rounded-full bg-[color:var(--fg)] px-3 py-2 text-white transition hover:-translate-y-0.5"
          >
            Запрос КП
          </Link>
        </div>
      </div>

      <div className="block border-t" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 md:hidden">
          <div className="flex items-center gap-2 text-xs text-[color:var(--muted)]">
            <span className="font-semibold text-[color:var(--fg)]">{siteConfig.contacts.phoneTollFree}</span>
            <a href={`tel:${siteConfig.contacts.phoneTollFreeHref}`} className="underline">
              Позвонить
            </a>
          </div>
          <Link
            href="/contacts"
            className="rounded-full border px-3 py-2 text-xs font-semibold text-[color:var(--fg)]"
            style={{ borderColor: "var(--border)" }}
          >
            Контакты
          </Link>
        </div>
      </div>
    </header>
  );
}

