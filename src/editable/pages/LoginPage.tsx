import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { SITE_CONFIG } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { Reveal } from '@/editable/components/Motion'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  const auth = pagesContent.auth.login
  return (
    <EditableSiteShell>
      <main className="text-[var(--slot4-page-text)]">
        <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-[1100px] items-center px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
            <Reveal>
              <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-[var(--slot4-panel-bg)] p-8 sm:p-10">
                <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[var(--slot4-accent-fill)]/20 blur-[120px]" />
                <div className="relative">
                  <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{auth.badge}</p>
                  <h1 className="mt-5 max-w-md text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl">
                    Welcome back to your <span className="gradient-text">newsroom.</span>
                  </h1>
                  <p className="mt-5 max-w-md text-base leading-8 text-[var(--slot4-muted-text)]">{auth.description}</p>
                  <ul className="mt-8 grid gap-4">
                    {auth.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3 text-sm leading-7 text-[var(--slot4-page-text)]">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--slot4-accent)]" aria-hidden />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-10 text-xs font-medium uppercase tracking-[0.22em] text-[var(--slot4-soft-muted-text)]">
                    Trusted by teams distributing on {SITE_CONFIG.name}
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal variant="right" delay={120}>
              <div className="h-full rounded-3xl border border-white/10 bg-[var(--slot4-surface-bg)] p-7 sm:p-10">
                <h2 className="text-2xl font-semibold tracking-[-0.02em]">{auth.formTitle}</h2>
                <EditableLocalLoginForm />
                <p className="mt-6 border-t border-white/10 pt-6 text-sm text-white/60">
                  New here? <Link href="/signup" className="font-semibold text-[var(--slot4-accent)] underline-offset-4 hover:underline">{auth.createCta}</Link>
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </main>
    </EditableSiteShell>
  )
}
