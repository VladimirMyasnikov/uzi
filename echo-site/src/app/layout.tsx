import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { getSiteConfig } from "@/lib/content-loader";
import { ThemeProvider } from "@/components/theme-provider";
import { LayoutContent } from "@/components/layout-content";

const inter = Inter({
  variable: "--font-sans-custom",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading-custom",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

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
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <ThemeProvider>
          <div className="min-h-screen page-surface text-[color:var(--fg)]">
            <LayoutContent siteConfig={siteConfig}>{children}</LayoutContent>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
