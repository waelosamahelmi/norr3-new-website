import { NextRequest, NextResponse } from "next/server";

const OLLAMA_URL = "http://localhost:11434/v1/chat/completions";
const MODEL = "glm-5.2:cloud";

// Include NØRR3's real services so the AI can connect ideas to what we do
const SYSTEM_PROMPT = `You are NØRR3, a Nordic media agency. A visitor typed an idea. Reply with ONE short phrase (max 10 words) connecting their idea to what NØRR3 actually offers.

NØRR3 services: Marketing Engine (automated campaign planning, creative generation in Meta/DOOH/display sizes, media mix optimization), Insight & Strategy, Data & Analytics, Paid Media, Measurement, Performance Marketing.

Reply in the same language as the input. Output ONLY the phrase, no quotes, no explanation.`;

export async function POST(req: NextRequest) {
  let locale = "en";
  try {
    const body = await req.json();
    locale = body.locale || "en";
    const idea = body.idea;

    if (!idea || typeof idea !== "string" || idea.length > 80) {
      return NextResponse.json({ error: "Invalid idea" }, { status: 400 });
    }

    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: idea },
        ],
        // glm-5.2 uses reasoning tokens internally, so needs a high limit
        // to actually produce content after the reasoning step
        max_tokens: 1000,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(`Ollama returned ${response.status}`);
    }

    const data = await response.json();
    let reply = data?.choices?.[0]?.message?.content || "";

    // Clean up: strip quotes, limit length
    reply = reply.replace(/^["']|["']$/g, "").trim();
    if (reply.length > 52) reply = reply.slice(0, 49).trim() + "…";

    if (!reply) {
      const fallbacks = locale === "fi" ? "Sitä voi kasvattaa" : "We can grow that";
      reply = fallbacks;
    }

    return NextResponse.json({ reply });
  } catch (error) {
    const fallback = locale === "fi" ? "Kasvatetaan yhdessä" : "Let's grow it together";
    return NextResponse.json({ reply: fallback });
  }
}