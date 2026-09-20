import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertTriangle, FileImage, Loader2, ScanLine, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "./fixmate-ui";
import { analyzeCircuitImage, type CircuitAnalysis } from "@/lib/analyze-circuit.functions";

const MAX_BYTES = 10 * 1024 * 1024;

const QUALITY_LABEL: Record<CircuitAnalysis["image_quality"], string> = {
  clear: "Image clear",
  partially_clear: "Image partially clear",
  unclear: "Image unclear",
};

const CONFIDENCE_LABEL: Record<CircuitAnalysis["confidence"], string> = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
  cannot_determine: "Cannot determine a fault",
};

function readAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read that file."));
    reader.readAsDataURL(file);
  });
}

export function CircuitAnalyzer() {
  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CircuitAnalysis | null>(null);
  const analyze = useServerFn(analyzeCircuitImage);

  function pick(next: File | null) {
    setResult(null);
    setError(null);
    setFile(next);
    setPreview(next ? URL.createObjectURL(next) : null);
    if (next && !["image/png", "image/jpeg"].includes(next.type)) {
      setError("Please upload a PNG or JPG image.");
    } else if (next && next.size > MAX_BYTES) {
      setError("That image is larger than 10 MB. Please upload a smaller photo.");
    }
  }

  async function run() {
    if (!file || error) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const imageDataUrl = await readAsDataUrl(file);
      const data = await analyze({ data: { imageDataUrl } });
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Vision module"
        title="Circuit Analyzer"
        text="Upload a clear photo of your circuit, breadboard or schematic. FixMate looks at your actual image and reports only what it can see."
      />
      <div className="grid gap-5 pb-16 lg:grid-cols-[1.1fr_.9fr]">
        <section className="frost rounded-xl p-5 ring-1 ring-border">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              pick(e.dataTransfer.files[0] ?? null);
            }}
            className={`grid min-h-80 place-items-center rounded-lg border border-dashed p-6 text-center transition ${drag ? "border-primary bg-primary/10" : "border-border bg-ink/50"}`}
          >
            {preview ? (
              <div className="w-full">
                <img
                  src={preview}
                  alt="Uploaded circuit"
                  className="mx-auto max-h-64 w-auto rounded-lg object-contain ring-1 ring-border"
                />
                <p className="mt-3 truncate font-mono text-xs text-steel">{file?.name}</p>
              </div>
            ) : (
              <div>
                <div className="mx-auto grid size-14 place-items-center rounded-xl bg-primary/10 text-signal ring-1 ring-primary/30">
                  <Upload />
                </div>
                <h2 className="mt-4 font-semibold">Drop a circuit image here</h2>
                <p className="mt-2 text-sm text-steel">PNG or JPG · up to 10 MB</p>
              </div>
            )}
            <input
              ref={input}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={(e) => pick(e.target.files?.[0] ?? null)}
            />
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button variant="console" onClick={() => input.current?.click()} disabled={loading}>
                <FileImage /> {file ? "Change image" : "Choose image"}
              </Button>
              <Button variant="signal" onClick={run} disabled={!file || loading || !!error}>
                {loading ? <Loader2 className="animate-spin" /> : <ScanLine />}
                {loading ? "Analyzing…" : "Analyze circuit"}
              </Button>
              {file ? (
                <Button variant="ghost" onClick={() => pick(null)} disabled={loading}>
                  <X /> Clear
                </Button>
              ) : null}
            </div>
          </div>
          {error ? (
            <div className="mt-4 rounded-lg bg-accent/10 p-4 text-sm text-amber ring-1 ring-accent/30">{error}</div>
          ) : null}
        </section>

        <aside className="frost rounded-xl p-5 ring-1 ring-border">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase text-signal">AI analysis</div>
              <h2 className="mt-1 text-lg font-semibold">
                {loading ? "Reading your image…" : result ? QUALITY_LABEL[result.image_quality] : "Awaiting image"}
              </h2>
            </div>
            {loading ? <Loader2 className="size-5 animate-spin text-signal" /> : <ScanLine className="size-5 text-signal" />}
          </div>

          {!result && !loading ? (
            <p className="mt-5 text-sm leading-6 text-steel">
              Upload an image and run the analysis. Results here describe only what the AI can actually see in your
              photo — nothing is pre-filled.
            </p>
          ) : null}

          {result ? (
            <div className="mt-5 space-y-5 text-sm leading-6">
              <div>
                <div className="font-mono text-[10px] uppercase text-steel">Circuit overview</div>
                <p className="mt-1 text-steel">{result.circuit_summary}</p>
              </div>

              <div>
                <div className="font-mono text-[10px] uppercase text-steel">Detected components</div>
                <div className="mt-2 space-y-2">
                  {result.components.length ? (
                    result.components.map((c, i) => (
                      <div
                        key={`${c.label}-${i}`}
                        className="flex justify-between gap-3 rounded-md bg-secondary/70 px-3 py-2.5 font-mono text-xs ring-1 ring-border"
                      >
                        <span className="text-steel">{c.label}</span>
                        <span className="text-right">{c.detail}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-steel">No components could be identified in this image.</p>
                  )}
                </div>
              </div>

              {result.wiring_observations.length ? (
                <div>
                  <div className="font-mono text-[10px] uppercase text-steel">Wiring observations</div>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-steel">
                    {result.wiring_observations.map((w, i) => (
                      <li key={i}>{w}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              <div className="rounded-lg bg-accent/10 p-4 ring-1 ring-accent/30">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase text-amber">
                  <AlertTriangle className="size-4" /> {CONFIDENCE_LABEL[result.confidence]}
                </div>
                <p className="mt-2 text-steel">{result.suspected_issue}</p>
              </div>

              {result.troubleshooting_steps.length ? (
                <div>
                  <div className="font-mono text-[10px] uppercase text-steel">Safe troubleshooting steps</div>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-steel">
                    {result.troubleshooting_steps.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ol>
                </div>
              ) : null}

              {result.limitations ? <p className="text-steel">{result.limitations}</p> : null}
            </div>
          ) : null}

          <p className="mt-6 font-mono text-[9px] uppercase leading-4 text-steel">
            AI analysis is an assistive suggestion and should not be treated as a verified electrical measurement.
          </p>
        </aside>
      </div>
    </>
  );
}
