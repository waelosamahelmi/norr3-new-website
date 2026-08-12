import { Icon } from "@/components/Icon";
import type { TeamMember } from "@/content/team";
import type { Locale } from "@/i18n/config";

/** Management Team card: photo, name, role, short bio, LinkedIn/Email link row. */
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
  return (
    <div className="flex h-full flex-col">
      <div className="aspect-square overflow-hidden">
        <img src={member.photo} alt={member.name} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <h3 className="mt-4 text-xl font-medium text-ink">{member.name}</h3>
      {member.role && <p className="mt-0.5 text-sm text-ink/60">{member.role[locale]}</p>}
      <p className="mt-3 text-[13px] leading-relaxed text-ink/60">{member.bio[locale]}</p>
      <div className="mt-auto flex gap-5 border-t border-black/20 pt-3 text-xs font-medium text-ink">
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-purple">
          {linkedinLabel} <span aria-hidden>→</span>
        </a>
        <a href="mailto:info@norr3.fi" className="inline-flex items-center gap-1 hover:text-purple">
          {emailLabel} <span aria-hidden>→</span>
        </a>
      </div>
    </div>
  );
}

/** The yellow "View all" tile closing the team grid. */
export function ViewAllTile({ title, body }: { title: string; body: string }) {
  return (
    <a
      href="https://linkedin.com"
      target="_blank"
      rel="noreferrer"
      className="flex h-full flex-col bg-yellow p-8 transition-transform duration-300 hover:-translate-y-1"
    >
      <span className="flex h-16 w-16 items-center justify-center self-center rounded-[5px] bg-white/60 text-ink my-auto">
        <Icon name="sentiment_satisfied" style={{ fontSize: "30px" }} />
      </span>
      <h3 className="text-xl font-medium text-ink">{title}</h3>
      <p className="mt-1 text-sm text-ink/70">{body}</p>
      <span className="mt-4 inline-flex items-center gap-1 border-t border-ink/30 pt-3 text-xs font-medium text-ink">
        LinkedIn <span aria-hidden>→</span>
      </span>
    </a>
  );
}
