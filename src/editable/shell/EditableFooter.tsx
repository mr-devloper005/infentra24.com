'use client'

import Link from 'next/link'
import { ArrowUpRight, Mail, Radio } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { columns, description } = globalContent.footer

  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/10 bg-[#1E1726]">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[var(--slot4-accent)]/60 to-transparent" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[42rem] -translate-x-1/2 rounded-full bg-[var(--slot4-accent-fill)]/12 blur-[120px]" />

      <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* CTA band */}
        <div className="grid gap-8 border-b border-white/10 py-14 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-white sm:text-4xl">
              Ready to get your story <span className="gradient-text">everywhere it matters?</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/55">{description}</p>
          </div>
          <div className="lg:justify-self-end">
            <form action="/signup" className="flex w-full max-w-md items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] p-1.5 pl-4">
              <Mail className="h-4 w-4 shrink-0 text-white/45" />
              <input
                name="email"
                type="email"
                placeholder="Work email for newsroom updates"
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
              />
              <button className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--slot4-accent-gradient)] px-5 py-2.5 text-sm font-semibold text-white">
                Subscribe
              </button>
            </form>
            <div className="mt-3 flex flex-wrap gap-3">
              <Link href="/create" className="inline-flex items-center gap-1 text-sm font-medium text-white/70 transition hover:text-white">
                Distribute a release <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-[var(--slot4-accent-gradient)]">
                <img src="/favicon.ico" alt="Logo" className="h-8 w-8" />
              </span>
              <span className="brand-wordmark text-xl text-white">{SITE_CONFIG.name}</span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-7 text-white/50">{globalContent.footer.tagline}.</p>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-white/40">{column.title}</h3>
              <ul className="mt-4 grid gap-3">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.href}-${link.label}`}>
                    <Link href={link.href} className="text-sm text-white/65 transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-white/40">© {year} {SITE_CONFIG.name}. All rights reserved.</p>
          <p className="text-xs text-white/40">{globalContent.footer.bottomNote}</p>
        </div>
      </div>
    </footer>
  )
}
