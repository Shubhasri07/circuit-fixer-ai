import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  imageDataUrl: z
    .string()
    .regex(/^data:image\/(png|jpeg);base64,[A-Za-z0-9+/=]+$/, "Only PNG or JPEG images are supported")
    .max(14_000_000, "Image is too large — please upload an image under 10 MB"),
});

export type CircuitAnalysis = {
  image_quality: "clear" | "partially_clear" | "unclear";
  circuit_summary: string;
  components: { label: string; detail: string }[];
  wiring_observations: string[];
  suspected_issue: string;
  confidence: "high" | "medium" | "low" | "cannot_determine";
  troubleshooting_steps: string[];
  limitations: string;
};

const jsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    image_quality: { type: "string", enum: ["clear", "partially_clear", "unclear"] },
    circuit_summary: { type: "string" },
    components: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string" }, detail: { type: "string" } },
        required: ["label", "detail"],
      },
    },
    wiring_observations: { type: "array", items: { type: "string" } },
    suspected_issue: { type: "string" },
    confidence: { type: "string", enum: ["high", "medium", "low", "cannot_determine"] },
    troubleshooting_steps: { type: "array", items: { type: "string" } },
    limitations: { type: "string" },
  },
  required: [
    "image_quality",
    "circuit_summary",
    "components",
    "wiring_observations",
    "suspected_issue",
    "confidence",
    "troubleshooting_steps",
    "limitations",
  ],
} as const;

const SYSTEM_PROMPT = `You are FixMate, an electronics lab assistant that analyses photos of real circuits, breadboards and schematics.
Rules:
- Only report components and wiring you can actually SEE in the image. Never invent part numbers, resistor values or capacitor values. If a marking is unreadable, describe it generically (e.g. "through-hole resistor, value unreadable").
- If the image is blurry, cropped, too dark, or is not a circuit at all, say so plainly: set image_quality and set confidence to "cannot_determine", leave components empty if nothing is identifiable, and explain what a better photo would need.
- suspected_issue must use simple language a student understands, and must say clearly when no fault can be determined from a photo alone.
- troubleshooting_steps must be safe: power-off checks first, no mains-voltage or high-current advice.
- Keep every field concise.`;

export const analyzeCircuitImage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<CircuitAnalysis> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured for this project (missing LOVABLE_API_KEY).");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        stream: true,
        reasoning: { effort: "low" },
        instructions: SYSTEM_PROMPT,
        text: {
          format: {
            type: "json_schema",
            name: "circuit_analysis",
            strict: true,
            schema: jsonSchema,
          },
        },
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: "Analyse this uploaded circuit image and return the structured analysis.",
              },
              { type: "input_image", image_url: data.imageDataUrl },
            ],
          },
        ],
      }),
    });

    if (!res.ok || !res.body) {
      const detail = await res.text().catch(() => "");
      if (res.status === 429) throw new Error("The AI service is busy right now. Please try again in a moment.");
      if (res.status === 402)
        throw new Error("AI credits are exhausted for this workspace. Add credits to continue using analysis.");
      throw new Error(`AI analysis failed (${res.status}). ${detail.slice(0, 200)}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let text = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const event = JSON.parse(payload) as {
            type?: string;
            delta?: string;
            response?: { output_text?: string };
          };
          if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
            text += event.delta;
          } else if (event.type === "response.completed" && event.response?.output_text) {
            if (!text) text = event.response.output_text;
          }
        } catch {
          // ignore keep-alive / non-JSON lines
        }
      }
    }

    if (!text.trim()) throw new Error("The AI did not return an analysis. Please try again with a clearer image.");

    try {
      return JSON.parse(text) as CircuitAnalysis;
    } catch {
      throw new Error("The AI response could not be read. Please try again.");
    }
  });
