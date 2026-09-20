import { createFileRoute } from "@tanstack/react-router";
import { DiagnoseFlow } from "@/components/diagnose-flow";

export const Route = createFileRoute("/diagnose")({ head: () => ({ meta: [
  { title: "Diagnose a Circuit — FixMate" }, { name: "description", content: "Follow guided checks to identify a likely electronics fault." }, { property: "og:title", content: "Diagnose a Circuit — FixMate" }, { property: "og:description", content: "Follow guided checks to identify a likely electronics fault." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: DiagnoseFlow });