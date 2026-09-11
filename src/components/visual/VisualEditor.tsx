"use client";

import { useEffect } from "react";

/**
 * Edit mode for the live site.
 *
 * The CMS frames the real website and sends it an index of every string and
 * image it owns. This overlay matches those values against what is actually on
 * screen: the page was rendered from that same data, so an exact text match
 * identifies exactly which record produced it. Nothing in the site's ~150
 * components had to be annotated, and a section added tomorrow becomes editable
 * the moment its content lives in the CMS.
 *
 * The overlay itself has no privileges. It never writes anything and never
 * talks to the CMS API — it posts what the editor did to the parent frame,
 * which is same-origin with the CMS and already authenticated. So the worst a
 * hostile page could do by loading the site with `?norr3-edit=1` is highlight
 * some text for itself.
 */

type Entry = {
  id: string;
  type: "text" | "html" | "image";
  label: string;
  group: string;
  /** Route slug this entry belongs to; empty means it can appear anywhere. */
  scope?: string;
  fi: string;
  en: string;
};

type Mark = {
  entry: Entry;
  element: HTMLElement;
  original: string;
  /** Matched on the element's own text nodes, not on everything it contains. */
  own?: boolean;
};

const PARAM = "norr3-edit";
const SESSION_KEY = "norr3-visual-edit";
const UI_ATTR = "data-norr3-ve-ui";

/**
 * Above this many records sharing a string, the string identifies none of them.
 * Set where it still drops the Media Insights boilerplate (one label is repeated
 * across 246 rows) while leaving ordinary words like "Palvelut" — which the
 * hover label disambiguates before anything is clicked — editable.
 */
const MAX_CANDIDATES = 12;

export default function VisualEditor() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const requested = params.get(PARAM) === "1";
    // Edit mode has to survive the editor clicking a link: the query string is
    // gone after a client-side navigation, but the session it belongs to is not.
    if (requested) {
      try {
        sessionStorage.setItem(SESSION_KEY, params.get("origin") ?? "*");
      } catch {
        /* private mode — the param still covers this page */
      }
    }
    let allowedOrigin = "*";
    try {
      allowedOrigin = requested ? params.get("origin") ?? "*" : sessionStorage.getItem(SESSION_KEY) ?? "";
    } catch {
      allowedOrigin = requested ? params.get("origin") ?? "*" : "";
    }
    if (!requested && !allowedOrigin) return;
    if (window.parent === window) return; // only ever inside the CMS frame

    return start(allowedOrigin || "*");
  }, []);

  return null;
}

/* --------------------------------------------------------------- the engine */

function start(allowedOrigin: string) {
  const post = (message: Record<string, unknown>) => {
    window.parent.postMessage({ source: "norr3-visual", ...message }, allowedOrigin);
  };

  let locale: "fi" | "en" = document.documentElement.lang === "en" ? "en" : "fi";
  let textIndex = new Map<string, Entry[]>();
  let imageIndex = new Map<string, Entry[]>();
  let marks: Mark[] = [];
  let editing: Mark | null = null;
  let enabled = true;

  const style = document.createElement("style");
  style.setAttribute(UI_ATTR, "");
  style.textContent = STYLESHEET;
  document.head.appendChild(style);

  const hud = document.createElement("div");
  hud.setAttribute(UI_ATTR, "");
  hud.className = "n3ve-hud";
  document.body.appendChild(hud);

  const say = (text: string, tone: "info" | "ok" | "error" = "info") => {
    hud.textContent = text;
    hud.dataset.tone = tone;
    hud.dataset.show = "1";
    window.clearTimeout(hudTimer);
    hudTimer = window.setTimeout(() => (hud.dataset.show = "0"), tone === "error" ? 5200 : 1900);
  };
  let hudTimer = 0;

  /* ---------------------------------------------------------------- indexing */

  const buildIndexes = (entries: Entry[]) => {
    textIndex = new Map();
    imageIndex = new Map();
    for (const entry of entries) {
      if (entry.type === "image") {
        // Both locales carry the same path for an image.
        add(imageIndex, normalizePath(entry.fi), entry);
        continue;
      }
      // Both language values are indexed: an English page still shows the
      // Finnish string wherever English has not been filled in, and clicking
      // that string should open the English field, not fail to match.
      for (const value of [entry.fi, entry.en]) {
        const key = normalizeText(value);
        if (identifiable(key)) add(textIndex, key, entry);
      }
    }

    /* A value that dozens of records share cannot identify any one of them.
       The site's Media Insights boxes repeat their round label and their
       margin of error ("±2,2") across hundreds of rows; highlighting those
       would offer an edit that lands on an arbitrary one of them. Dropping the
       key entirely is the honest outcome — that text is edited in its own
       screen, where the editor can see which row they are changing. */
    for (const [key, list] of textIndex) {
      if (list.length > MAX_CANDIDATES) textIndex.delete(key);
    }
  };

  /**
   * Whether a string is distinctive enough to be found again in the DOM.
   * Bare numbers, units and one-word fragments match far too much of a page.
   */
  const identifiable = (key: string): boolean => key.length >= 3 && /\p{L}{2}/u.test(key);

  const add = (map: Map<string, Entry[]>, key: string, entry: Entry) => {
    const list = map.get(key);
    if (list) list.push(entry);
    else map.set(key, [entry]);
  };

  /* ----------------------------------------------------------------- marking */

  const clearMarks = () => {
    for (const mark of marks) unmark(mark.element);
    marks = [];
  };

  const unmark = (element: HTMLElement) => {
    element.removeAttribute("data-n3ve");
    element.removeAttribute("data-n3ve-id");
    element.removeAttribute("data-n3ve-label");
    element.removeAttribute("data-n3ve-own");
  };

  /**
   * Marks are diffed rather than rebuilt.
   *
   * The site animates continuously — marquees, reveals, a rotating card stack —
   * so the mutation observer fires every few hundred milliseconds. Clearing and
   * re-adding every attribute on each pass made the outlines and hover labels
   * flicker, and left a click landing in the gap. Only elements that actually
   * gained or lost a match are touched now.
   */
  const scan = () => {
    if (!enabled || editing) return;
    const previous = marks;
    marks = [];

    /* Text. Each element is compared against the index twice: on everything it
       contains, and on its own text nodes alone. The second pass is what makes
       the site's decorated elements editable — the hero headline ends in a
       blinking caret span and a nav item ends in a chevron span, so their full
       text is "A New Way to_" and "Palvelut▾", which match nothing. Their own
       text is exactly the stored string. */
    const hits: (Mark & { key: string })[] = [];
    for (const element of Array.from(document.body.querySelectorAll<HTMLElement>("*"))) {
      if (skip(element)) continue;

      const full = normalizeText(element.textContent ?? "");
      if (full.length < 2 || full.length > 1500) continue;

      const entries = textIndex.get(full);
      if (entries) {
        hits.push({ entry: pick(entries, element), element, original: element.textContent ?? "", key: full, own: false });
        continue;
      }
      if (element.children.length === 0) continue;

      const own = normalizeText(ownText(element));
      if (own.length < 2 || own === full) continue;
      const ownEntries = textIndex.get(own);
      if (ownEntries) hits.push({ entry: pick(ownEntries, element), element, original: own, key: own, own: true });
    }

    /* The deepest match wins: a heading and the section wrapping it hold the
       same string, and the heading is what the editor is pointing at. Only a
       descendant whose text is *part of* this one displaces it, so a wrapper
       matched on its own text survives a separate match further down. */
    for (const hit of hits) {
      if (hits.some((other) => other !== hit && hit.element.contains(other.element) && hit.key.includes(other.key))) {
        continue;
      }
      mark(hit, "text");
    }

    /* Images, including the one band that paints its picture as a background. */
    for (const image of Array.from(document.querySelectorAll<HTMLImageElement>("img, video"))) {
      if (skip(image)) continue;
      const entries = imageIndex.get(normalizePath(sourceOf(image)));
      if (!entries) continue;
      mark({ entry: pick(entries, image), element: image, original: sourceOf(image) }, "image");
    }
    for (const element of Array.from(document.querySelectorAll<HTMLElement>('[style*="background-image"]'))) {
      if (skip(element)) continue;
      const url = /url\((['"]?)([^'")]+)\1\)/.exec(element.style.backgroundImage)?.[2] ?? "";
      const entries = imageIndex.get(normalizePath(url));
      if (!entries) continue;
      mark({ entry: pick(entries, element), element, original: url }, "image");
    }

    // Anything matched last time and not this time loses its marking.
    const kept = new Set(marks.map((m) => m.element));
    for (const stale of previous) {
      if (!kept.has(stale.element)) unmark(stale.element);
    }

    post({
      type: "stats",
      text: marks.filter((m) => m.entry.type !== "image").length,
      image: marks.filter((m) => m.entry.type === "image").length,
      href: window.location.pathname + window.location.search,
      title: document.title,
    });
  };

  const mark = (hit: Mark, kind: "text" | "image") => {
    const element = hit.element;
    // Writing an attribute that already holds this value would be a mutation of
    // its own, and the observer would schedule another scan for it.
    if (element.getAttribute("data-n3ve-id") !== hit.entry.id) {
      element.setAttribute("data-n3ve", kind);
      element.setAttribute("data-n3ve-id", hit.entry.id);
      element.setAttribute("data-n3ve-label", hit.entry.label);
      if (hit.own) element.setAttribute("data-n3ve-own", "1");
      else element.removeAttribute("data-n3ve-own");
    }
    marks.push(hit);
  };

  /**
   * When one string maps to several records, prefer the one whose label points
   * at the page being looked at — the same word can be a nav item and a
   * heading, and the heading is what was clicked.
   */
  const pick = (entries: Entry[], element: HTMLElement): Entry => {
    if (entries.length === 1) return entries[0];
    const slug = window.location.pathname.split("/").filter(Boolean).pop() ?? "";

    /* Route scope decides first, and decisively. One studio photo is both the
       home page's section image and a blog post's cover; on the home page it is
       the section image, and no amount of label matching says that as plainly
       as "this post is not the page you are on". Entries belonging to some
       other route are dropped; global entries stay in the running. */
    const onRoute = entries.filter((entry) => !entry.scope || entry.scope === slug);
    let pool = onRoute.length > 0 ? onRoute : entries;
    // Within the page's own route, its own records beat the global ones.
    const owned = pool.filter((entry) => entry.scope === slug && slug);
    if (owned.length > 0) pool = owned;
    if (pool.length === 1) return pool[0];

    // Then chrome: a word in the header is a menu item even when a section of
    // the page happens to be headed with the same word.
    const chrome = /menu item|nav|footer|cta|announcement/i;
    const inChrome = Boolean(element.closest("nav, header, footer"));
    const byRegion = pool.filter((entry) => chrome.test(entry.label) === inChrome);
    if (byRegion.length > 0) pool = byRegion;

    return pool.find((entry) => !inChrome && slug && entry.label.toLowerCase().includes(slug)) ?? pool[0];
  };

  const skip = (element: Element): boolean =>
    element.hasAttribute(UI_ATTR) ||
    Boolean(element.closest(`[${UI_ATTR}]`)) ||
    /^(SCRIPT|STYLE|NOSCRIPT|SVG|PATH|CANVAS|IFRAME|INPUT|TEXTAREA|SELECT|OPTION|BR|HR)$/.test(element.tagName);

  /* ---------------------------------------------------------------- editing */

  const beginEdit = (mark: Mark) => {
    editing = mark;
    const element = mark.element;
    mark.original = mark.own ? ownText(element) : element.textContent ?? "";
    element.setAttribute("data-n3ve-editing", "1");
    // plaintext-only keeps pasted markup out of a field that stores prose;
    // browsers without it still get a usable plain edit.
    element.setAttribute("contenteditable", "plaintext-only");
    if (element.contentEditable !== "plaintext-only") element.setAttribute("contenteditable", "true");
    element.focus();
    selectEditable(element, mark.own);
    say(`Editing ${mark.entry.label} · ${locale.toUpperCase()} — Enter saves, Esc cancels`);

    const finish = (commit: boolean) => {
      element.removeEventListener("keydown", onKey);
      element.removeEventListener("blur", onBlur);
      element.removeAttribute("contenteditable");
      element.removeAttribute("data-n3ve-editing");
      editing = null;

      // Reading the own text back keeps a decorative child (the caret, the
      // chevron) out of the saved value even though it sat inside the field.
      const next = (mark.own ? ownText(element) : element.textContent ?? "").replace(/\s+/g, " ").trim();
      const before = mark.original.replace(/\s+/g, " ").trim();
      if (!commit || next === before) {
        if (!commit) restore(mark);
        scan();
        return;
      }
      if (!next) {
        restore(mark);
        say("Empty text is not saved — use the CMS to clear a field.", "error");
        scan();
        return;
      }
      element.setAttribute("data-n3ve-saving", "1");
      post({ type: "save", entryId: mark.entry.id, locale, value: next, label: mark.entry.label });
      pending.set(mark.entry.id, { element, previous: mark.original, own: mark.own });
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        finish(false);
      }
      // A single-line field commits on Enter; a paragraph keeps Enter for
      // line breaks and commits on Cmd/Ctrl+Enter or on blur.
      const multiline = mark.entry.type === "html" || mark.original.length > 140;
      if (event.key === "Enter" && (!multiline || event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        finish(true);
      }
    };
    const onBlur = () => finish(true);

    element.addEventListener("keydown", onKey);
    element.addEventListener("blur", onBlur);
  };

  const pending = new Map<string, { element: HTMLElement; previous: string; own?: boolean }>();

  const restore = (mark: Mark) => setOwnOrAll(mark.element, mark.original, mark.own);

  /* ---------------------------------------------------------------- pointing */

  const onClick = (event: MouseEvent) => {
    if (!enabled || editing) return;
    const target = markedAt(event);
    if (!target) return;
    const mark = marks.find((candidate) => candidate.element === target);
    if (!mark) return;

    // Editable content frequently sits inside a link or a card that navigates.
    event.preventDefault();
    event.stopPropagation();

    if (mark.entry.type === "image") {
      const rect = target.getBoundingClientRect();
      post({
        type: "image",
        entryId: mark.entry.id,
        label: mark.entry.label,
        path: normalizePath(sourceOf(target)),
        alt: target.getAttribute("alt") ?? "",
        context: contextAround(target),
        pageTitle: document.title,
        rect: { top: rect.top, left: rect.left, width: rect.width, height: rect.height },
      });
      target.setAttribute("data-n3ve-active", "1");
      window.setTimeout(() => target.removeAttribute("data-n3ve-active"), 2400);
      return;
    }
    beginEdit(mark);
  };

  /**
   * The editable element under the pointer.
   *
   * Walking up from the click target is not enough on this site: cards cover
   * their own picture with a stretched link, so the topmost element at the
   * pointer is a transparent overlay that is nobody's ancestor. Everything
   * stacked at that point is checked before giving up, which is what makes a
   * card's image clickable at all.
   */
  const markedAt = (event: MouseEvent): HTMLElement | null => {
    const direct = (event.target as HTMLElement | null)?.closest?.("[data-n3ve]") as HTMLElement | null;
    if (direct) return direct;
    for (const element of document.elementsFromPoint(event.clientX, event.clientY)) {
      const marked = (element as HTMLElement).closest?.("[data-n3ve]") as HTMLElement | null;
      if (marked) return marked;
    }
    return null;
  };

  /** Copy near an image, so the AI can write a prompt that fits the section. */
  const contextAround = (element: HTMLElement): string => {
    const section =
      element.closest("section, article, header, footer, main") ?? element.parentElement ?? document.body;
    const parts: string[] = [];
    for (const node of Array.from(section.querySelectorAll("h1, h2, h3, h4, p, li"))) {
      const text = normalizeText(node.textContent ?? "");
      if (text.length > 2) parts.push(text);
      if (parts.join(" ").length > 2200) break;
    }
    return parts.join("\n").slice(0, 2400);
  };

  /* --------------------------------------------------------------- messaging */

  const onMessage = (event: MessageEvent) => {
    if (allowedOrigin !== "*" && event.origin !== allowedOrigin) return;
    const data = event.data as Record<string, unknown> | null;
    if (!data || data.source !== "norr3-visual-cms") return;

    switch (data.type) {
      case "index": {
        locale = data.locale === "en" ? "en" : "fi";
        buildIndexes((data.entries as Entry[]) ?? []);
        scan();
        break;
      }
      case "locale": {
        locale = data.locale === "en" ? "en" : "fi";
        break;
      }
      case "mode": {
        enabled = data.enabled !== false;
        document.documentElement.toggleAttribute("data-n3ve-on", enabled);
        if (enabled) scan();
        else clearMarks();
        break;
      }
      case "saved": {
        const record = pending.get(String(data.entryId));
        pending.delete(String(data.entryId));
        if (!record) break;
        record.element.removeAttribute("data-n3ve-saving");
        if (data.ok) {
          say("Saved", "ok");
          scan();
        } else {
          setOwnOrAll(record.element, record.previous, record.own);
          say(String(data.error ?? "Save failed"), "error");
          scan();
        }
        break;
      }
      case "image-updated": {
        const element = document.querySelector<HTMLElement>(`[data-n3ve-id="${cssEscape(String(data.entryId))}"]`);
        const path = String(data.path ?? "");
        if (element && path) {
          if (element instanceof HTMLImageElement) {
            element.removeAttribute("srcset");
            element.src = path;
          } else if (element instanceof HTMLVideoElement) {
            element.src = path;
          } else {
            element.style.backgroundImage = `url(${path})`;
          }
        }
        say("Image replaced", "ok");
        break;
      }
      case "rescan": {
        scan();
        break;
      }
    }
  };

  /* ------------------------------------------------------------------ wiring */

  document.documentElement.toggleAttribute("data-n3ve-on", true);

  // The consent banner covers a third of the viewport and has nothing to do
  // with editing. Recording a choice in this browser dismisses it for the rest
  // of the session — it is the editor's own browser, not a visitor's.
  try {
    if (!localStorage.getItem("norr3-cookie-consent")) {
      localStorage.setItem("norr3-cookie-consent", "accepted");
    }
  } catch {
    /* storage blocked — the banner stays, and can be dismissed by hand */
  }

  document.addEventListener("click", onClick, true);
  window.addEventListener("message", onMessage);

  // The site animates and streams in content; re-scan when the DOM settles.
  let scanTimer = 0;
  const observer = new MutationObserver(() => {
    if (editing) return;
    window.clearTimeout(scanTimer);
    scanTimer = window.setTimeout(scan, 400);
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });

  post({ type: "ready", href: window.location.pathname + window.location.search, title: document.title });

  // Client-side navigations keep the frame but change the page.
  let lastPath = window.location.pathname;
  const pathTimer = window.setInterval(() => {
    if (window.location.pathname === lastPath) return;
    lastPath = window.location.pathname;
    post({ type: "navigated", href: lastPath, title: document.title });
    window.setTimeout(scan, 350);
  }, 400);

  return () => {
    document.removeEventListener("click", onClick, true);
    window.removeEventListener("message", onMessage);
    observer.disconnect();
    window.clearInterval(pathTimer);
    window.clearTimeout(scanTimer);
    clearMarks();
    style.remove();
    hud.remove();
    document.documentElement.removeAttribute("data-n3ve-on");
  };
}

/* ------------------------------------------------------------------- helpers */

function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/**
 * The path a CMS record would hold, recovered from what the browser rendered.
 * Next's image optimiser rewrites every `src` into `/_next/image?url=…`, and a
 * path that survived a CDN or a locale prefix still has to match the stored one.
 */
function normalizePath(value: string): string {
  if (!value) return "";
  let path = value.trim();
  if (path.includes("/_next/image")) {
    const encoded = /[?&]url=([^&]+)/.exec(path)?.[1];
    if (encoded) path = decodeURIComponent(encoded);
  }
  try {
    if (/^https?:\/\//.test(path)) path = new URL(path).pathname;
  } catch {
    /* keep the raw value */
  }
  return path.split(/[?#]/)[0];
}

function sourceOf(element: HTMLElement): string {
  if (element instanceof HTMLImageElement) return element.currentSrc || element.src;
  if (element instanceof HTMLVideoElement) return element.currentSrc || element.src;
  return /url\((['"]?)([^'")]+)\1\)/.exec(element.style.backgroundImage)?.[2] ?? "";
}

/** Only the text this element holds directly, skipping its child elements. */
function ownText(element: HTMLElement): string {
  let out = "";
  for (const node of Array.from(element.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE) out += node.nodeValue ?? "";
  }
  return out;
}

/**
 * Put text back, writing over the element's own text nodes when that is what
 * was being edited so a decorative child element survives the undo.
 */
function setOwnOrAll(element: HTMLElement, value: string, own?: boolean) {
  if (!own) {
    element.textContent = value;
    return;
  }
  let written = false;
  for (const node of Array.from(element.childNodes)) {
    if (node.nodeType !== Node.TEXT_NODE) continue;
    node.nodeValue = written ? "" : value;
    written = true;
  }
  if (!written) element.insertBefore(document.createTextNode(value), element.firstChild);
}

/**
 * Preselect what typing will replace.
 *
 * For an own-text match that is the element's own text node alone — selecting
 * the whole element would put the decorative child (a caret, a chevron) inside
 * the selection, and the first keystroke would delete it off the page.
 */
function selectEditable(element: HTMLElement, own?: boolean) {
  const range = document.createRange();
  const textNode = own
    ? Array.from(element.childNodes).find(
        (node) => node.nodeType === Node.TEXT_NODE && (node.nodeValue ?? "").trim()
      )
    : null;
  if (textNode) range.selectNode(textNode);
  else range.selectNodeContents(element);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

function cssEscape(value: string): string {
  return value.replace(/["\\]/g, "\\$&");
}

/* -------------------------------------------------------------------- styles */

const STYLESHEET = `
[data-n3ve-on] [data-n3ve] {
  cursor: pointer;
  border-radius: 3px;
  outline: 1px dashed rgba(122, 6, 211, 0.32);
  outline-offset: 2px;
  transition: outline-color .12s ease, background-color .12s ease;
}
[data-n3ve-on] [data-n3ve="text"] { cursor: text; }
[data-n3ve-on] [data-n3ve]:hover {
  outline: 2px solid #7a06d3;
  outline-offset: 2px;
  background-color: rgba(122, 6, 211, 0.07);
}
[data-n3ve-on] [data-n3ve="image"]:hover { background-color: transparent; box-shadow: 0 0 0 6px rgba(122, 6, 211, 0.14); }
[data-n3ve-on] [data-n3ve][data-n3ve-active] { outline: 3px solid #7a06d3; outline-offset: 3px; }
[data-n3ve-on] [data-n3ve][data-n3ve-editing] {
  outline: 2px solid #7a06d3;
  outline-offset: 3px;
  background-color: rgba(122, 6, 211, 0.06);
  cursor: text;
}
[data-n3ve-on] [data-n3ve][data-n3ve-saving] { opacity: .55; }
[data-n3ve-on] [data-n3ve]::selection { background: rgba(122, 6, 211, 0.25); }

/* The hover label. A pseudo-element rather than a floating node, so it cannot
   fall out of sync with what the pointer is over. */
[data-n3ve-on] [data-n3ve]:hover::after {
  content: attr(data-n3ve-label);
  position: absolute;
  z-index: 2147483000;
  transform: translate(0, -100%);
  margin-top: -6px;
  padding: 3px 8px;
  border-radius: 999px;
  background: #7a06d3;
  color: #fff;
  font: 500 10px/1.5 ui-sans-serif, system-ui, sans-serif;
  letter-spacing: .04em;
  text-transform: none;
  white-space: nowrap;
  pointer-events: none;
  max-width: 60vw;
  overflow: hidden;
  text-overflow: ellipsis;
}
[data-n3ve-on] [data-n3ve][data-n3ve-editing]:hover::after { content: none; }

.n3ve-hud {
  position: fixed;
  left: 50%;
  bottom: 22px;
  z-index: 2147483600;
  transform: translate(-50%, 12px);
  padding: 9px 16px;
  border-radius: 999px;
  background: #0e0b16;
  color: #fff;
  font: 500 12px/1.4 ui-sans-serif, system-ui, sans-serif;
  box-shadow: 0 8px 30px rgba(0,0,0,.28);
  opacity: 0;
  pointer-events: none;
  transition: opacity .16s ease, transform .16s ease;
  max-width: min(560px, 86vw);
  text-align: center;
}
.n3ve-hud[data-show="1"] { opacity: 1; transform: translate(-50%, 0); }
.n3ve-hud[data-tone="ok"] { background: #7a06d3; }
.n3ve-hud[data-tone="error"] { background: #b91c1c; }
`;
