/**
 * Flat brand illustrations for the Merch page.
 *
 * Hand-drawn inline SVG rather than product photos: there is no shoot yet and
 * the shapes carry the brand colours (tokens, not hex) straight from the theme,
 * so they follow the CMS theme editor like every other surface.
 */

export type ProductArtKind = "hoodie" | "tshirt" | "cap" | "beanie" | "tote" | "stickers";

export function ProductArt({ kind, className = "" }: { kind: ProductArtKind; className?: string }) {
  return (
    <svg viewBox="0 0 240 240" className={className} aria-hidden="true" focusable="false">
      {kind === "hoodie" && (
        <>
          {/* Hood hugging the shoulders */}
          <path
            d="M120 28c-30 0-54 22-54 50 0 10 3 19 8 27l10-7c-4-6-6-13-6-20 0-22 19-38 42-38s42 16 42 38c0 7-2 14-6 20l10 7c5-8 8-17 8-27 0-28-24-50-54-50z"
            className="fill-violet"
          />
          {/* Body with sleeves */}
          <path
            d="M92 62 48 86l14 40 22-8v94c0 5 4 9 9 9h54c5 0 9-4 9-9v-94l22 8 14-40-44-24c-4 12-15 19-28 19s-24-7-28-19z"
            className="fill-purple"
          />
          {/* Hood opening */}
          <path d="M99 64c5-8 12-12 21-12s16 4 21 12c-5 8-12 12-21 12s-16-4-21-12z" className="fill-ink" opacity="0.18" />
          {/* Drawstrings */}
          <path d="M112 74v38M128 74v38" className="stroke-yellow" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Kangaroo pocket */}
          <path d="M95 150h50v30c0 6-5 10-10 10h-30c-5 0-10-4-10-10z" className="fill-violet" />
          <path d="M95 150h50" className="stroke-purple" strokeWidth="4" fill="none" opacity="0.5" />
        </>
      )}

      {kind === "tshirt" && (
        <>
          <path
            d="M92 62 48 86l14 40 22-8v94c0 5 4 9 9 9h54c5 0 9-4 9-9v-94l22 8 14-40-44-24c-4 12-15 19-28 19s-24-7-28-19z"
            className="fill-violet"
          />
          <path d="M120 126l17 28h-34z" className="fill-yellow" />
        </>
      )}

      {kind === "cap" && (
        <>
          <path d="M120 62c38 0 68 28 68 66H52c0-38 30-66 68-66z" className="fill-violet" />
          <path d="M120 62v64M92 68l-6 58M148 68l6 58" className="stroke-purple" strokeWidth="4" fill="none" opacity="0.55" />
          <circle cx="120" cy="62" r="8" className="fill-purple" />
          <rect x="30" y="128" width="180" height="34" rx="17" className="fill-purple" />
          <path d="M120 96l14 24h-28z" className="fill-yellow" />
        </>
      )}

      {kind === "beanie" && (
        <>
          <path d="M56 150c0-62 26-92 64-92s64 30 64 92z" className="fill-violet" />
          <path
            d="M84 62l-4 88M108 56l-2 94M132 56l2 94M156 62l4 88"
            className="stroke-purple"
            strokeWidth="5"
            fill="none"
            opacity="0.5"
          />
          <rect x="44" y="144" width="152" height="48" rx="16" className="fill-purple" />
          <path d="M92 168h56" className="stroke-yellow" strokeWidth="4" strokeLinecap="round" fill="none" />
          <circle cx="120" cy="50" r="12" className="fill-yellow" />
        </>
      )}

      {kind === "tote" && (
        <>
          <path
            d="M92 92V78c0-16 12-28 28-28s28 12 28 28v14"
            className="stroke-purple"
            strokeWidth="12"
            strokeLinecap="round"
            fill="none"
          />
          <path d="M60 92h120l-8 118c0 6-5 10-11 10H79c-6 0-11-4-11-10z" className="fill-violet" />
          <path d="M120 128l18 30h-36z" className="fill-yellow" />
          <circle cx="92" cy="186" r="5" className="fill-purple" />
          <circle cx="120" cy="186" r="5" className="fill-purple" />
          <circle cx="148" cy="186" r="5" className="fill-purple" />
        </>
      )}

      {kind === "stickers" && (
        <>
          {/* the sheet, tilted */}
          <g transform="rotate(-7 120 122)">
            <rect x="62" y="54" width="116" height="136" rx="12" className="fill-white" />
            <rect
              x="62"
              y="54"
              width="116"
              height="136"
              rx="12"
              fill="none"
              strokeWidth="3"
              className="stroke-ink"
              opacity="0.12"
            />
            {/* stickers on the sheet */}
            <rect x="76" y="70" width="40" height="40" rx="10" className="fill-yellow" />
            <path d="M96 80l11 19h-22z" className="fill-ink" />
            <circle cx="146" cy="90" r="20" className="fill-purple" />
            <circle cx="146" cy="90" r="8" fill="none" strokeWidth="5" className="stroke-white" />
            <rect x="76" y="122" width="40" height="40" rx="10" className="fill-violet" />
            <path d="M96 132v20M86 142h20" className="stroke-yellow" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M146 120l16 11-16 11z" className="fill-purple" />
            <rect x="126" y="150" width="40" height="24" rx="12" className="fill-yellow" />
            <circle cx="90" cy="176" r="10" className="fill-lime" />
          </g>
          {/* a sticker peeling off the corner */}
          <g transform="rotate(-18 178 188)">
            <circle cx="178" cy="188" r="19" className="fill-purple" />
            <path d="M178 176l9 12h-18z" className="fill-yellow" />
          </g>
        </>
      )}
    </svg>
  );
}
