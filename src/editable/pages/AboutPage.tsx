import Link from 'next/link'
import { ArrowRight, Compass, Eye, Globe2, Rocket, ShieldCheck, Sparkles, Target, TrendingUp } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { Reveal } from '@/editable/components/Motion'

const VALUE_ICONS = [Target, TrendingUp, ShieldCheck]
const WHY_ICONS = [Globe2, Rocket, TrendingUp, Sparkles]

export default function AboutPage() {
  const about = pagesContent.about

  return (
    <EditableSiteShell>
      <main className="text-white">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-[-12rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[var(--slot4-accent-fill)]/20 blur-[140px]" />
            <div className="absolute right-[-8rem] top-24 h-72 w-72 rounded-full bg-[var(--slot4-accent-2)]/12 blur-[120px]" />
          </div>
          <div className="relative mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
                <Sparkles className="h-3.5 w-3.5 text-[var(--slot4-accent-2)]" /> {about.badge}
              </span>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl lg:text-[4.2rem]">
                We help brands get <span className="gradient-text">heard, everywhere</span>.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-white/55">{about.description}</p>
            </Reveal>
            <div className="mt-8 max-w-3xl space-y-5">
              {about.paragraphs.map((paragraph, index) => (
                <Reveal key={paragraph} delay={220 + index * 70}>
                  <p className="text-base leading-8 text-white/55">{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="relative">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <Reveal>
              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] sm:grid-cols-4">
                {about.stats.map((stat, index) => (
                  <div key={stat.label} className="bg-[var(--slot4-surface-bg)] p-6 sm:p-8">
                    <Reveal delay={(index % 4) * 80}>
                      <dt className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">{stat.value}</dt>
                      <dd className="mt-2 text-sm leading-6 text-white/50">{stat.label}</dd>
                    </Reveal>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </section>

        {/* Mission + Vision */}
        <section className="relative">
          <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="grid gap-6 lg:grid-cols-2">
              {[
                { data: about.mission, icon: Compass },
                { data: about.vision, icon: Eye },
              ].map(({ data, icon: Icon }, index) => (
                <Reveal key={data.eyebrow} delay={index * 90} variant={index === 1 ? 'right' : 'up'}>
                  <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-[var(--slot4-surface-bg)] p-8 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_-24px_rgba(87,73,100,0.55)] sm:p-10">
                    <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[var(--slot4-accent-fill)]/15 blur-3xl" />
                    <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--slot4-accent-gradient)] text-white shadow-[0_12px_30px_-12px_rgba(87,73,100,0.9)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="relative mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--slot4-accent)]">{data.eyebrow}</p>
                    <h2 className="relative mt-3 text-2xl font-semibold leading-tight tracking-[-0.02em] text-white sm:text-3xl">{data.title}</h2>
                    <p className="relative mt-4 text-base leading-8 text-white/55">{data.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="relative">
          <div className="pointer-events-none absolute inset-x-0 top-1/4 mx-auto h-72 w-[44rem] rounded-full bg-[var(--slot4-accent-3)]/10 blur-[140px]" />
          <div className="relative mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <Reveal className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--slot4-accent)]">What we value</p>
              <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-[2.7rem]">
                Principles behind every <span className="gradient-text">release</span>.
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {about.values.map((value, index) => {
                const Icon = VALUE_ICONS[index % VALUE_ICONS.length]
                return (
                  <Reveal key={value.title} delay={(index % 3) * 90}>
                    <div className="group h-full rounded-2xl border border-white/10 bg-[var(--slot4-surface-bg)] p-7 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_-24px_rgba(87,73,100,0.55)]">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-[var(--slot4-accent)] transition group-hover:border-[var(--slot4-accent)]/40">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em] text-white">{value.title}</h3>
                      <p className="mt-2.5 text-sm leading-7 text-white/55">{value.description}</p>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* Why choose us */}
        <section className="relative">
          <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <Reveal className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--slot4-accent)]">{about.whyChooseUs.eyebrow}</p>
              <h2 className="mt-4 text-3xl font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-[2.7rem]">{about.whyChooseUs.title}</h2>
            </Reveal>
            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {about.whyChooseUs.items.map((item, index) => {
                const Icon = WHY_ICONS[index % WHY_ICONS.length]
                return (
                  <Reveal key={item.title} delay={(index % 2) * 90}>
                    <div className="group flex h-full gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition duration-300 hover:-translate-y-1.5 hover:border-white/20">
                      <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--slot4-accent-gradient)] text-white shadow-[0_12px_30px_-12px_rgba(87,73,100,0.9)]">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="text-lg font-semibold tracking-[-0.01em] text-white">{item.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-white/55">{item.description}</p>
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* Final CTA band */}
        <section className="mx-auto max-w-[1200px] px-4 pb-24 sm:px-6 lg:px-8">
          <Reveal variant="zoom">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[var(--slot4-panel-bg)] px-6 py-16 text-center sm:px-12 lg:py-20">
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-[var(--slot4-accent-fill)]/20 blur-[120px]" />
                <div className="absolute bottom-[-6rem] left-[-4rem] h-60 w-60 rounded-full bg-[var(--slot4-accent-2)]/12 blur-[110px]" />
              </div>
              <div className="relative mx-auto max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-white/75">
                  <Rocket className="h-3.5 w-3.5 text-[var(--slot4-accent-2)]" /> Ready when you are
                </span>
                <h2 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-5xl">
                  Put your next story in front of the right audience.
                </h2>
                <p className="mt-5 text-lg leading-8 text-white/55">
                  Distribute press releases, syndicate news, and grow brand visibility with measurable reach — powered by {SITE_CONFIG.name}.
                </p>
                <div className="mt-9 flex flex-wrap justify-center gap-3">
                  <Link
                    href="/create"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-gradient)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(87,73,100,0.8)] transition hover:-translate-y-0.5"
                  >
                    Distribute a release <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-white transition hover:border-white/30"
                  >
                    Talk to our team
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
