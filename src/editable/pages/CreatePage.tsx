'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, ImageIcon, Lock, PlusCircle, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { Reveal } from '@/editable/components/Motion'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Sparkles,
  classified: PlusCircle,
  image: ImageIcon,
  profile: Sparkles,
  pdf: FileText,
  sbm: ArrowRight,
}

const fieldClass = 'rounded-xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/40 focus:border-[var(--slot4-accent)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="relative">
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-[-10rem] h-96 w-96 -translate-x-1/2 rounded-full bg-[var(--slot4-accent-fill)]/18 blur-[140px]" />
          </div>
          <section className="relative mx-auto flex max-w-[1200px] items-center justify-center px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <Reveal className="w-full max-w-xl">
              <div className="rounded-2xl border border-white/10 bg-[var(--slot4-surface-bg)] p-8 text-center shadow-[0_30px_90px_rgba(2,6,23,0.6)] sm:p-12">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[var(--slot4-accent)]">
                  <Lock className="h-7 w-7" />
                </div>
                <p className="mt-7 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--slot4-accent)]">{pagesContent.create.locked.badge}</p>
                <h1 className="mt-4 text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-4xl">{pagesContent.create.locked.title}</h1>
                <p className="mx-auto mt-5 max-w-md text-base leading-8 text-white/55">{pagesContent.create.locked.description}</p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent-gradient)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(87,73,100,0.8)] transition hover:-translate-y-0.5">Login <ArrowRight className="h-4 w-4" /></Link>
                  <Link href="/signup" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30">Sign up</Link>
                </div>
              </div>
            </Reveal>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[-12rem] h-96 w-96 -translate-x-1/2 rounded-full bg-[var(--slot4-accent-fill)]/16 blur-[140px]" />
        </div>
        <section className="relative mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <Reveal as="aside">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--slot4-accent)]">
                <Sparkles className="h-3.5 w-3.5" /> {pagesContent.create.hero.badge}
              </p>
              <h1 className="mt-6 text-4xl font-semibold leading-[1.04] tracking-[-0.035em] text-white sm:text-5xl">{pagesContent.create.hero.title}</h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-white/55">{pagesContent.create.hero.description}</p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {enabledTasks.map((item) => {
                  const Icon = taskIcon[item.key] || FileText
                  const active = item.key === task
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setTask(item.key)}
                      className={`rounded-2xl border p-4 text-left transition ${active ? 'border-[var(--slot4-accent)] bg-[var(--slot4-accent-soft)] text-white' : 'border-white/10 bg-white/[0.03] text-white hover:-translate-y-0.5 hover:border-white/20'}`}
                    >
                      <Icon className={`h-5 w-5 ${active ? 'text-[var(--slot4-accent)]' : 'text-white/60'}`} />
                      <span className="mt-3 block text-sm font-semibold">{item.label}</span>
                      <span className="mt-1 block text-xs leading-5 text-white/50">{item.description}</span>
                    </button>
                  )
                })}
              </div>
            </Reveal>

            <Reveal delay={120}>
              <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-[var(--slot4-surface-bg)] p-6 shadow-[0_30px_90px_rgba(2,6,23,0.6)] sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--slot4-accent)]">Create {activeTask?.label || 'post'}</p>
                    <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-white sm:text-3xl">{pagesContent.create.formTitle}</h2>
                  </div>
                  <span className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/70">{session.name}</span>
                </div>

                <div className="mt-6 grid gap-4">
                  <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Post title" required />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                    <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
                  </div>
                  <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
                  <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
                  <textarea className={`${fieldClass} min-h-48`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, details, notes, or description" required />
                </div>

                {created ? (
                  <div className="mt-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-emerald-200">
                    <p className="flex items-center gap-2 text-sm font-semibold"><CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}</p>
                    <p className="mt-1 text-sm text-emerald-200/80">{created.title}</p>
                  </div>
                ) : null}

                <button type="submit" className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-gradient)] px-6 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(87,73,100,0.8)] transition hover:-translate-y-0.5">
                  <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
                </button>
              </form>
            </Reveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
