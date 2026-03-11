import type { Metadata } from "next";
import "./globals.css";
import { getSiteConfig } from "@/lib/content-loader";
import { ThemeProvider } from "@/components/theme-provider";
import { LayoutContent } from "@/components/layout-content";

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();
  return {
    title: config.title,
    description: config.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteConfig = await getSiteConfig();
  return (
    <html lang="ru">
      <body className="antialiased">
        <ThemeProvider>
          <div className="min-h-screen page-surface text-[color:var(--fg)]">
            <LayoutContent siteConfig={siteConfig}>{children}</LayoutContent>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
