import { NextRequest, NextResponse } from "next/server";
import { submitToCms, uploadApplicationFile } from "@/lib/cms";

const MAX_CV_BYTES = 10 * 1024 * 1024;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/**
 * Open application (avoin hakemus) submission. Accepts multipart/form-data
 * (text fields + an optional CV file), forwards the CV to the CMS file store,
 * then records the application via the CMS forms ingest endpoint.
 */
export async function POST(req: NextRequest) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const field = (key: string) => String(form.get(key) ?? "").trim();
  const name = field("name");
  const email = field("email");
  const phone = field("phone");
  const message = String(form.get("message") ?? "").trim();
  const portfolioUrl = field("portfolioUrl");
  const locale = (field("locale") || "fi").slice(0, 5);

  // Honeypot: bots fill this hidden field; drop silently.
  if (field("website") !== "") {
    return NextResponse.json({ ok: true });
  }

  if (!name || !email) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  // Optional CV attachment.
  let resumePath = "";
  const fileEntry = form.get("file");
  if (fileEntry !== null && typeof fileEntry !== "string") {
    const file = fileEntry as File;
    if (file.size > MAX_CV_BYTES) {
      return NextResponse.json({ error: "CV is too large (max 10 MB)" }, { status: 400 });
    }
    if (file.size > 0) {
      const upload = await uploadApplicationFile(file);
      if (!upload.ok) {
        return NextResponse.json(
          { error: "We could not receive your CV. Please email info@norr3.fi instead." },
          { status: 502 }
        );
      }
      resumePath = upload.path ?? "";
    }
  }

  let coverLetter = message;
  if (portfolioUrl) {
    coverLetter = `${message}\n\nPortfolio/LinkedIn: ${portfolioUrl}`.trim();
  }

  const result = await submitToCms("application", {
    name,
    email,
    phone,
    coverLetter,
    resumePath,
    careerId: null,
    locale,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: "We could not record your application. Please email info@norr3.fi instead." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
