import { PillMarquee } from "./marquee/PillMarquee";
import { Reveal } from "./Reveal";
import { ParallaxImage } from "./ParallaxImage";

/**
 * Full-width photo with a caption line near the bottom and the pill marquee
 * overlaying the photo's bottom edge — straight from the Figma layout.
 * The photo now runs a subtle GSAP parallax (background layer only, ~10%
 * drift) instead of a static <img>, per the UX motion guidelines.
 */
export function PhotoInterstitial({
  image,
  caption,
  pills,
  alt = "",
}: {
  image: string;
  caption?: string;
  pills: { id: string; icon: string; label: string }[];
  alt?: string;
}) {
  return (
    <Reveal className="relative">
      {/* 25px radius per BRAND_GUIDELINES §5 — it sits inside the Container
          gutters, so it is a contained surface, not a full-bleed band. */}
      <div className="relative max-h-[560px] overflow-hidden rounded-card">
        <ParallaxImage src={image} alt={alt} className="max-h-[560px]" />
        {caption && (
          <p className="absolute bottom-24 left-1/2 w-[90%] -translate-x-1/2 text-center text-sm text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
            {caption}
          </p>
        )}
        <div className="absolute bottom-6 left-0 right-0">
          <PillMarquee items={pills} duration="40s" />
        </div>
      </div>
    </Reveal>
  );
}
