"use client";

import { useSyncExternalStore } from "react";
import { ArrowUpRight, BookOpen, FlaskConical, GitFork, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/learn", label: "Roadmap", Icon: BookOpen },
  { href: "/lab", label: "Visual Lab", Icon: FlaskConical },
  { href: "/practice", label: "Practice", Icon: GitFork },
];

function readTheme() {
  return document.documentElement.dataset.theme ?? "system";
}

function subscribe(callback: () => void) {
  window.addEventListener("algo-theme", callback);
  return () => window.removeEventListener("algo-theme", callback);
}

export function Brand() {
  return <Link href="/" className="brand" aria-label="AlgoAscend home"><span className="brand-mark" aria-hidden="true"><i/><i/><i/></span><span>Algo<span className="brand-accent">Ascend</span></span></Link>;
}

export function Header() {
  const pathname = usePathname();
  const theme = useSyncExternalStore(subscribe, readTheme, () => "system");
  function toggleTheme() {
    const isDark = theme === "dark" || (theme === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    const next = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    window.dispatchEvent(new Event("algo-theme"));
  }
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Brand />
        <nav aria-label="Main navigation">
          {links.map(({href, label, Icon}) => <Link href={href} key={href} aria-current={pathname.startsWith(href) ? "page" : undefined}><Icon size={16} aria-hidden="true"/>{label}</Link>)}
        </nav>
        <div className="header-actions">
          <button className="icon-button theme-toggle" type="button" aria-label="Toggle color theme" onClick={toggleTheme}>{theme === "light" ? <Moon size={18}/> : <Sun size={18}/>}</button>
          <Link href="https://github.com/Kaushik2210/AlgoAscend" className="github-link">GitHub <ArrowUpRight size={15} aria-hidden="true"/></Link>
          <Link className="button primary header-cta" href="/start">Start learning <ArrowUpRight size={16} aria-hidden="true"/></Link>
        </div>
      </div>
    </header>
  );
}
