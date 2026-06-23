'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, LogOut, Menu, Radio, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const NAV_LINKS = globalContent.nav.primaryLinks

function NavLink({ href, label, active, onClick }: { href: string; label: string; active: boolean; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      
    >
      {label}
      <span
        
        className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-[var(--slot4-accent-gradient)] transition-transform duration-300 ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
      />
    </Link>
  )
}

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) => {
    const base = href.split('?')[0]
    if (base === '/') return pathname === '/'
    return pathname === base || pathname.startsWith(`${base}/`)
  }

  return (
    <header className="sticky top-0 z-50">
      <div
        className={`border-b transition-all duration-300 ${
          scrolled
            ? 'border-white/10 bg-[#1E1726]/85 backdrop-blur-xl supports-[backdrop-filter]:bg-[#1E1726]/65'
            : 'border-transparent bg-transparent'
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1200px] items-center justify-between gap-6 px-4 transition-all duration-300 sm:px-6 lg:px-8 ${
            scrolled ? 'h-16' : 'h-20'
          }`}
        >
          {/* Brand */}
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <span className="relative grid h-9 w-8 place-items-center rounded-xl bg-[var(--slot4-accent-gradient)] shadow-[0_8px_24px_-8px_rgba(87,73,100,0.9)]">
             <img src="/favicon.ico" alt="Logo" className="h-8 w-8" />
            </span>
            <span className="brand-wordmark max-w-[42vw] truncate text-lg text-white sm:text-xl">{SITE_CONFIG.name}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} active={isActive(item.href)} />
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/search"
              aria-label="Search the newsroom"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white/70 transition hover:border-white/30 hover:text-white sm:inline-flex"
            >
              <Search className="h-4 w-4" />
            </Link>

            {session ? (
              <>
                <Link
                  href="/create"
                  className="hidden items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/85 transition hover:border-white/25 hover:text-white sm:inline-flex"
                >
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--slot4-accent-gradient)] text-[10px] font-bold text-white">
                    {session.name.slice(0, 1).toUpperCase()}
                  </span>
                  <span className="max-w-[120px] truncate">{session.name}</span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="hidden items-center gap-1.5 rounded-full border border-white/12 px-4 py-2 text-sm font-medium text-white/70 transition hover:border-white/25 hover:text-white sm:inline-flex"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden rounded-full px-4 py-2 text-sm font-medium text-white/75 transition hover:text-white sm:inline-flex"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="hidden items-center gap-1.5 rounded-full bg-[var(--slot4-accent-gradient)] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_-10px_rgba(87,73,100,0.9)] transition hover:-translate-y-0.5 sm:inline-flex"
                >
                  Sign up <ArrowUpRight className="h-4 w-4" />
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/12 text-white lg:hidden"
              aria-label="Toggle navigation"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open ? (
        <div className="border-b border-white/10 bg-[#1E1726]/95 backdrop-blur-xl lg:hidden">
          <div className="mx-auto max-w-[1200px] px-4 py-5 sm:px-6">
            <form action="/search" className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2.5">
              <Search className="h-4 w-4 text-white/55" />
              <input
                name="q"
                type="search"
                placeholder="Search the newsroom"
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/40"
              />
            </form>
            <nav className="mt-4 grid gap-1">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive(item.href) ? 'bg-white/[0.06] text-white' : 'text-white/70 hover:bg-white/[0.04] hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 grid gap-2 border-t border-white/10 pt-4">
              {session ? (
                <>
                  <Link href="/create" onClick={() => setOpen(false)} className="rounded-full bg-[var(--slot4-accent-gradient)] px-5 py-3 text-center text-sm font-semibold text-white">
                    Distribute a release
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      setOpen(false)
                    }}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-white"
                  >
                    <LogOut className="h-4 w-4" /> Logout ({session.name})
                  </button>
                </>
              ) : (
                <>
                  <Link href="/signup" onClick={() => setOpen(false)} className="rounded-full bg-[var(--slot4-accent-gradient)] px-5 py-3 text-center text-sm font-semibold text-white">
                    Sign up
                  </Link>
                  <Link href="/login" onClick={() => setOpen(false)} className="rounded-full border border-white/15 px-5 py-3 text-center text-sm font-medium text-white">
                    Log in
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
