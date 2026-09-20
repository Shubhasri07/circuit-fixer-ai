import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, ArrowRight, BrainCircuit, History, ScanLine, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeatureCard, ScopePanel } from "@/components/fixmate-ui";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "FixMate — Fix Your Circuit Smarter" },
    { name: "description", content: "Guided electronics fault diagnosis and circuit analysis for students and lab users." },
    { property: "og:title", content: "FixMate — Fix Your Circuit Smarter" },
    { property: "og:description", content: "Guided electronics fault diagnosis and circuit analysis for students and lab users." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: HomePage,
});

function HomePage() {
  return <>
    <section className="grid gap-8 pb-10 pt-10 lg:grid-cols-12 lg:items-center lg:pt-16">
      <div className="rise lg:col-span-7">
        <div className="inline-flex items-center gap-2 rounded-md bg-card px-3 py-1.5 font-mono text-[10px] uppercase text-steel ring-1 ring-border"><span className="size-1.5 rounded-full bg-amber blip" /> Diagnostic console · v2.4</div>
        <h1 className="mt-5 max-w-3xl text-balance text-4xl font-extrabold leading-[1.03] sm:text-5xl lg:text-6xl">Fix Your Circuit Smarter</h1>
        <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-steel sm:text-lg">An intelligent electronics fault diagnosis assistant for students and lab users.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="signal" size="xl" asChild><Link to="/diagnose">Start Diagnosis <ArrowRight /></Link></Button>
          <Button variant="console" size="xl" asChild><Link to="/circuit-analyzer"><Upload /> Upload Circuit</Link></Button>
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-4 font-mono text-[11px] text-steel"><span><b className="text-foreground">1,204</b> faults resolved</span><span className="size-1 rounded-full bg-border"/><span><b className="text-foreground">6</b> fault classes</span><span className="size-1 rounded-full bg-border"/><span className="text-signal">SYSTEM READY</span></div>
      </div>
      <div className="rise lg:col-span-5 [animation-delay:120ms]"><ScopePanel /></div>
    </section>
    <section className="grid gap-4 pb-14 md:grid-cols-3">
      <FeatureCard icon={BrainCircuit} title="Smart Diagnosis" text="A guided yes/no decision tree that leads you to the likely fault in under a minute." status="6 fault classes" tone="signal" />
      <FeatureCard icon={ScanLine} title="Circuit Analysis" text="Upload a schematic or board photo to see detected components and possible issues." status="Vision ready" tone="amber" />
      <FeatureCard icon={History} title="Troubleshooting History" text="Review earlier cases with their symptom, diagnosis and date in one clear record." status="4 recent cases" tone="steel" />
    </section>
    <section className="frost mb-12 grid gap-6 rounded-xl p-6 ring-1 ring-border sm:grid-cols-[1fr_auto] sm:items-center sm:p-8">
      <div><div className="font-mono text-[10px] uppercase text-signal">Bench workflow</div><h2 className="mt-2 text-2xl font-semibold">From symptom to a practical next step.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-steel">Choose what failed, answer focused checks, and get a clear probable cause with safe troubleshooting steps.</p></div>
      <Button variant="console" asChild><Link to="/about"><Activity /> How FixMate works</Link></Button>
    </section>
  </>;
}