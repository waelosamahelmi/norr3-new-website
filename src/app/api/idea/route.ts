import { NextRequest, NextResponse } from "next/server";

const OLLAMA_URL = "http://localhost:11434/v1/chat/completions";
const MODEL = "kimi-k2.6:cloud";

const SYSTEM_PROMPT = `Reply with ONE short phrase (max 8 words) connecting the user's idea to a media agency service. Output only the phrase, no quotes, no explanation. Reply in the same language as the input.`;

export async function POST(req: NextRequest) {
  let locale = "en";
  try {
    const body = await req.json();
    locale = body.locale || "en";
    const idea = body.idea;

    if (!idea || typeof idea !== "string" || idea.length > 52) {
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
        max_tokens: 500,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(12000),
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