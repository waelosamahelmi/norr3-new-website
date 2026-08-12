import { PillMarquee } from "./marquee/PillMarquee";
import { Reveal } from "./Reveal";

/**
 * Full-width photo with a caption line near the bottom and the pill marquee
 * overlaying the photo's bottom edge — straight from the Figma layout.
 */
export function PhotoInterstitial({
  image,
  caption,
  pills,
}: {
  image: string;
  caption?: string;
  pills: { id: string; icon: string; label: string }[];
}) {
  return (
    <Reveal className="relative">
      <div className="relative max-h-[560px] overflow-hidden">
        <img src={image} alt="" className="h-full max-h-[560px] w-full object-cover" loading="lazy" />
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
