import Link from "next/link";
import { Avatar } from "./Avatar";
import { EmbedFacade } from "./EmbedFacade";
import { LikeButton, LikeCount, actionClass } from "./LikeButton";
import { LinkPreviewCard } from "./LinkPreviewCard";
import { MediaGrid } from "./MediaGrid";
import { PostBody } from "./PostBody";
import { RelativeTime } from "./RelativeTime";
import { ShareButton } from "./ShareButton";
import { SocialIcon } from "./SocialIcon";
import { linkTo } from "@/lib/links";
import { countLabel, excerpt, fill, loc, type Comment, type MemberSummary, type Post, type SharedPost } from "@/lib/socialFormat";
import type { Dictionary } from "@/content/dictionary";
import type { Locale } from "@/i18n/config";

export type SocialDict = Dictionary["social"];

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:focus-visible:outline-light-purple";

export const profileHref = (locale: Locale, slug: string) => linkTo(locale, `/tiimi/${slug}`);
export const postHref = (locale: Locale, slug: string) => linkTo(locale, `/feed/${slug}`);

/**
 * One post, LinkedIn-shaped: author row, text, media / embed / link card, the
 * reposted original as a nested card, tallies, the action bar and a short
 * comments preview.
 *
 * Deliberately not a client component itself — it renders on the server for
 * the first page of every list, and inside the client `FeedList` for pages
 * added by "Load more". Only the interactive leaves (Like, Share, see-more,
 * lightbox, embed facade, relative time) hydrate.
 *
 * `variant="full"` is the permalink: text unclamped, every comment shown.
 */
export function PostCard({
  post,
  locale,
  t,
  variant = "feed",
  showPinned = false,
  headingLevel = 2,
}: {
  post: Post;
  locale: Locale;
  t: SocialDict;
  variant?: "feed" | "full";
  /** Pinned only means something on the author's own profile. */
  showPinned?: boolean;
  headingLevel?: 2 | 3;
}) {
  const full = variant === "full";
  const permalink = postHref(locale, post.slug);
  const title = excerpt(post.body || post.shared?.body || "", 80) || fill(t.postBy, { name: post.author.name });
  const comments = full ? post.comments : post.comments.slice(-2);
  const commentTotal = Math.max(post.commentCount, post.comments.length);
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article
      aria-label={fill(t.postBy, { name: post.author.name })}
      className="overflow-hidden rounded-card bg-white ring-1 ring-black/[0.06] dark:bg-white/[0.035] dark:ring-white/10"
    >
      {(showPinned && post.pinned) || post.shared ? (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-black/[0.05] px-4 py-2 text-[12px] text-ink/55 sm:px-5 dark:border-white/[0.07] dark:text-white/55">
          {showPinned && post.pinned && (
            <span className="inline-flex items-center gap-1.5 font-medium text-purple dark:text-light-purple">
              <SocialIcon name="pin" size={14} filled />
              {t.pinned}
            </span>
          )}
          {post.shared && (
            <span className="inline-flex items-center gap-1.5">
              <SocialIcon name="repost" size={15} />
              <span className="sr-only">{t.reposted}: </span>
              {fill(t.repostedBy, { name: post.author.name })}
            </span>
          )}
        </div>
      ) : null}

      <AuthorRow author={post.author} locale={locale} t={t} createdAt={post.createdAt} permalink={permalink} Heading={Heading} />

      {post.body.trim() && (
        <div className="px-4 pb-3 sm:px-5">
          <PostBody body={post.body} lang={post.lang} locale={locale} clamp={!full} seeMore={t.seeMore} seeLess={t.seeLess} size="md" />
        </div>
      )}

      <PostAttachments post={post} title={title} t={t} />

      {post.shared !== null ? (
        <div className="px-4 pb-3 sm:px-5">
          <SharedCard post={post.shared} locale={locale} t={t} />
        </div>
      ) : null}

      {/* Tallies */}
      <div className="flex min-h-9 items-center justify-between gap-3 px-4 pt-1 text-[12.5px] text-ink/55 sm:px-5 dark:text-white/55">
        <LikeCount postId={post.id} likeCount={post.likeCount} one={t.likeCountOne} many={t.likeCountMany} />
        <span className="flex items-center gap-3">
          {commentTotal > 0 && (
            <Link href={`${permalink}#comments`} className={`rounded-sm hover:text-purple hover:underline dark:hover:text-light-purple ${focusRing}`}>
              {countLabel(commentTotal, t.commentCountOne, t.commentCountMany)}
            </Link>
          )}
          {post.shareCount > 0 && <span>{countLabel(post.shareCount, t.shareCountOne, t.shareCountMany)}</span>}
        </span>
      </div>

      {/* Actions */}
      <div className="mx-3 flex items-stretch gap-1 border-t border-black/[0.06] py-1 sm:mx-4 dark:border-white/10">
        <LikeButton postId={post.id} likeCount={post.likeCount} label={t.like} unlabel={t.unlike} />
        <Link href={full ? "#comments" : `${permalink}#comments`} className={actionClass}>
          <SocialIcon name="comment" size={19} />
          <span>{t.comments}</span>
        </Link>
        <ShareButton url={permalink} title={title} label={t.share} copiedLabel={t.linkCopied} />
      </div>

      {/* Comments */}
      {full ? (
        <section id="comments" aria-labelledby={`comments-${post.id}`} className="scroll-mt-32 border-t border-black/[0.06] px-4 py-5 sm:px-5 dark:border-white/10">
          <h2 id={`comments-${post.id}`} className="text-[13px] font-medium uppercase tracking-[0.12em] text-ink/60 dark:text-white/60">
            {t.comments}
            {commentTotal > 0 && <span className="ml-2 tabular-nums text-ink/40 dark:text-white/40">{commentTotal}</span>}
          </h2>
          {comments.length > 0 ? (
            <ol className="mt-4 space-y-4">
              {comments.map((c) => (
                <CommentItem key={c.id} comment={c} locale={locale} t={t} />
              ))}
            </ol>
          ) : (
            <p className="mt-3 text-[14px] text-ink/55 dark:text-white/55">{t.noComments}</p>
          )}
          <p className="mt-5 text-[12px] text-ink/45 dark:text-white/45">{t.commentsNote}</p>
        </section>
      ) : comments.length > 0 ? (
        <div className="border-t border-black/[0.06] px-4 py-4 sm:px-5 dark:border-white/10">
          <ol className="space-y-3">
            {comments.map((c) => (
              <CommentItem key={c.id} comment={c} locale={locale} t={t} compact />
            ))}
          </ol>
          {commentTotal > comments.length && (
            <Link
              href={`${permalink}#comments`}
              className={`mt-3 inline-block rounded-sm text-[13px] font-medium text-ink/60 hover:text-purple hover:underline dark:text-white/60 dark:hover:text-light-purple ${focusRing}`}
            >
              {fill(t.viewAllComments, { n: commentTotal })}
            </Link>
          )}
        </div>
      ) : null}
    </article>
  );
}

function AuthorRow({
  author,
  locale,
  t,
  createdAt,
  permalink,
  Heading,
  compact = false,
}: {
  author: MemberSummary;
  locale: Locale;
  t: SocialDict;
  createdAt: string;
  permalink: string;
  Heading: "h2" | "h3" | "h4";
  compact?: boolean;
}) {
  const profile = profileHref(locale, author.slug);
  const subline = loc(author.headline, locale) || loc(author.role, locale);
  return (
    <header className={`flex items-start gap-3 ${compact ? "px-3 pt-3 pb-2" : "px-4 pb-3 pt-4 sm:px-5"}`}>
      <Link href={profile} tabIndex={-1} aria-hidden className="shrink-0 rounded-full">
        <Avatar name={author.name} photo={author.photo} size={compact ? 36 : 48} />
      </Link>
      <div className="min-w-0 flex-1">
        <Heading className={`truncate font-medium leading-snug text-ink dark:text-white ${compact ? "text-[14px]" : "text-[15px]"}`}>
          <Link href={profile} className={`rounded-sm hover:text-purple hover:underline dark:hover:text-light-purple ${focusRing}`}>
            {author.name}
          </Link>
        </Heading>
        {subline && <p className="truncate text-[12.5px] leading-snug text-ink/55 dark:text-white/55">{subline}</p>}
        <Link
          href={permalink}
          className={`mt-0.5 inline-block rounded-sm text-[12px] text-ink/45 hover:text-purple hover:underline dark:text-white/45 dark:hover:text-light-purple ${focusRing}`}
        >
          <RelativeTime iso={createdAt} locale={locale} justNow={t.justNow} />
          <span className="sr-only"> — {t.openPost}</span>
        </Link>
      </div>
    </header>
  );
}

function PostAttachments({ post, title, t }: { post: SharedPost; title: string; t: SocialDict }) {
  const alt = title;
  return (
    <>
      {post.media.length > 0 && (
        <div className="pb-1">
          <MediaGrid media={post.media} alt={alt} labels={t} />
        </div>
      )}
      {post.embed && (
        <div className="pb-1">
          <EmbedFacade embed={post.embed} title={title} labels={t} />
        </div>
      )}
      {post.link && post.media.length === 0 && !post.embed && <LinkPreviewCard link={post.link} />}
    </>
  );
}

/** The reposted original, nested and bordered, one level deep. */
function SharedCard({ post, locale, t }: { post: SharedPost; locale: Locale; t: SocialDict }) {
  const title = excerpt(post.body, 80) || fill(t.postBy, { name: post.author.name });
  return (
    <div className="overflow-hidden rounded-card border border-black/10 dark:border-white/15">
      <AuthorRow
        author={post.author}
        locale={locale}
        t={t}
        createdAt={post.createdAt}
        permalink={postHref(locale, post.slug)}
        Heading="h3"
        compact
      />
      {post.body.trim() && (
        <div className="px-3 pb-3">
          <PostBody body={post.body} lang={post.lang} locale={locale} lines={4} seeMore={t.seeMore} seeLess={t.seeLess} size="sm" />
        </div>
      )}
      <PostAttachments post={post} title={title} t={t} />
    </div>
  );
}

function CommentItem({
  comment,
  locale,
  t,
  compact = false,
}: {
  comment: Comment;
  locale: Locale;
  t: SocialDict;
  compact?: boolean;
}) {
  const profile = profileHref(locale, comment.author.slug);
  return (
    <li className="flex items-start gap-2.5">
      <Link href={profile} tabIndex={-1} aria-hidden className="shrink-0 rounded-full">
        <Avatar name={comment.author.name} photo={comment.author.photo} size={compact ? 32 : 40} />
      </Link>
      <div className="min-w-0 flex-1 rounded-[8px] bg-grey/70 px-3.5 py-2.5 dark:bg-white/[0.06]">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <Link href={profile} className={`truncate rounded-sm text-[13.5px] font-medium text-ink hover:text-purple hover:underline dark:text-white dark:hover:text-light-purple ${focusRing}`}>
            {comment.author.name}
          </Link>
          <RelativeTime iso={comment.createdAt} locale={locale} justNow={t.justNow} className="text-[11.5px] text-ink/45 dark:text-white/45" />
        </div>
        {!compact && loc(comment.author.headline, locale) && (
          <p className="truncate text-[12px] text-ink/50 dark:text-white/50">{loc(comment.author.headline, locale)}</p>
        )}
        <div className="mt-1">
          <PostBody body={comment.body} locale={locale} clamp={compact} lines={3} seeMore={t.seeMore} seeLess={t.seeLess} size="sm" />
        </div>
      </div>
    </li>
  );
}
