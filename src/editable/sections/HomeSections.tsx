import Link from 'next/link'
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Clock3,
  Gauge,
  Globe2,
  Layers,
  Megaphone,
  Network,
  Newspaper,
  Radio,
  Search,
  Send,
  Target,
  TrendingUp,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'
import { CompactIndexCard, getEditableCategory, getEditableExcerpt, postHref, RailPostCard } from '@/editable/cards/PostCards'
import { Reveal } from '@/editable/components/Motion'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const PROBLEM_ICONS = [Globe2, Network, BarChart3, Clock3]
const FEATURE_ICONS = [Send, Network, Target, TrendingUp, Layers, Search]

function SectionHeading({ eyebrow, title, description, align = 'left' }: { eyebrow: string; title: readonly string[]; description?: string; align?: 'left' | 'center' }) {
  return (
    <Reveal className={align === 'center' ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
      <p className={`${dc.type.eyebrow} text-[var(--slot4-accent)]`}>{eyebrow}</p>
      <h2 className={`mt-4 ${dc.type.sectionTitle} text-white`}>
        {title[0]} {title[1] ? <span className="gradient-text">{title[1]}</span> : null}
      </h2>
      {description ? <p className={`mt-4 text-base leading-7 ${pal.mutedText}`}>{description}</p> : null}
    </Reveal>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const hero = pagesContent.home.hero
  const stats = pagesContent.home.stats
  const lead = posts[0]
  const trending = posts.slice(1, 5)

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-12rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[var(--slot4-accent-fill)]/20 blur-[140px]" />
        <div className="absolute right-[-8rem] top-24 h-72 w-72 rounded-full bg-[var(--slot4-accent-2)]/12 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.06) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
            maskImage: 'radial-gradient(70% 60% at 50% 0%, black, transparent)',
            WebkitMaskImage: 'radial-gradient(70% 60% at 50% 0%, black, transparent)',
          }}
        />
      </div>

      <div className={`relative ${dc.shell.section} pb-16 pt-16 sm:pt-20 lg:pb-24 lg:pt-28`}>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
                <Radio className="h-3.5 w-3.5 text-[var(--slot4-accent-2)]" /> {hero.badge}
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className={`mt-6 ${dc.type.heroTitle} text-white`}>
                {hero.title[0]} <span className="gradient-text">{hero.title[1]}</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className={`mt-6 max-w-xl text-lg leading-8 ${pal.mutedText}`}>{hero.description}</p>
            </Reveal>
            <Reveal delay={240}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={hero.primaryCta.href} className={dc.button.primary}>
                  {hero.primaryCta.label} <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={hero.secondaryCta.href} className={dc.button.secondary}>
                  {hero.secondaryCta.label}
                </Link>
              </div>
            </Reveal>
            <Reveal delay={320}>
              <dl className="mt-12 grid max-w-xl grid-cols-2 gap-6 sm:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">{stat.value}</dt>
                    <dd className="mt-1 text-xs leading-5 text-white/45">{stat.label}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* Live newsroom panel (dynamic posts, text only) */}
          <Reveal variant="right" delay={160}>
            <div className={`relative ${dc.surface.glass} p-6 sm:p-7`}>
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--slot4-accent-2)]/20 blur-3xl animate-pulse-glow" />
              <div className="relative flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--slot4-accent-2)] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--slot4-accent-2)]" />
                  </span>
                  {hero.focusLabel}
                </span>
                <Newspaper className="h-4 w-4 text-white/40" />
              </div>

              {lead ? (
                <Link href={postHref(primaryTask, lead, primaryRoute)} className="group relative mt-5 block rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20">
                  <span className="inline-flex items-center rounded-full bg-[var(--slot4-accent-soft)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--slot4-accent)]">{getEditableCategory(lead)}</span>
                  <h3 className="mt-3 line-clamp-2 text-lg font-semibold leading-snug text-white group-hover:text-[var(--slot4-accent)]">{lead.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/50">{getEditableExcerpt(lead, 120)}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[var(--slot4-accent)]">Read release <ArrowUpRight className="h-3.5 w-3.5" /></span>
                </Link>
              ) : (
                <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="text-lg font-semibold text-white">{hero.featureCardTitle}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/50">{hero.featureCardDescription}</p>
                </div>
              )}

              {trending.length ? (
                <div className="relative mt-2">
                  {trending.map((post, index) => (
                    <CompactIndexCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
                  ))}
                </div>
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/** "Why media distribution feels harder than it should" — problem cards. */
export function EditableStoryRail() {
  const problems = pagesContent.home.problems
  return (
    <section className="relative">
      <div className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        <SectionHeading eyebrow={problems.eyebrow} title={problems.title} description={problems.description} align="center" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {problems.items.map((item, index) => {
            const Icon = PROBLEM_ICONS[index % PROBLEM_ICONS.length]
            return (
              <Reveal key={item.title} delay={index * 90}>
                <div className={`group h-full rounded-2xl border ${pal.border} bg-[var(--slot4-surface-bg)] p-6 ${dc.motion.lift}`}>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-[var(--slot4-accent)] transition group-hover:border-[var(--slot4-accent)]/40">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em] text-white">{item.title}</h3>
                  <p className="mt-2.5 text-sm leading-7 text-white/50">{item.description}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/** "Everything you need to be heard" — feature grid. */
export function EditableMagazineSplit() {
  const features = pagesContent.home.features
  return (
    <section className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-1/3 mx-auto h-72 w-[44rem] rounded-full bg-[var(--slot4-accent-3)]/10 blur-[140px]" />
      <div className={`relative ${dc.shell.section} ${dc.shell.sectionY}`}>
        <SectionHeading eyebrow={features.eyebrow} title={features.title} description={features.description} align="center" />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.items.map((item, index) => {
            const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length]
            const highlight = index === 0
            return (
              <Reveal key={item.title} delay={(index % 3) * 90}>
                <div
                  className={`group relative h-full overflow-hidden rounded-2xl border p-7 ${dc.motion.lift} ${
                    highlight ? 'border-[var(--slot4-accent)]/30 bg-[var(--slot4-accent-soft)]' : `${pal.border} bg-[var(--slot4-surface-bg)]`
                  }`}
                >
                  {highlight ? <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[var(--slot4-accent-fill)]/25 blur-3xl" /> : null}
                  <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--slot4-accent-gradient)] text-white shadow-[0_12px_30px_-12px_rgba(87,73,100,0.9)]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="relative mt-5 text-xl font-semibold tracking-[-0.01em] text-white">{item.title}</h3>
                  <p className="relative mt-3 text-sm leading-7 text-white/55">{item.description}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/** Latest coverage from the live newsroom (dynamic posts) + search. */
export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const collected = timeSections.flatMap((section) => section.posts)
  const source = collected.length ? collected : posts
  const rail = (source.length ? source : posts).slice(0, 6)
  const briefs = (source.length ? source : posts).slice(6, 11)
  if (!rail.length) return null

  return (
    <section className="relative">
      <div className={`${dc.shell.section} ${dc.shell.sectionY}`}>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Live newsroom" title={['Latest', 'coverage & releases']} />
          <Reveal delay={120}>
            <Link href={primaryRoute} className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white">
              View the newsroom <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <div className="grid gap-5 sm:grid-cols-2">
            {rail.map((post, index) => (
              <Reveal key={post.id} delay={(index % 2) * 90}>
                <RailPostCard post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
              </Reveal>
            ))}
          </div>

          <Reveal variant="right" delay={120}>
            <aside className={`${dc.surface.soft} p-6`}>
              <div className="flex items-center gap-2 border-b border-white/10 pb-4">
                <Megaphone className="h-4 w-4 text-[var(--slot4-accent)]" />
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/70">The briefing</h3>
              </div>
              <div className="mt-2">
                {briefs.length ? briefs.map((post, index) => (
                  <CompactIndexCard key={post.id} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
                )) : <p className="py-6 text-sm text-white/45">Fresh releases will appear here as they are distributed.</p>}
              </div>
            </aside>
          </Reveal>
        </div>

        {/* Search the archive */}
        <Reveal>
          <form action="/search" className={`mt-12 flex flex-col gap-4 rounded-3xl border ${pal.border} bg-[var(--slot4-surface-bg)] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8`}>
            <div>
              <h3 className="text-2xl font-semibold tracking-[-0.02em] text-white">Search the full newsroom</h3>
              <p className="mt-1.5 text-sm text-white/50">Explore every release distributed by {SITE_CONFIG.name}.</p>
            </div>
            <label className="flex w-full items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] p-1.5 pl-4 sm:w-auto sm:min-w-[380px]">
              <Search className="h-4 w-4 text-white/45" />
              <input name="q" placeholder="Search releases & coverage" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40" />
              <button className="shrink-0 rounded-full bg-[var(--slot4-accent-gradient)] px-5 py-2.5 text-sm font-semibold text-white">Search</button>
            </label>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  const cta = pagesContent.home.cta
  return (
    <section className={`${dc.shell.section} pb-24`}>
      <Reveal variant="zoom">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[var(--slot4-panel-bg)] px-6 py-16 text-center sm:px-12 lg:py-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-[var(--slot4-accent-fill)]/20 blur-[120px]" />
            <div className="absolute bottom-[-6rem] left-[-4rem] h-60 w-60 rounded-full bg-[var(--slot4-accent-2)]/12 blur-[110px]" />
          </div>
          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
              <Gauge className="h-3.5 w-3.5 text-[var(--slot4-accent-2)]" /> {cta.badge}
            </span>
            <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-5xl">{cta.title}</h2>
            <p className="mt-5 text-lg leading-8 text-white/55">{cta.description}</p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href={cta.primaryCta.href} className={dc.button.primary}>
                {cta.primaryCta.label} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href={cta.secondaryCta.href} className={dc.button.secondary}>
                {cta.secondaryCta.label}
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
