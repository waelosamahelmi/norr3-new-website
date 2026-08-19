import { NextRequest, NextResponse } from "next/server";
import { submitToCms } from "@/lib/cms";

/**
 * Contact form endpoint.
 *
 * The browser posts here and this route forwards to the CMS inbox with the
 * shared ingest secret, so the secret never leaves the server and the CMS never
 * has to accept unauthenticated public writes.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Malformed request" }, { status: 400 });

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "That email address does not look right." }, { status: 400 });
  }
  // A filled hidden field means a bot walked the form.
  if (String(body.website ?? "").trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const result = await submitToCms("contact", {
    name,
    email,
    company: String(body.company ?? "").trim(),
    message,
    locale: String(body.locale ?? "fi"),
  });

  if (!result.ok) {
    console.error("[contact] could not record submission:", result.error);
    return NextResponse.json(
      { error: "We could not record your message. Please email info@norr3.fi instead." },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true });
}
