import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Header } from "@/components/header";
import "./globals.css";
import "./learning.css";

export const metadata: Metadata = {
  title: "AlgoAscend — Learn to think in algorithms",
  description: "Build algorithmic intuition with interactive traces, structured lessons, and coding practice in C, Python, and Java.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
