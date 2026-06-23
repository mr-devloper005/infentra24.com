import Link from 'next/link'
import type { CSSProperties } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  BriefcaseBusiness,
  Building2,
  Camera,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Image as ImageIcon,
  MapPin,
  Megaphone,
  Newspaper,
  Search,
  UserRound,
} from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { fetchSiteFeed } from '@/lib/site-connector'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'
import { Reveal } from '@/editable/components/Motion'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
/** Returns a real, usable image URL or '' (no placeholder) so layouts can fall back gracefully. */
const getRealImage = (post: SitePost) => getImages(post)[0] || ''
const getImage = (post: SitePost) => getRealImage(post) || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body)
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; archiveClass: string; promise: string; badge: string }> = {
  mediaDistribution: { icon: Newspaper, archiveClass: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3', promise: 'Release cards prioritize source, category, headline, and publication-ready summaries.', badge: 'Newsroom' },
  article: { icon: FileText, archiveClass: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3', promise: 'Readable editorial cards with room for headlines and excerpts.', badge: 'Read' },
  listing: { icon: Building2, archiveClass: 'grid gap-6 xl:grid-cols-2', promise: 'Directory cards highlight company identity, location, contacts, and service details.', badge: 'Business' },
  classified: { icon: Megaphone, archiveClass: 'grid gap-6 xl:grid-cols-2', promise: 'Offer-board cards prioritize price, location, condition, and quick action.', badge: 'Offer' },
  image: { icon: Camera, archiveClass: 'columns-1 gap-6 space-y-6 md:columns-2 xl:columns-3', promise: 'Gallery-first browsing with strong visuals and compact captions.', badge: 'Gallery' },
  sbm: { icon: Bookmark, archiveClass: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3', promise: 'Bookmark cards stay mostly text-based so saved resources scan quickly.', badge: 'Bookmark' },
  pdf: { icon: Download, archiveClass: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3', promise: 'Document cards surface file context, download intent, and summary.', badge: 'PDF' },
  profile: { icon: UserRound, archiveClass: 'grid gap-6 md:grid-cols-2 xl:grid-cols-4', promise: 'Profile cards focus on identity, short bio, and direct discovery.', badge: 'Profile' },
}

const ARCHIVE_LIMIT = 24

/**
 * Real-data fallback for the archive.
 *
 * `fetchPaginatedTaskPosts` filters the master-panel feed server-side by `task`, which can
 * return nothing even when the feed has published posts (the homepage avoids this by fetching
 * the feed unfiltered and grouping locally). When the paginated call is empty we mirror the
 * homepage path here: pull the broad feed and filter/paginate locally. Real posts only — never mock.
 */
async function fetchArchiveFeedFallback(
  task: TaskKey,
  { page, limit, category }: { page: number; limit: number; category: string },
): Promise<{ posts: SitePost[]; pagination: SiteFeedPagination }> {
  const feed = await fetchSiteFeed(Math.min(300, Math.max(limit * 10, 100)), { fresh: true, timeoutMs: 6000 }).catch(() => null)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)
  const singleTask = enabledTasks.length === 1

  const all = (feed?.posts || []).filter((post) => {
    const status = typeof (post as { status?: unknown }).status === 'string' ? String((post as { status?: unknown }).status).toUpperCase() : ''
    if (status && status !== 'PUBLISHED') return false
    const type = asText(getContent(post).type)
    if (type.toLowerCase() === 'comment') return false
    // On a single-task site every published post belongs to this archive; otherwise match by task.
    const key = getPostTaskKey(post)
    if (!(singleTask || key === task || key === null)) return false
    if (category && category !== 'all') {
      const postCategory = getCategory(post, '')
      if (!postCategory || normalizeCategory(postCategory) !== category) return false
    }
    return true
  })

  const total = all.length
  const start = (page - 1) * limit
  const posts = all.slice(start, start + limit)
  const totalPages = Math.max(1, Math.ceil(total / limit))
  return {
    posts,
    pagination: { page, limit, total, totalPages, hasPrevPage: page > 1, hasNextPage: page < totalPages },
  }
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)

  let { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: ARCHIVE_LIMIT, category })
  // If the server-filtered feed is empty, recover real posts from the broad feed.
  if (!posts.length) {
    const fallback = await fetchArchiveFeedFallback(task, { page, limit: ARCHIVE_LIMIT, category })
    posts = fallback.posts
    pagination = fallback.pagination
  }

  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const label = taskConfig?.label || task
  const dynamicCategories = Array.from(
    new Map(
      [
        ...CATEGORY_OPTIONS,
        ...posts
          .map((post) => {
            const raw = getCategory(post, '')
            return raw ? { name: raw, slug: normalizeCategory(raw) } : null
          })
          .filter((item): item is { name: string; slug: string } => Boolean(item)),
      ].map((item) => [item.slug, item]),
    ).values(),
  )
  const categoryLabel = category === 'all' ? 'All categories' : dynamicCategories.find((item) => item.slug === category)?.name || category

  if (task === 'mediaDistribution' || task === 'article') {
    return (
      <EditorialArchive
        task={task}
        posts={posts}
        pagination={pagination}
        category={category}
        categoryLabel={categoryLabel}
        categories={dynamicCategories}
        basePath={basePath}
        label={label}
      />
    )
  }

  return (
    <GenericArchive
      task={task}
      posts={posts}
      pagination={pagination}
      category={category}
      categoryLabel={categoryLabel}
      categories={dynamicCategories}
      basePath={basePath}
      label={label}
    />
  )
}

/* ----------------------------- shared chrome ----------------------------- */

function Pagination({ pagination, category, basePath }: { pagination: SiteFeedPagination; category: string; basePath: string }) {
  const page = pagination.page || 1
  return (
    <div className="mt-12 flex items-center justify-center gap-3">
      {pagination.hasPrevPage ? (
        <Link href={pageHref(basePath, category, page - 1)} className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/25 hover:text-white">
          <ChevronLeft className="h-4 w-4" /> Previous
        </Link>
      ) : null}
      <span className="rounded-full bg-[var(--slot4-accent-gradient)] px-5 py-2.5 text-sm font-semibold text-white">
        Page {page} of {pagination.totalPages || 1}
      </span>
      {pagination.hasNextPage ? (
        <Link href={pageHref(basePath, category, page + 1)} className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:border-white/25 hover:text-white">
          Next <ChevronRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  )
}

function CategoryFilter({ categories, category, basePath }: { categories: { name: string; slug: string }[]; category: string; basePath: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={basePath}
        className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition ${
          category === 'all' ? 'border-transparent bg-[var(--slot4-accent-gradient)] text-white' : 'border-white/12 bg-white/[0.03] text-white/65 hover:border-white/25 hover:text-white'
        }`}
      >
        All
      </Link>
      {categories.slice(0, 10).map((item) => (
        <Link
          key={item.slug}
          href={pageHref(basePath, item.slug, 1)}
          className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition ${
            category === item.slug ? 'border-transparent bg-[var(--slot4-accent-gradient)] text-white' : 'border-white/12 bg-white/[0.03] text-white/65 hover:border-white/25 hover:text-white'
          }`}
        >
          {item.name}
        </Link>
      ))}
    </div>
  )
}

/* --------------------------- editorial archive --------------------------- */

function EditorialArchive({
  task,
  posts,
  pagination,
  category,
  categoryLabel,
  categories,
  basePath,
  label,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  categoryLabel: string
  categories: { name: string; slug: string }[]
  basePath: string
  label: string
}) {
  const voice = taskPageVoices[task]
  const lead = posts[0]
  const rest = posts.slice(1)

  return (
    <EditableSiteShell>
      <main className="relative">
        {/* Header */}
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-[-12rem] h-96 w-96 -translate-x-1/2 rounded-full bg-[var(--slot4-accent-fill)]/18 blur-[140px]" />
          </div>
          <div className="relative mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
                <Link href="/" className="hover:text-white">Home</Link> <span className="mx-1.5 text-white/25">/</span> {label}
              </p>
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--slot4-accent)]">
                <Newspaper className="h-3.5 w-3.5" /> {voice?.eyebrow || label}
              </p>
              <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.04] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
                {category === 'all' ? voice?.headline || `The ${label} newsroom` : <>Coverage in <span className="gradient-text">{categoryLabel}</span></>}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/55">{voice?.description || SITE_CONFIG.description}</p>
            </Reveal>
            <Reveal delay={120}>
              <div className="mt-8">
                <CategoryFilter categories={categories} category={category} basePath={basePath} />
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          {!posts.length ? (
            <EmptyArchive />
          ) : (
            <>
              {lead ? (
                <Reveal>
                  <Link
                    href={`${basePath}/${lead.slug}`}
                    className="group mb-10 grid overflow-hidden rounded-3xl border border-white/10 bg-[var(--slot4-surface-bg)] transition hover:border-white/20 lg:grid-cols-[1.05fr_0.95fr]"
                  >
                    {getRealImage(lead) ? (
                      <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:min-h-[22rem]">
                        <img src={getImage(lead)} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1726]/60 to-transparent lg:bg-gradient-to-r" />
                      </div>
                    ) : (
                      <div className="relative flex min-h-[16rem] items-center justify-center overflow-hidden bg-[var(--slot4-panel-bg)] p-8">
                        <div className="absolute inset-0 bg-[var(--slot4-accent-gradient)] opacity-[0.12]" />
                        <Newspaper className="h-16 w-16 text-white/15" />
                      </div>
                    )}
                    <div className="flex flex-col justify-center p-7 sm:p-10">
                      <span className="inline-flex w-fit items-center rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-accent)]">
                        Featured · {getCategory(lead, label)}
                      </span>
                      <h2 className="mt-5 text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-white group-hover:text-[var(--slot4-accent)] sm:text-4xl">{lead.title}</h2>
                      
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--slot4-accent)]">
                        Read full release <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </Link>
                </Reveal>
              ) : null}

              {rest.length ? (
                <>
                  <div className="mb-6 flex items-end justify-between gap-4 border-b border-white/10 pb-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/60">More from {category === 'all' ? 'the newsroom' : categoryLabel}</h3>
                    <Link href="/search" className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/55 transition hover:text-white">
                      Search <Search className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {rest.map((post, index) => (
                      <Reveal key={post.id || post.slug} delay={(index % 3) * 80}>
                        <ReleaseCard post={post} href={`${basePath}/${post.slug}`} index={index + 1} fallbackCategory={label} />
                      </Reveal>
                    ))}
                  </div>
                </>
              ) : null}

              <Pagination pagination={pagination} category={category} basePath={basePath} />
            </>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ReleaseCard({ post, href, index, fallbackCategory }: { post: SitePost; href: string; index: number; fallbackCategory: string }) {
  const image = getRealImage(post)
  const category = getCategory(post, fallbackCategory)
  return (
    <Link href={href} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[var(--slot4-surface-bg)] transition duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-[0_28px_70px_-24px_rgba(87,73,100,0.55)]">
      {image ? (
        <div className="relative aspect-[16/10] overflow-hidden">
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E1726]/50 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-[#1E1726]/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">{category}</span>
        </div>
      ) : (
        <div className="flex items-center justify-between border-b border-white/8 px-6 pt-6">
          <span className="rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--slot4-accent)]">{category}</span>
          <span className="text-xs font-semibold text-white/25">{String(index).padStart(2, '0')}</span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="line-clamp-3 text-xl font-semibold leading-[1.18] tracking-[-0.02em] text-white group-hover:text-[var(--slot4-accent)]">{post.title}</h3>
        
        <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/60 transition group-hover:text-white">
          Read release <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

function EmptyArchive() {
  return (
    <div className="rounded-3xl border border-dashed border-white/12 bg-white/[0.02] p-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.04] text-white/60">
        <Search className="h-6 w-6" />
      </div>
      <h2 className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-white">No releases here yet</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/50">Try another category, or check back shortly — newly distributed releases appear here automatically.</p>
      <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/85 transition hover:bg-white/[0.06]">
        Back to home <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}

/* ---------------------------- generic archive ---------------------------- */

function GenericArchive({
  task,
  posts,
  pagination,
  category,
  categoryLabel,
  categories,
  basePath,
  label,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  categoryLabel: string
  categories: { name: string; slug: string }[]
  basePath: string
  label: string
}) {
  const voice = taskPageVoices[task]
  const preset = getVisualPreset(visualSystem.recommendedPreset as Slot4PresetName)
  const deck = taskDeck[task]
  const Icon = deck.icon
  const archiveVars = { '--archive-accent': preset.colors.accent } as CSSProperties

  return (
    <EditableSiteShell>
      <main style={archiveVars}>
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="pointer-events-none absolute left-1/2 top-[-12rem] h-96 w-96 -translate-x-1/2 rounded-full bg-[var(--slot4-accent-fill)]/16 blur-[140px]" />
          <div className="relative mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <Reveal>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--slot4-accent)]">
                <Icon className="h-3.5 w-3.5" /> {label}
              </div>
              <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.04] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">{voice?.headline || `Browse ${label}`}</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/55">{voice?.description || SITE_CONFIG.description}</p>
              <div className="mt-8"><CategoryFilter categories={categories} category={category} basePath={basePath} /></div>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          {posts.length ? (
            <div className={deck.archiveClass}>
              {posts.map((post, index) => (
                <Reveal key={post.id || post.slug} delay={(index % 3) * 70}>
                  <ArchivePostCard post={post} task={task} basePath={basePath} index={index} />
                </Reveal>
              ))}
            </div>
          ) : (
            <EmptyArchive />
          )}
          <Pagination pagination={pagination} category={category} basePath={basePath} />
        </section>
      </main>
    </EditableSiteShell>
  )
}

type Slot4PresetName = Parameters<typeof getVisualPreset>[0]

const cardBase = 'group rounded-2xl border border-white/10 bg-[var(--slot4-surface-bg)] transition duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-[0_28px_70px_-24px_rgba(87,73,100,0.5)]'

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ReleaseCard post={post} href={href} index={index + 1} fallbackCategory="Post" />
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getRealImage(post)
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className={`${cardBase} grid gap-5 p-6 sm:grid-cols-[110px_1fr]`}>
      <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-9 w-9 text-white/40" />}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--slot4-accent)]">Directory</span>
          {location ? <span className="inline-flex items-center gap-1 rounded-full border border-white/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/60"><MapPin className="h-3 w-3" /> {location}</span> : null}
        </div>
        <h2 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-white group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/50">{getSummary(post)}</p>
        <div className="mt-3 grid gap-1 text-xs font-medium text-white/45 sm:grid-cols-2">
          {phone ? <span>Phone: {phone}</span> : null}
          {website ? <span>Website available</span> : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className={`${cardBase} overflow-hidden`}>
      <div className="grid min-h-56 sm:grid-cols-[0.7fr_1fr]">
        <div className="relative bg-[var(--slot4-panel-bg)] p-6">
          <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/80">Classified</span>
          <h2 className="mt-8 text-3xl font-semibold tracking-[-0.04em] text-white">{price || 'Open offer'}</h2>
          <p className="mt-3 text-sm font-medium text-white/55">{location || condition || 'Details inside'}</p>
        </div>
        <div className="p-6">
          <h2 className="text-xl font-semibold tracking-[-0.02em] text-white group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
          <p className="mt-3 line-clamp-4 text-sm leading-6 text-white/50">{getSummary(post)}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--slot4-accent)]">View listing <ArrowRight className="h-3.5 w-3.5" /></span>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className={`${cardBase} mb-6 block break-inside-avoid overflow-hidden`}>
      <div className={index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}>
        <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--slot4-accent)]"><ImageIcon className="h-3 w-3" /> Visual</div>
        <h2 className="mt-4 line-clamp-3 text-lg font-semibold tracking-[-0.02em] text-white">{post.title}</h2>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className={`${cardBase} block p-6`}>
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-white/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/60">Save {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5 text-[var(--slot4-accent)]" />
      </div>
      <h2 className="mt-6 text-xl font-semibold tracking-[-0.02em] text-white group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
      <p className="mt-3 line-clamp-4 text-sm leading-6 text-white/50">{getSummary(post)}</p>
      {website ? <p className="mt-4 truncate text-xs font-semibold uppercase tracking-[0.12em] text-white/40">{website.replace(/^https?:\/\//, '')}</p> : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'PDF')
  return (
    <Link href={href} className={`${cardBase} p-6`}>
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-2xl bg-[var(--slot4-accent-gradient)] p-4 text-white"><FileText className="h-7 w-7" /></div>
        <span className="rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--slot4-accent)]">{category}</span>
      </div>
      <h2 className="mt-6 text-xl font-semibold tracking-[-0.02em] text-white group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
      <p className="mt-3 line-clamp-4 text-sm leading-6 text-white/50">{getSummary(post)}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--slot4-accent)]">Open document <Download className="h-3.5 w-3.5" /></span>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getRealImage(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className={`${cardBase} p-6 text-center`}>
      <div className="mx-auto flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.03]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-9 w-9 text-white/40" />}
      </div>
      <h2 className="mt-5 text-lg font-semibold tracking-[-0.02em] text-white group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
      {role ? <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--slot4-accent)]">{role}</p> : null}
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/50">{getSummary(post)}</p>
    </Link>
  )
}
