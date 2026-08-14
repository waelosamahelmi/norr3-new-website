import { Icon } from "@/components/Icon";
import { HoverLift } from "@/components/HoverLift";
import { houseBio, type TeamMember } from "@/content/team";
import type { Locale } from "@/i18n/config";

const COMPANY_LINKEDIN = "https://www.linkedin.com/company/norr3/";

/** Small outlined action chip used for the per-person LinkedIn / email links.
 *  Sized so two chips always fit a card column, and it carries its own focus
 *  ring — the card itself is not a link, so these are the only tab stops. */
const chipClass =
  "inline-flex items-center gap-1.5 rounded-full border border-ink/25 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:border-white/25 dark:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-ink dark:focus-visible:outline-light-purple";

/** Management Team card: headshot, name, role, short bio, LinkedIn/Email chips.
 *
 *  Warm + human: HoverLift + a portrait that sits slightly de-saturated at rest
 *  and lifts to full colour behind a thin purple keyline on hover. Every card
 *  is the same shape — square photo (720×720 → no CLS), name, an always-present
 *  role line (a hairline placeholder keeps rows aligned when a role is unset)
 *  and the chip row pinned to the bottom — so 17 faces read as one roster
 *  rather than 17 different cards. Links fall back to the company LinkedIn +
 *  info@norr3.fi when no personal ones are set (never fabricated). */
export function TeamMemberCard({
  member,
  locale,
  linkedinLabel,
  emailLabel,
}: {
  member: TeamMember;
  locale: Locale;
  linkedinLabel: string;
  emailLabel: string;
}) {
  const linkedinHref = member.linkedin ?? COMPANY_LINKEDIN;
  const emailHref = `mailto:${member.email ?? "info@norr3.fi"}`;
  // Only a bio written for this person earns space on the card.
  const ownBio = member.bio === houseBio ? null : member.bio[locale];
  return (
    <HoverLift className="h-full" lift={4} scale={1.01}>
      <article className="group/member flex h-full flex-col">
        <div className="relative aspect-square overflow-hidden rounded-card bg-grey dark:bg-white/[0.06]">
          <img
            src={member.photo}
            alt={member.name}
            width={720}
            height={720}
            className="h-full w-full object-cover grayscale-[0.15] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/member:scale-[1.04] group-hover/member:grayscale-0"
            loading="lazy"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-card ring-0 ring-inset ring-purple/0 transition-all duration-500 group-hover/member:ring-2 group-hover/member:ring-purple/70"
          />
        </div>
        <h3 className="mt-5 text-lg font-medium leading-snug text-ink dark:text-white">{member.name}</h3>
        {member.role ? (
          <p className="mt-1.5 text-[11px] font-medium uppercase leading-relaxed tracking-[0.12em] text-purple dark:text-light-purple">
            {member.role[locale]}
          </p>
        ) : (
          <span aria-hidden className="mt-1.5 block h-px w-8 bg-black/15 dark:bg-white/20" />
        )}
        {ownBio && <p className="mt-3 text-[13px] leading-relaxed text-ink/60 dark:text-white/60">{ownBio}</p>}
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          <a
            href={linkedinHref}
            target="_blank"
            rel="noreferrer"
            aria-label={`${member.name} — LinkedIn`}
            className={chipClass}
          >
            {linkedinLabel}
            <Icon name="arrow_outward" style={{ fontSize: "14px" }} />
          </a>
          <a href={emailHref} aria-label={`${emailLabel} — ${member.name}`} className={chipClass}>
            {emailLabel}
            <Icon name="mail" style={{ fontSize: "14px" }} />
          </a>
        </div>
      </article>
    </HoverLift>
  );
}

/** The yellow "View all" tile closing the team grid — same square-photo
 *  proportions as a member card, so the grid keeps its rhythm. */
export function ViewAllTile({ title, body }: { title: string; body: string }) {
  return (
    <HoverLift className="h-full" lift={4} scale={1.01}>
      <a
        href={COMPANY_LINKEDIN}
        target="_blank"
        rel="noreferrer"
        className="group/tile flex h-full flex-col rounded-card bg-yellow p-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-[5px] bg-white/60 text-ink">
          <Icon name="sentiment_satisfied" style={{ fontSize: "30px" }} />
        </span>
        <h3 className="mt-auto pt-8 text-xl font-medium text-ink">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink/70">{body}</p>
        <span className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full border border-ink/30 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-ink transition-colors group-hover/tile:bg-ink group-hover/tile:text-white">
          LinkedIn
          <Icon name="arrow_outward" style={{ fontSize: "14px" }} />
        </span>
      </a>
    </HoverLift>
  );
}
