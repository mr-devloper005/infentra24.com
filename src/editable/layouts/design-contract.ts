import type { CSSProperties } from 'react'

/**
 * Premium dark SaaS design system for the media distribution platform.
 *
 * The whole site reads these `--slot4-*` CSS variables, so repointing them here
 * re-themes every surface at once. We also define the container/border tokens that
 * page layouts reference (`--editable-container`, `--editable-border`, ...), which were
 * previously undefined and caused the over-stretched layouts.
 */
export const editableRootStyle = {
  // Core surfaces — deep plum base with mauve / rose / peach accents
  '--slot4-page-bg': '#1E1726',
  '--slot4-page-text': '#F6EEF0',
  '--slot4-panel-bg': '#281F31',
  '--slot4-surface-bg': '#322840',
  '--slot4-elevated-bg': '#574964',
  '--slot4-muted-text': '#C8AAAA',
  '--slot4-soft-muted-text': '#9F8383',
  '--slot4-accent': '#FFDAB3',
  '--slot4-accent-fill': '#9F8383',
  '--slot4-accent-2': '#C8AAAA',
  '--slot4-accent-3': '#7A5E73',
  '--slot4-accent-soft': '#33293D',
  '--slot4-dark-bg': '#191320',
  '--slot4-dark-text': '#F6EEF0',
  '--slot4-media-bg': '#281F31',
  '--slot4-cream': '#1E1726',
  '--slot4-warm': '#322840',
  '--slot4-lavender': '#9F8383',
  '--slot4-gray': '#281F31',
  '--slot4-body-gradient':
    'radial-gradient(1200px 680px at 78% -8%, rgba(159,131,131,0.20), transparent 60%), radial-gradient(960px 620px at 8% 4%, rgba(255,218,179,0.12), transparent 58%), linear-gradient(180deg, #1E1726 0%, #211A29 100%)',
  // Button / icon gradient (white text stays readable): plum → mauve
  '--slot4-accent-gradient': 'linear-gradient(135deg, #574964 0%, #7A5E73 48%, #9F8383 100%)',
  // Bright headline / clip-text gradient on dark: peach → rose
  '--slot4-text-gradient': 'linear-gradient(135deg, #FFDAB3 0%, #C8AAAA 100%)',

  // Layout tokens consumed by page files (previously undefined → no max-width)
  '--editable-container': '1200px',
  '--editable-border': 'rgba(200,170,170,0.18)',
  '--editable-page-bg': '#1E1726',
  '--editable-page-text': '#F6EEF0',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-white/10',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[0_10px_40px_rgba(20,14,26,0.5)]',
  shadowStrong: 'shadow-[0_30px_90px_rgba(20,14,26,0.65)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(30,23,38,0.1),rgba(30,23,38,0.92))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8',
    sectionWide: 'mx-auto w-full max-w-[1320px] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-16 sm:py-20 lg:py-28',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[280px] shrink-0 snap-start sm:w-[320px]',
  },
  type: {
    eyebrow: 'text-[11px] font-bold uppercase tracking-[0.28em]',
    heroTitle: 'text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl lg:text-[4.6rem]',
    sectionTitle: 'text-3xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-[2.7rem]',
    body: 'text-base leading-8',
  },
  surface: {
    card: `rounded-2xl border ${editablePalette.border} bg-[var(--slot4-surface-bg)]`,
    soft: `rounded-2xl border ${editablePalette.border} bg-white/[0.03]`,
    glass: 'rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl',
    dark: `rounded-2xl ${editablePalette.darkBg} ${editablePalette.darkText}`,
  },
  button: {
    primary:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-gradient,#6366F1)] [background-image:var(--slot4-accent-gradient)] px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_40px_-12px_rgba(87,73,100,0.85)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_50px_-12px_rgba(87,73,100,0.95)]',
    secondary:
      'inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-7 py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/[0.07]',
    accent:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-7 py-3.5 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--slot4-accent-3)]',
  },
  media: {
    frame: `relative overflow-hidden rounded-2xl ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/3]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_-24px_rgba(87,73,100,0.6)]',
    fade: 'transition duration-300 hover:opacity-80',
    glow: 'transition duration-300 hover:shadow-[0_0_0_1px_rgba(255,218,179,0.4),0_28px_70px_-24px_rgba(87,73,100,0.6)]',
  },
} as const

export const aiLayoutRules = [
  'All visible layout decisions belong inside src/editable; keep data, SEO, API, and route logic untouched.',
  'Use a premium dark SaaS aesthetic: deep navy surfaces, indigo→cyan gradient accents, soft glows, generous spacing.',
  'Keep dynamic post fetching intact and never replace backend posts with mock arrays.',
  'Use postHref() for all post links so route aliases and task-specific detail pages remain functional.',
  'Constrain layouts to professional max-width containers; avoid full-bleed stretched sections.',
  'Branding must remain dynamic from SITE_CONFIG; never hardcode a reference brand name or logo.',
] as const
