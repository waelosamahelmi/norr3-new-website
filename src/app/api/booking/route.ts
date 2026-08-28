import { NextRequest, NextResponse } from "next/server";
import { submitToCms } from "@/lib/cms";

/**
 * Booking endpoints for the two contact-page CTAs.
 *
 *   POST /api/booking  { kind: "demo" | "meeting", ...fields }
 *
 * Bot defence (three layers, invisible to humans):
 *   1. honeypot — a hidden "website" field bots love to fill;
 *   2. time-trap — submissions under 3s from page-load are bots (the client
 *      sends `elapsed`); a real human needs longer to type name+email;
 *   3. math check — a client-side sum the user answers; the answer is
 *      verified here against the two operands (also sent), so a bot that
 *      scrapes the form still has to solve it.
 * All three are checked server-side; failing any looks like success to the
 * bot (ok: true) but nothing is recorded.
 */
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Malformed request" }, { status: 400 });

  const okBot = (b: Record<string, unknown>) => {
    if (String(b.website ?? "").trim() !== "") return false;
    const elapsed = Number(b.elapsed ?? 0);
    if (elapsed > 0 && elapsed < 3) return false;
    const a = Number(b.captchaA);
    const op = String(b.captchaOp ?? "+");
    const c = Number(b.captchaB);
    const answer = Number(b.captchaAnswer);
    if (!Number.isFinite(a) || !Number.isFinite(c) || !Number.isFinite(answer)) return false;
    const expected = op === "−" || op === "-" ? a - c : a + c;
    return answer === expected;
  };

  if (!okBot(body)) {
    // Pretend success so bots don't learn which check tripped them.
    return NextResponse.json({ ok: true });
  }

  const kind = body.kind === "demo" ? "demo" : "meeting";
  const firstName = String(body.firstName ?? "").trim();
  const lastName = String(body.lastName ?? "").trim();
  const email = String(body.email ?? "").trim();
  const company = String(body.company ?? "").trim();
  const phone = String(body.phone ?? "").trim();

  if (!firstName || !lastName || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Name and a valid email are required." }, { status: 400 });
  }

  if (kind === "demo") {
    const slots = Array.isArray(body.slots)
      ? (body.slots as unknown[]).map((x) => String(x).slice(0, 120)).filter(Boolean)
      : [];
    if (slots.length < 1) {
      return NextResponse.json({ error: "Please suggest at least one time slot." }, { status: 400 });
    }
    const result = await submitToCms("demo", {
      firstName, lastName, email, company, phone, slots,
      locale: String(body.locale ?? "fi"),
    });
    if (!result.ok) return NextResponse.json({ error: "Could not send. Please email info@norr3.fi." }, { status: 502 });
    return NextResponse.json({ ok: true });
  }

  const topic = String(body.topic ?? "").trim();
  const person = String(body.person ?? "").trim();
  const message = String(body.message ?? "").trim();
  const result = await submitToCms("meeting", {
    firstName, lastName, email, company, phone, topic, person, message,
    locale: String(body.locale ?? "fi"),
  });
  if (!result.ok) return NextResponse.json({ error: "Could not send. Please email info@norr3.fi." }, { status: 502 });
  return NextResponse.json({ ok: true });
}
