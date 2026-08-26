import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { PillMarquee } from "./marquee/PillMarquee";

/**
 * Full-bleed, full-screen parallax band: the photograph fills the viewport as a
 * CSS background (cover) and uses `background-attachment: fixed` on desktop so
 * it stays put while the page scrolls over it — the classic "reveal on scroll"
 * parallax, no JavaScript. On touch devices (where `fixed` attachment is
 * unreliable) the image simply scrolls with the band, which is the graceful
 * degradation.
 *
 * `role="img"` + `aria-label` carry the alt text a CSS background cannot hold.
 */
export function ParallaxBand({
  image,
  alt,
  caption,
  pills,
}: {
  image: string;
  alt: string;
  caption?: string;
  pills: { id: string; icon: string; label: string }[];
}) {
  return (
    <section
      role="img"
      aria-label={alt}
      className="relative flex min-h-[100svh] w-full flex-col justify-end bg-cover bg-center bg-scroll md:bg-fixed"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Legibility gradient over the photograph. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/45 via-ink/10 to-ink/60" />

      <Container className="relative z-10 pb-24 pt-40 lg:pb-28">
        <Reveal className="flex justify-center">
          {caption && (
            <p className="max-w-3xl text-center text-xl font-medium leading-relaxed text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.65)] sm:text-2xl lg:text-3xl">
              {caption}
            </p>
          )}
        </Reveal>
        <div className="mt-14">
          <PillMarquee items={pills} duration="40s" monochrome />
        </div>
      </Container>
    </section>
  );
}
