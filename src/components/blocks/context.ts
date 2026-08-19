import type { Dictionary } from "@/content/dictionary";
import type { ServiceCard } from "@/content/services";
import type { CaseStudy } from "@/content/cases";
import type { TeamMember, OpenRole } from "@/content/team";
import type { Channel } from "@/content/channels";
import type { CmsPost, SiteContent } from "@/lib/cms";
import type { Locale } from "@/i18n/config";

/**
 * Everything a block might need that is not in its own props.
 *
 * Collection blocks (services grid, cases grid, blog grid…) read live rows
 * rather than storing copies, so publishing a new case updates every page that
 * lists cases. The context is assembled once per render and passed down, which
 * also keeps the renderer a pure client component with no data fetching of its
 * own — the CMS preview route can build the same context from a single fetch.
 */
export type BlockContext = {
  locale: Locale;
  dict: Dictionary;
  services: ServiceCard[];
  cases: CaseStudy[];
  posts: CmsPost[];
  team: TeamMember[];
  houseBio: { fi: string; en: string };
  openRoles: OpenRole[];
  channels: Channel[];
  mediaGroups: { id: string; icon: string; fi: string; en: string }[];
  clients: string[];
};

export function buildBlockContext(content: SiteContent, locale: Locale): BlockContext {
  return {
    locale,
    dict: content.dictionaries[locale],
    services: content.services,
    cases: content.cases,
    posts: content.posts,
    team: content.team,
    houseBio: content.houseBio,
    openRoles: content.openRoles,
    channels: content.channels,
    mediaGroups: content.mediaGroups,
    clients: content.brand.clients,
  };
}
