import { NextRequest, NextResponse } from "next/server";
import { submitToCms } from "@/lib/cms";

/**
 * Campaign brief endpoint.
 *
 * The brief form collects a long structured answer set; it is stored whole in
 * the CMS inbox as JSON alongside the contact details, so an account lead can
 * read the whole submission rather than a summary of it.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Malformed request" }, { status: 400 });

  const form = (body.form ?? {}) as Record<string, unknown>;
  const email = String(form.email ?? "").trim();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  const result = await submitToCms("brief", {
    email,
    name: String(form.yourName ?? form.name ?? "").trim(),
    company: String(form.companyName ?? form.company ?? "").trim(),
    phone: String(form.phone ?? "").trim(),
    campaign: {
      answers: form,
      channelPrefs: body.channelPrefs ?? {},
      services: body.services ?? [],
      locale: body.locale ?? "fi",
    },
  });

  if (!result.ok) {
    console.error("[brief] could not record submission:", result.error);
    return NextResponse.json(
      { error: "We could not record your brief. Please email info@norr3.fi instead." },
      { status: 502 }
    );
  }
  return NextResponse.json({ ok: true });
}
