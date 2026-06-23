import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((value): value is string => typeof value === 'string' && Boolean(value))
  const directImage = ['featuredImage', 'image', 'thumbnail', 'coverImage', 'logo']
    .map((key) => content[key])
    .find((value): value is string => typeof value === 'string' && Boolean(value))
  return mediaUrl || directImage || contentImage || '/placeholder.svg?height=900&width=1400'
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof content.body === 'string' && content.body) ||
    post?.summary ||
    ''
  const clean = raw.replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim()
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Newsroom'
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

/**
 * Primary feature card for the homepage — text only (no images).
 * Surfaces category, headline, summary, and a CTA.
 */
export function EditorialFeatureCard({ post, href, label = 'Featured release' }: { post: SitePost; href: string; label?: string }) {
  const summary = getEditableExcerpt(post, 200)
  return (
    <Link
      href={href}
      className={`group relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-3xl border ${pal.border} bg-[var(--slot4-surface-bg)] p-7 sm:p-9 ${dc.motion.lift}`}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[var(--slot4-accent-fill)]/15 blur-3xl transition group-hover:bg-[var(--slot4-accent-fill)]/25" />
      <div className="relative">
        <span className="inline-flex items-center rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{label}</span>
        <span className="ml-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">{getEditableCategory(post)}</span>
        <h3 className="mt-5 text-3xl font-semibold leading-[1.06] tracking-[-0.03em] text-white sm:text-4xl">{post.title}</h3>
        {summary ? <p className="mt-4 max-w-2xl text-base leading-7 text-white/55">{summary}</p> : null}
      </div>
      <span className="relative mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-accent)]">
        Read release <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  )
}

/** Rail / grid card for the homepage — text only (no images). */
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const summary = getEditableExcerpt(post, 130)
  return (
    <Link
      href={href}
      className={`group flex flex-col ${dc.layout.minRailCard} rounded-2xl border ${pal.border} bg-[var(--slot4-surface-bg)] p-6 ${dc.motion.lift}`}
    >
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-accent)]">{getEditableCategory(post)}</span>
        <span className="text-xs font-semibold text-white/30">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <h3 className="mt-4 line-clamp-3 text-lg font-semibold leading-[1.2] tracking-[-0.02em] text-white group-hover:text-[var(--slot4-accent)]">{post.title}</h3>
      {summary ? <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-white/50">{summary}</p> : <span className="flex-1" />}
      <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/55 transition group-hover:text-white">
        Read release <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

/** Compact numbered index row — text only. */
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group grid grid-cols-[40px_1fr] gap-4 border-t border-white/8 py-4 first:border-t-0">
      <span className="bg-[var(--slot4-text-gradient)] bg-clip-text text-2xl font-bold leading-none text-transparent">{String(index + 1).padStart(2, '0')}</span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">{getEditableCategory(post)}</p>
        <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug tracking-[-0.01em] text-white/90 transition group-hover:text-[var(--slot4-accent)]">{post.title}</h3>
      </div>
    </Link>
  )
}

/** List card used by article archive sections — keeps a media frame for archive layouts. */
export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group grid min-w-0 gap-6 rounded-2xl border ${pal.border} bg-[var(--slot4-surface-bg)] p-5 sm:grid-cols-[220px_minmax(0,1fr)] ${dc.motion.lift}`}>
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="min-w-0 self-center">
        <p className={`${dc.type.eyebrow} ${pal.accentText}`}>{String(index + 1).padStart(2, '0')} · {getEditableCategory(post)}</p>
        <h2 className="mt-3 line-clamp-2 text-2xl font-semibold leading-[1.1] tracking-[-0.03em] text-white group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
        <p className={`mt-3 line-clamp-2 text-sm leading-7 ${pal.mutedText}`}>{getEditableExcerpt(post, 190)}</p>
        <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/60">Read release <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}
