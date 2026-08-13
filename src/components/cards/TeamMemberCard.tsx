import { Icon } from "@/components/Icon";
import { HoverLift } from "@/components/HoverLift";
import type { TeamMember } from "@/content/team";
import type { Locale } from "@/i18n/config";

const COMPANY_LINKEDIN = "https://www.linkedin.com/company/norr3/";

/** Management Team card: photo, name, role, short bio, LinkedIn/Email link row.
 *  Warm + human: HoverLift + a photo that de-saturates slightly at rest and
 *  lifts to full colour with a thin purple keyline on hover. Per-person links
 *  fall back to the company LinkedIn + info@norr3.fi when none are set (never
 *  fabricated). Photo sits in an aspect-square box (720×720 → no CLS). */
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
  return (
    <HoverLift className="h-full" lift={4} scale={1.01}>
      <div className="group/member flex h-full flex-col rounded-[5px]">
        <div className="relative aspect-square overflow-hidden rounded-[5px]">
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
            className="pointer-events-none absolute inset-0 rounded-[5px] ring-0 ring-inset ring-purple/0 transition-all duration-500 group-hover/member:ring-2 group-hover/member:ring-purple/70"
          />
        </div>
        <h3 className="mt-4 text-xl font-medium text-ink">{member.name}</h3>
        {member.role && <p className="mt-0.5 text-sm text-ink/60">{member.role[locale]}</p>}
        <p className="mt-3 text-[13px] leading-relaxed text-ink/60">{member.bio[locale]}</p>
        <div className="mt-auto flex gap-5 border-t border-black/20 pt-3 text-xs font-medium text-ink">
          <a
            href={linkedinHref}
            target="_blank"
            rel="noreferrer"
            aria-label={`${member.name} — LinkedIn`}
            className="inline-flex items-center gap-1 transition-colors hover:text-purple"
          >
            {linkedinLabel} <span aria-hidden>→</span>
          </a>
          <a
            href={emailHref}
            aria-label={`${emailLabel} ${member.name}`}
            className="inline-flex items-center gap-1 transition-colors hover:text-purple"
          >
            {emailLabel} <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </HoverLift>
  );
}

/** The yellow "View all" tile closing the team grid. */
export function ViewAllTile({ title, body }: { title: string; body: string }) {
  return (
    <HoverLift className="h-full" lift={4} scale={1.01}>
      <a
        href={COMPANY_LINKEDIN}
        target="_blank"
        rel="noreferrer"
        className="flex h-full flex-col rounded-[5px] bg-yellow p-8"
      >
        <span className="my-auto flex h-16 w-16 items-center justify-center self-center rounded-[5px] bg-white/60 text-ink">
          <Icon name="sentiment_satisfied" style={{ fontSize: "30px" }} />
        </span>
        <h3 className="text-xl font-medium text-ink">{title}</h3>
        <p className="mt-1 text-sm text-ink/70">{body}</p>
        <span className="mt-4 inline-flex items-center gap-1 border-t border-ink/30 pt-3 text-xs font-medium text-ink">
          LinkedIn <span aria-hidden>→</span>
        </span>
      </a>
    </HoverLift>
  );
}
