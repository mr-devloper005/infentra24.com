import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  ArrowUpRight,
  Bookmark,
  Building2,
  Camera,
  Download,
  ExternalLink,
  FileText,
  Globe2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7, { allowMockFallback: false })).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' || task === 'mediaDistribution' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')

const safeUrl = (value: string) => (/^https?:\/\//i.test(value) ? value : '#')

const linkifyMarkdown = (value: string) =>
  value.replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) =>
  linkifyMarkdown(value).replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) =>
  html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
    let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    if (!/\starget=/i.test(next)) next += ' target="_blank"'
    if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
    return `<a ${next}>`
  })

const sanitizeHtml = (html: string) =>
  hardenLinks(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'),
  )

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main className="relative">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' || task === 'mediaDistribution' ? <ArticleDetail task={task} post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/60 transition hover:text-white">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

/* ----------------------------- article detail ---------------------------- */
/* Modern editorial layout. Date label, summary section, and overview block removed per brief. */

function ArticleDetail({ task, post, related, comments }: { task: TaskKey; post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <article className="relative">
      <header className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute left-1/2 top-[-12rem] h-96 w-96 -translate-x-1/2 rounded-full bg-[var(--slot4-accent-fill)]/16 blur-[140px]" />
        <div className="relative mx-auto max-w-[820px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <BackLink task={task} />
          <p className="mt-8">
            <span className="inline-flex items-center rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-accent)]">
              {categoryOf(post, 'Newsroom')}
            </span>
          </p>
          <h1 className="mt-6 text-3xl font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.4rem]">{post.title}</h1>
        </div>
      </header>

      {images[0] ? (
        <figure className="mx-auto mt-0 max-w-[1000px] px-4 sm:px-6 lg:px-8">
          <div className="-mt-px overflow-hidden rounded-b-3xl border-x border-b border-white/10">
            <img src={images[0]} alt="" className="max-h-[640px] w-full object-cover" />
          </div>
        </figure>
      ) : null}

      <div className="mx-auto grid max-w-[1100px] gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-8 lg:py-16">
        <div className="min-w-0">
          <BodyContent post={post} />

          {/* CTA */}
          <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-[var(--slot4-panel-bg)] p-7 sm:p-9">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-white">Have news to share?</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">Distribute your own press release across {SITE_CONFIG.name}&apos;s newsroom and connected channels.</p>
              </div>
              <Link href="/create" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--slot4-accent-gradient)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(87,73,100,0.8)] transition hover:-translate-y-0.5">
                Distribute a release <Send className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <EditableComments slug={post.slug} comments={comments} />
        </div>

        <aside className="min-w-0">
          <RelatedPanel task={task} post={post} related={related} />
        </aside>
      </div>
    </article>
  )
}

/* ------------------------------ other details ---------------------------- */

const panelClass = 'rounded-3xl border border-white/10 bg-[var(--slot4-surface-bg)] p-6 shadow-[0_30px_90px_-40px_rgba(2,6,23,0.9)] sm:p-9'

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const logo = images[0]
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <BackLink task="listing" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
        <article className={panelClass}>
          <div className="grid gap-6 sm:grid-cols-[130px_1fr]">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <Building2 className="h-12 w-12 text-white/35" />}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">Business listing</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">{post.title}</h1>
            </div>
          </div>
          <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
          <BodyContent post={post} />
          <ImageStrip images={images.slice(1)} label="Showcase" />
        </article>
        <aside className="space-y-5">
          {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : null}
          <ContactAction website={website} phone={phone} email={email} />
          <RelatedPanel task="listing" post={post} related={related} />
        </aside>
      </div>
    </section>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <section className="mx-auto grid max-w-[1200px] gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8 lg:py-16">
      <aside className="rounded-3xl border border-white/10 bg-[var(--slot4-panel-bg)] p-7 lg:sticky lg:top-24 lg:self-start">
        <BackLink task="classified" />
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">Classified notice</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">{post.title}</h1>
        <div className="mt-7 grid gap-3">
          {price ? <BadgeLine label="Price" value={price} /> : null}
          {condition ? <BadgeLine label="Condition" value={condition} /> : null}
          {location ? <BadgeLine label="Location" value={location} /> : null}
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          {phone ? <a href={`tel:${phone}`} className="rounded-full bg-[var(--slot4-accent-gradient)] px-5 py-3 text-sm font-semibold text-white">Call now</a> : null}
          {email ? <a href={`mailto:${email}`} className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white">Email</a> : null}
        </div>
      </aside>
      <article className={panelClass}>
        <ImageStrip images={images} label="Offer images" large />
        <BodyContent post={post} />
        <ContactAction website={website} phone={phone} email={email} />
        <RelatedPanel task="classified" post={post} related={related} />
      </article>
    </section>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <BackLink task="image" />
      <div className="mt-8 grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="rounded-3xl border border-white/10 bg-[var(--slot4-surface-bg)] p-7 lg:sticky lg:top-24 lg:self-start">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--slot4-accent)]"><Camera className="h-4 w-4" /> Image story</div>
          <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">{post.title}</h1>
          <BodyContent post={post} compact />
        </aside>
        <div className="columns-1 gap-5 space-y-5 md:columns-2">
          {(images.length ? images : ['/placeholder.svg?height=900&width=1200']).map((image, index) => (
            <figure key={`${image}-${index}`} className="break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-[var(--slot4-surface-bg)]">
              <img src={image} alt="" className="w-full object-cover" />
            </figure>
          ))}
        </div>
      </div>
      <div className="mt-10"><RelatedPanel task="image" post={post} related={related} /></div>
    </section>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <section className="mx-auto grid max-w-[1200px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
      <article className={panelClass}>
        <BackLink task="sbm" />
        <div className="mt-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--slot4-accent-gradient)] text-white"><Bookmark className="h-7 w-7" /></div>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">{post.title}</h1>
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-gradient)] px-5 py-3 text-sm font-semibold text-white">Open saved resource <ExternalLink className="h-4 w-4" /></Link> : null}
        <BodyContent post={post} />
      </article>
      <aside><RelatedPanel task="sbm" post={post} related={related} /></aside>
    </section>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className="mx-auto grid max-w-[1200px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
      <article className={panelClass}>
        <BackLink task="pdf" />
        <div className="mt-8 grid gap-6 sm:grid-cols-[110px_1fr]">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-[var(--slot4-accent-gradient)] text-white"><FileText className="h-11 w-11" /></div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">PDF resource</p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">{post.title}</h1>
          </div>
        </div>
        <BodyContent post={post} />
        {fileUrl ? (
          <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
            <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-white/[0.03] p-4">
              <span className="text-sm font-semibold text-white">Document preview</span>
              <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-gradient)] px-4 py-2 text-xs font-semibold text-white">Download <Download className="h-4 w-4" /></Link>
            </div>
            <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full bg-white" />
          </div>
        ) : null}
      </article>
      <aside><RelatedPanel task="pdf" post={post} related={related} /></aside>
    </section>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  return (
    <section className="mx-auto grid max-w-[1200px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[400px_minmax(0,1fr)] lg:px-8 lg:py-16">
      <aside className="rounded-3xl border border-white/10 bg-[var(--slot4-surface-bg)] p-8 text-center lg:sticky lg:top-24 lg:self-start">
        <BackLink task="profile" />
        <div className="mx-auto mt-8 flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.03]">
          {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-14 w-14 text-white/35" />}
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-[-0.03em] text-white">{post.title}</h1>
        {role ? <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--slot4-accent)]">{role}</p> : null}
        <ContactAction website={website} email={email} />
      </aside>
      <article className={panelClass}>
        <BodyContent post={post} />
        <ImageStrip images={images.slice(1)} label="Gallery" />
        <RelatedPanel task="profile" post={post} related={related} />
      </article>
    </section>
  )
}

/* -------------------------------- shared --------------------------------- */

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return <div className={`article-content max-w-none ${compact ? 'text-base' : ''}`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-8 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/45"><Icon className="h-4 w-4" /> {label}</div>
          <p className="mt-2 break-words text-sm font-medium leading-6 text-white/80">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => (
          <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-xl border border-white/10 object-cover" />
        ))}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[var(--slot4-surface-bg)]">
      <div className="flex items-center gap-2 p-4 text-sm font-semibold text-white"><MapPin className="h-4 w-4 text-[var(--slot4-accent)]" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-72 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-gradient)] px-4 py-2 text-sm font-semibold text-white">Website <ExternalLink className="h-4 w-4" /></Link> : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white"><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm">
      <span className="font-semibold uppercase tracking-[0.14em] text-white/50">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  )
}

function RelatedPanel({ task, post, related }: { task: TaskKey; post: SitePost; related: SitePost[] }) {
  const taskConfig = getTaskConfig(task)
  if (!related.length) return null
  return (
    <div className="rounded-3xl border border-white/10 bg-[var(--slot4-surface-bg)] p-6 lg:sticky lg:top-24">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/70">{pagesContent.detailPages.article.relatedTitle}</h2>
        <Link href={taskConfig?.route || '/'} className="text-xs font-semibold uppercase tracking-[0.12em] text-white/45 transition hover:text-white">All</Link>
      </div>
      <div className="mt-2 grid">
        {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
      </div>
    </div>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  return (
    <Link href={buildPostUrl(task, post.slug)} className="group grid grid-cols-[1fr_auto] items-center gap-3 border-t border-white/8 py-4 first:border-t-0">
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">{categoryOf(post, 'Related')}</p>
        <h3 className="mt-1.5 line-clamp-2 text-sm font-semibold leading-snug text-white/90 transition group-hover:text-[var(--slot4-accent)]">{post.title}</h3>
      </div>
      <ArrowUpRight className="h-4 w-4 shrink-0 text-white/30 transition group-hover:text-[var(--slot4-accent)]" />
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-12 rounded-3xl border border-white/10 bg-[var(--slot4-surface-bg)] p-6 sm:p-8">
      <div className="flex items-center gap-2 text-lg font-semibold text-white"><MessageCircle className="h-5 w-5 text-[var(--slot4-accent)]" /> Comments</div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-2xl border border-white/8 bg-white/[0.02] p-4">
            <p className="text-sm font-semibold text-white">{comment.name}</p>
            <p className="mt-2 text-sm leading-6 text-white/55">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm text-white/45">No comments yet — be the first to respond.</p> : null}
      </div>
    </section>
  )
}
