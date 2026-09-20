import { Link } from "@tanstack/react-router";
import { Menu, Zap } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

const nav = [["/", "Home"], ["/diagnose", "Diagnose"], ["/circuit-analyzer", "Circuit Analyzer"], ["/history", "History"], ["/about", "About"]] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return <div className="relative min-h-screen overflow-x-hidden"><div className="circuit-grid pointer-events-none fixed inset-0 opacity-20" />
    <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
      <header className="frost sticky top-0 z-40 -mx-4 border-b border-border px-4 py-3 sm:-mx-6 sm:px-6">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 md:grid-cols-[auto_1fr_auto]">
          <Link to="/" className="flex min-w-0 items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-signal ring-1 ring-primary/30"><Zap className="size-4" /></span><span className="min-w-0 leading-none"><b className="block truncate font-mono text-sm">FixMate</b><span className="mt-1 block truncate font-mono text-[9px] uppercase text-steel">Bench Assistant</span></span></Link>
          <nav className="hidden justify-center gap-1 md:flex">{nav.map(([to,label]) => <Link key={to} to={to} activeOptions={{ exact: to === "/" }} activeProps={{ className: "bg-card text-foreground ring-1 ring-border" }} className="rounded-md px-3 py-2 font-mono text-[10px] uppercase text-steel transition-colors hover:text-foreground">{label}</Link>)}</nav>
          <div className="flex items-center gap-2"><span className="hidden font-mono text-[9px] uppercase text-signal sm:inline">● Online</span><Button variant="signal" size="sm" asChild><Link to="/diagnose">Start</Link></Button><details className="relative md:hidden"><summary className="grid size-8 cursor-pointer list-none place-items-center rounded-md bg-card ring-1 ring-border"><Menu className="size-4" /></summary><nav className="frost absolute right-0 top-11 grid w-52 gap-1 rounded-lg p-2 ring-1 ring-border">{nav.map(([to,label]) => <Link key={to} to={to} className="rounded-md px-3 py-2 text-sm text-steel hover:bg-secondary hover:text-foreground">{label}</Link>)}</nav></details></div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border py-6 font-mono text-[9px] uppercase text-steel"><span>FixMate · Intelligent fault diagnosis</span><span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-signal blip"/> All systems nominal</span></footer>
    </div>
  </div>;
}