import { NextRequest, NextResponse } from "next/server";

const OLLAMA_URL = "http://localhost:11434/v1/chat/completions";
const MODEL = "glm-5.2:cloud";

const SYSTEM_PROMPT = `You are NØRR3, a Nordic media agency. A client is filling a campaign brief form. Based on the partial data, give ONE short suggestion (max 3 sentences) about their campaign: channels to consider, budget allocation, or measurement. Plain-spoken, confident, no jargon. Reply in the same language as the input data.`;

export async function POST(req: NextRequest) {
  let locale = "en";
  try {
    const body = await req.json();
    locale = body.locale || "en";
    const summary = body.summary || "";

    if (!summary || typeof summary !== "string" || summary.length > 2000) {
      return NextResponse.json({ error: "Invalid brief" }, { status: 400 });
    }

    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: summary },
        ],
        // glm-5.2 uses reasoning tokens internally — needs a high limit
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

    reply = reply.trim();
    if (!reply) {
      const fallbacks =
        locale === "fi"
          ? "Suosittelemme laajaa monikanavamixiä — TV ja digi rakentamaan tunnettuutta, sosiaalinen media ja haku aktivoimaan."
          : "We recommend a broad channel mix — TV and digital to build awareness, social and search to activate.";
      reply = fallbacks;
    }

    return NextResponse.json({ reply });
  } catch {
    const fallback =
      locale === "fi"
        ? "Suosittelemme laajaa monikanavamixiä — TV ja digi rakentamaan tunnettuutta, sosiaalinen media ja haku aktivoimaan."
        : "We recommend a broad channel mix — TV and digital to build awareness, social and search to activate.";
    return NextResponse.json({ reply: fallback });
  }
}