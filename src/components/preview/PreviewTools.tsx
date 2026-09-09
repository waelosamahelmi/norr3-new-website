"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/Icon";

export type PreviewComment = {
  id: number;
  x: number;
  y: number;
  author: string;
  body: string;
  status: string;
  created_at: string;
};

/**
 * The client-approval toolbar on /case-preview/<slug>.
 *
 *  - "Kommentoi": click anywhere on the page → a pin drops → name + note →
 *    saved to the CMS, where the editor sees and resolves them.
 *  - "Hyväksy": one press publishes the case (CMS flips visible = 1), so an
 *    approved draft goes live with no second human step.
 */
export default function PreviewTools({
  slug,
  locale,
  initialComments,
}: {
  slug: string;
  locale: string;
  initialComments: PreviewComment[];
}) {
  const fi = locale === "fi";
  const [comments, setComments] = useState<PreviewComment[]>(initialComments);
  const [mode, setMode] = useState(false);
  const [pin, setPin] = useState<{ x: number; y: number; vx: number; vy: number } | null>(null);
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [openPin, setOpenPin] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!mode) return;
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement | null)?.closest("[data-preview-tools]")) return;
      e.preventDefault();
      e.stopPropagation();
      const docH = Math.max(document.documentElement.scrollHeight, 1);
      setPin({
        x: (e.clientX / Math.max(window.innerWidth, 1)) * 100,
        y: ((window.scrollY + e.clientY) / docH) * 100,
        vx: e.clientX,
        vy: e.clientY,
      });
    };
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [mode]);

  async function submitPin() {
    if (!pin || !name.trim() || !text.trim()) return;
    setBusy(true);
    const res = await fetch("/api/case-comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, author: name.trim(), body: text.trim(), x: pin.x, y: pin.y }),
    }).catch(() => null);
    setBusy(false);
    if (res?.ok) {
      const data = (await res.json().catch(() => ({}))) as { id?: number };
      setComments((current) => [
        ...current,
        { id: data.id ?? Date.now(), x: pin.x, y: pin.y, author: name.trim(), body: text.trim(), status: "open", created_at: "" },
      ]);
    }
    setPin(null);
    setText("");
  }

  async function approve() {
    const sure = window.confirm(
      fi
        ? "Hyväksytkö tämän casen julkaistavaksi norr3.fi-sivustolle?"
        : "Approve this case for publication on norr3.fi?"
    );
    if (!sure) return;
    setBusy(true);
    const res = await fetch("/api/case-approve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    }).catch(() => null);
    setBusy(false);
    if (res?.ok) window.location.href = `/${locale}/${slug}`;
  }

  const open = comments.filter((c) => c.status === "open");
  const selected = comments.find((c) => c.id === openPin) ?? null;

  return (
    <>
      {/* Numbered pins over the whole page (y is a % of document height). */}
      <div className="pointer-events-none absolute inset-0 z-[70]">
        {open.map((c, i) => (
          <button
            key={c.id}
            type="button"
            data-preview-tools
            onClick={() => setOpenPin(openPin === c.id ? null : c.id)}
            className="pointer-events-auto absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-purple text-[12px] font-semibold text-white shadow-lg ring-2 ring-white transition-transform hover:scale-110"
            style={{ left: `${c.x}%`, top: `${c.y}%` }}
            aria-label={`${c.author}: ${c.body}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {mode && (
        <div
          data-preview-tools
          className="fixed inset-x-0 top-10 z-[90] bg-purple py-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-white"
        >
          {fi ? "Kommentointitila — klikkaa kohtaa sivulla" : "Comment mode — click anywhere on the page"}
        </div>
      )}

      {pin && (
        <div
          data-preview-tools
          className="fixed z-[95] w-72 rounded-xl bg-white p-3 shadow-2xl ring-1 ring-black/10"
          style={{
            left: Math.min(pin.vx, (typeof window !== "undefined" ? window.innerWidth : 1200) - 300),
            top: Math.min(pin.vy, (typeof window !== "undefined" ? window.innerHeight : 800) - 220),
          }}
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={fi ? "Nimesi" : "Your name"}
            className="mb-2 w-full rounded-lg border border-ink/15 px-2.5 py-1.5 text-[13px] outline-none focus:border-purple"
          />
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder={fi ? "Mitä tähän kohtaan pitäisi muuttaa?" : "What should change here?"}
            className="mb-2 w-full rounded-lg border border-ink/15 px-2.5 py-1.5 text-[13px] outline-none focus:border-purple"
          />
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={submitPin}
              className="flex-1 rounded-full bg-ink px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white hover:bg-purple"
            >
              {fi ? "Tallenna" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setPin(null)}
              className="rounded-full px-3 py-1.5 text-[11px] font-medium text-ink/50 hover:bg-black/5"
            >
              {fi ? "Peruuta" : "Cancel"}
            </button>
          </div>
        </div>
      )}

      {selected && (
        <div
          data-preview-tools
          className="fixed bottom-24 left-4 z-[95] w-80 rounded-xl bg-white p-3.5 shadow-2xl ring-1 ring-black/10"
        >
          <p className="text-[12px] font-semibold text-ink">
            {selected.author} <span className="font-normal text-ink/40">· {String(selected.created_at).slice(0, 16)}</span>
          </p>
          <p className="mt-1 text-[13px] leading-relaxed text-ink/75">{selected.body}</p>
          <button
            type="button"
            onClick={() => setOpenPin(null)}
            className="mt-2 text-[11px] font-medium text-purple underline-offset-2 hover:underline"
          >
            {fi ? "Sulje" : "Close"}
          </button>
        </div>
      )}

      <div data-preview-tools className="fixed bottom-5 right-4 z-[95] flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={() => {
            setMode((m) => !m);
            setPin(null);
          }}
          className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] shadow-xl transition-colors ${
            mode ? "bg-purple text-white" : "bg-white text-ink ring-1 ring-black/10 hover:bg-black/5"
          }`}
        >
          <Icon name="chat" style={{ fontSize: "16px" }} />
          {fi ? "Kommentoi" : "Comment"}
          {open.length > 0 && <span className="rounded-full bg-yellow px-1.5 text-[10px] text-ink">{open.length}</span>}
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={approve}
          className="flex items-center gap-2 rounded-full bg-yellow px-4 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-ink shadow-xl transition-colors hover:bg-lime"
        >
          <Icon name="task_alt" style={{ fontSize: "16px" }} />
          {fi ? "Hyväksy ja julkaise" : "Approve & publish"}
        </button>
      </div>
    </>
  );
}
