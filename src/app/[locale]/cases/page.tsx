import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import { getDictionary } from "@/lib/dictionary";
import { Container, HeroPill } from "@/components/Container";
import { PillButton } from "@/components/PillButton";
import { Reveal } from "@/components/Reveal";
import { StaggerGrid } from "@/components/StaggerGrid";
import { SectionHeader } from "@/components/SectionHeader";
import { LogoStrip } from "@/components/marquee/LogoStrip";
import { CaseCard } from "@/components/cards/CaseCard";
import { BlogCard } from "@/components/cards/BlogCard";
import { ContactBanner } from "@/components/ContactBanner";
import { cases } from "@/content/cases";
import { insights } from "@/content/insights";

const collageTiles = [
  { src: "/images/office/office-05.jpg", w: "w-24 sm:w-32", stat: "+47%" },
  { src: "/images/office/office-03.jpg", w: "w-32 sm:w-44" },
  { src: "/images/office/office-06.jpg", w: "w-40 sm:w-56" },
  { src: "/images/office/office-09.jpg", w: "w-36 sm:w-52" },
  { src: "/images/office/office-13.jpg", w: "w-32 sm:w-44" },
];

export default async function CasesPage({ params }: PageProps<"/[locale]/cases">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const c = dict.cases;

  const featured = cases.find((x) => x.slug === "flow-festival")!;
  const rest = cases.filter((x) => x.slug !== "flow-festival");

  return (
    <>
      {/* Hero */}
      <Container className="pt-10 lg:pt-16">
        <Reveal>
          <HeroPill>{c.pill}</HeroPill>
        </Reveal>
        <Reveal delay={0.05}>
          <h1 className="mt-5 max-w-5xl text-[8vw] font-medium leading-[1.02] tracking-tight text-ink lg:text-[5.5rem]">
            {c.heroHeadline}
          </h1>
        </Reveal>
        {/* Photo collage strip */}
        <div className="mt-8 flex items-end gap-3 overflow-hidden">
          {collageTiles.map((tile, i) => (
            <Reveal key={tile.src} delay={0.15 + i * 0.08} className={`relative shrink-0 ${tile.w}`}>
              <img
                src={tile.src}
                alt=""
                className="h-40 w-full object-cover sm:h-56"
              />
              {tile.stat && (
                <span className="absolute inset-0 flex items-center justify-center bg-purple text-lg font-medium text-white">
                  {tile.stat}
                </span>
              )}
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.25} className="mt-10 flex flex-col items-start gap-6 pb-14">
          <p className="max-w-sm text-sm leading-relaxed text-ink/80">{c.heroBody}</p>
          <PillButton href={`/${locale}/contact`}>{dict.common.contactUs}</PillButton>
        </Reveal>
      </Container>

      <LogoStrip />

      {/* Cases grid — large feature + smaller cards, like the Figma asymmetric grid */}
      <section className="py-20">
        <Container>
          <SectionHeader heading={c.heading} body={c.body} />
          <div className="mt-14 grid gap-x-6 gap-y-12 lg:grid-cols-2">
            <CaseCard study={featured} locale={locale} readMoreLabel={dict.common.readMore} large />
            <StaggerGrid className="grid gap-x-6 gap-y-12 sm:grid-cols-2">
              {rest.slice(0, 2).map((study) => (
                <CaseCard key={study.slug} study={study} locale={locale} readMoreLabel={dict.common.readMore} />
              ))}
            </StaggerGrid>
          </div>
          <StaggerGrid className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {rest.slice(2).map((study) => (
              <CaseCard key={study.slug} study={study} locale={locale} readMoreLabel={dict.common.readMore} />
            ))}
          </StaggerGrid>
        </Container>
      </section>

      <ContactBanner
        locale={locale}
        heading={c.banner.heading}
        body={c.banner.body}
        cta={dict.common.contactUs}
        tone="yellow"
      />

      {/* Related posts */}
      <section className="py-20">
        <Container>
          <SectionHeader heading={dict.services.relatedPosts} body={dict.home.blog.body} />
          <StaggerGrid className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {insights.map((post) => (
              <BlogCard key={post.slug} post={post} locale={locale} readMoreLabel={dict.common.readMore} />
            ))}
          </StaggerGrid>
        </Container>
      </section>
    </>
  );
}
