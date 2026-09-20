import { createFileRoute } from "@tanstack/react-router";
import { CircuitAnalyzer } from "@/components/circuit-analyzer";
export const Route = createFileRoute("/circuit-analyzer")({ head: () => ({ meta: [
  { title: "Circuit Analyzer — FixMate" }, { name: "description", content: "Upload a circuit image for a mock component and issue analysis." }, { property: "og:title", content: "Circuit Analyzer — FixMate" }, { property: "og:description", content: "Upload a circuit image for a mock component and issue analysis." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
] }), component: CircuitAnalyzer });