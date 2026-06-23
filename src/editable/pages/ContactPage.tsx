'use client'

import { CheckCircle2, Clock3, Mail, MessageSquare, ShieldCheck } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { Reveal } from '@/editable/components/Motion'

export default function ContactPage() {
  const contact = pagesContent.contact

  return (
    <EditableSiteShell>
      <main className="relative overflow-hidden text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[-12rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-[var(--slot4-accent-fill)]/20 blur-[140px]" />
          <div className="absolute right-[-8rem] top-32 h-72 w-72 rounded-full bg-[var(--slot4-accent-2)]/12 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-[1100px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
            {/* Left column: info + expectations + trust */}
            <div className="space-y-10">
              <Reveal>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--slot4-accent)]">{contact.eyebrow}</p>
                  <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-5xl">
                    Let&rsquo;s get your story in front of the <span className="gradient-text">right audience</span>.
                  </h1>
                  <p className="mt-5 max-w-xl text-base leading-8 text-white/55">{contact.description}</p>
                </div>
              </Reveal>

              {/* Contact info */}
              <div className="space-y-4">
                {contact.info.map((item, index) => (
                  <Reveal key={item.label} delay={index * 80}>
                    <div className="group flex gap-4 rounded-2xl border border-white/10 bg-[var(--slot4-surface-bg)] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/20">
                      <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-[var(--slot4-accent)] transition group-hover:border-[var(--slot4-accent)]/40">
                        <Mail className="h-4 w-4" />
                      </span>
                      <div>
                        <h3 className="text-sm font-semibold text-white">{item.label}</h3>
                        <p className="mt-1 text-sm leading-6 text-white/50">{item.value}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              {/* What to expect */}
              <Reveal variant="fade">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-[var(--slot4-accent)]" />
                    <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/70">{contact.response.title}</h3>
                  </div>
                  <ul className="mt-5 space-y-3">
                    {contact.response.points.map((point) => (
                      <li key={point} className="flex items-start gap-3 text-sm leading-6 text-white/55">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--slot4-accent-2)]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              {/* Trust indicators */}
              <Reveal delay={80}>
                <div className="flex flex-wrap gap-3">
                  {contact.trust.map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/70"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-[var(--slot4-accent-2)]" />
                      {badge}
                    </span>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Right column: heading + form */}
            <Reveal variant="right" delay={120}>
              <div className="relative rounded-[2rem] border border-white/10 bg-[var(--slot4-panel-bg)] p-6 shadow-[0_30px_90px_rgba(2,6,23,0.6)] sm:p-9">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-[var(--slot4-accent)]" />
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--slot4-accent)]">Send a message</p>
                </div>
                <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-white sm:text-3xl">{contact.formTitle}</h2>
                <EditableContactLeadForm />
              </div>
            </Reveal>
          </div>
        </div>
      </main>
    </EditableSiteShell>
  )
}
