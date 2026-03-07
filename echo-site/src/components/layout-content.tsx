"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import type { SiteConfig } from "@/types/content";

export function LayoutContent({
  children,
  siteConfig,
}: {
  children: React.ReactNode;
  siteConfig: SiteConfig;
}) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader siteConfig={siteConfig} />
      <main className="flex-1">{children}</main>
      <SiteFooter siteConfig={siteConfig} />
    </>
  );
}
