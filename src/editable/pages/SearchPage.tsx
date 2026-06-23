import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'
import { Reveal } from '@/editable/components/Motion'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? content.images.find((item) => typeof item === 'string') as string | undefined : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const href = task ? buildPostUrl(task, post.slug) : `/article/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'
  const strong = index % 5 === 0

  return (
    <Link
      href={href}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[var(--slot4-surface-bg)] transition duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:shadow-[0_28px_70px_-24px_rgba(87,73,100,0.55)] ${strong ? 'md:col-span-2' : ''}`}
    >
      {image ? (
        <div className={`relative overflow-hidden ${strong ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}>
          <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E1726]/70 via-[#1E1726]/10 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-[#1E1726]/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">{taskLabel}</span>
        </div>
      ) : (
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 pt-6">
          <span className="rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--slot4-accent)]">{taskLabel}</span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <h2 className="line-clamp-3 text-xl font-semibold leading-[1.18] tracking-[-0.02em] text-white group-hover:text-[var(--slot4-accent)]">{post.title}</h2>
        {summary ? <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-white/50">{summary}</p> : null}
        <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/60 transition group-hover:text-white">
          Open result <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="relative">
        {/* Search hero */}
        <section className="relative overflow-hidden border-b border-white/10">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-[-12rem] h-96 w-96 -translate-x-1/2 rounded-full bg-[var(--slot4-accent-fill)]/18 blur-[140px]" />
          </div>
          <div className="relative mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--slot4-accent)]">
                <Search className="h-3.5 w-3.5" /> {pagesContent.search.hero.badge}
              </p>
              <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.04] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl">
                {pagesContent.search.hero.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/55">{pagesContent.search.hero.description}</p>
            </Reveal>

            <Reveal delay={120}>
              <form action="/search" className="mt-8 rounded-2xl border border-white/10 bg-[var(--slot4-surface-bg)] p-4 sm:p-6">
                <input type="hidden" name="master" value="1" />
                <label className="flex items-center gap-3 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 transition focus-within:border-[var(--slot4-accent)]">
                  <Search className="h-5 w-5 text-white/40" />
                  <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40" />
                </label>
                <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <label className="flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 transition focus-within:border-[var(--slot4-accent)]">
                    <Filter className="h-4 w-4 text-white/40" />
                    <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40" />
                  </label>
                  <select name="task" defaultValue={task} className="rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition focus:border-[var(--slot4-accent)]">
                    <option value="">All content types</option>
                    {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                  </select>
                  <button className="rounded-full bg-[var(--slot4-accent-gradient)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(87,73,100,0.8)] transition hover:-translate-y-0.5" type="submit">Search</button>
                </div>
              </form>
            </Reveal>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <Reveal>
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--slot4-accent)]">{results.length} results</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">
                  {query ? <>Results for <span className="gradient-text">“{query}”</span></> : pagesContent.search.resultsTitle}
                </h2>
              </div>
              <Link href="/article" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white/30">
                Browse latest <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>

          {results.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => (
                <Reveal key={post.id || post.slug} delay={(index % 3) * 70}>
                  <SearchResultCard post={post} index={index} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-white/12 bg-white/[0.02] p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.04] text-white/60">
                <Search className="h-6 w-6" />
              </div>
              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.02em] text-white">No matching posts found</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/50">Try a different keyword, content type, or category — newly distributed releases appear here automatically.</p>
              <Link href="/" className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/85 transition hover:bg-white/[0.06]">
                Back to home <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
