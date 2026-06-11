import type { Metadata } from "next";
import { Unbounded, Inter_Tight, JetBrains_Mono } from "next/font/google";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${headline.variable} ${body.variable} ${label.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
