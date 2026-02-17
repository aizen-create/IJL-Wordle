import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IJL Wordle",
  description: "アルファベットと数字を使ったWordle風パズル（最大8文字）",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
