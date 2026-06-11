import type { Metadata } from "next";
import { Unbounded, Inter_Tight, JetBrains_Mono } from "next/font/google";
import { I18nProvider } from "@/lib/i18n-client";
import { getLocale } from "@/lib/locale-server";
import "./globals.css";

const headline = Unbounded({
  variable: "--font-headline",
  subsets: ["latin", "cyrillic"],
});

const body = Inter_Tight({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
});

const label = JetBrains_Mono({
  variable: "--font-label",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "FreeSkin — мониторинг родинок",
  description:
    "Дерматологический мониторинг родинок: фото, анализ риска, история изменений.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${headline.variable} ${body.variable} ${label.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider locale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
