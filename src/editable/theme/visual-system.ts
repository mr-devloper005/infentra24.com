import { slot4BrandConfig } from './brand.config'

export type Slot4VisualPreset =
  | 'editorial-paper'
  | 'luxury-atelier'
  | 'brutalist-index'
  | 'organic-journal'
  | 'tech-directory'
  | 'retro-bulletin'
  | 'visual-gallery'

/**
 * All presets share one premium dark SaaS foundation so every product kind renders a
 * coherent navy/indigo/cyan experience. Hues shift per preset for personality while the
 * base stays dark and modern.
 */
const warmColors = {
  background: '#1E1726',
  foreground: '#F6EEF0',
  muted: '#C8AAAA',
  primary: '#574964',
  accent: '#FFDAB3',
  surface: '#322840',
}

export const visualPresets = {
  'editorial-paper': {
    label: 'Editorial Signal',
    mood: 'authoritative newsroom, warm and focused',
    fontDirection: 'tight sans display headings with calm reading body',
    colors: { ...warmColors },
    shape: 'rounded panels, hairline borders, soft peach glows',
  },
  'luxury-atelier': {
    label: 'Luxury Atelier',
    mood: 'premium, restrained, polished',
    fontDirection: 'high-contrast display headings with spacious tracking',
    colors: { ...warmColors, primary: '#9F8383', accent: '#C8AAAA' },
    shape: 'large plum panels, rose hairlines, generous negative space',
  },
  'brutalist-index': {
    label: 'Signal Index',
    mood: 'bold, structured, memorable',
    fontDirection: 'condensed headings, mono labels, hard rhythm',
    colors: { ...warmColors, background: '#1A1421', surface: '#2C2238' },
    shape: 'sharp grids, thin borders, offset accent blocks',
  },
  'organic-journal': {
    label: 'Calm Journal',
    mood: 'warm, trustworthy, modern',
    fontDirection: 'humanist sans with soft captions',
    colors: { ...warmColors, accent: '#C8AAAA' },
    shape: 'rounded cards, natural spacing, calm rose glow',
  },
  'tech-directory': {
    label: 'Tech Directory',
    mood: 'clean, fast, useful',
    fontDirection: 'modern sans with crisp mono data accents',
    colors: { ...warmColors },
    shape: 'clean grids, pill filters, sharp information hierarchy',
  },
  'retro-bulletin': {
    label: 'Bulletin',
    mood: 'energetic, distinctive',
    fontDirection: 'chunky headings with friendly body type',
    colors: { ...warmColors, primary: '#9F8383', accent: '#FFDAB3' },
    shape: 'framed modules, warm accents, playful dividers',
  },
  'visual-gallery': {
    label: 'Visual Gallery',
    mood: 'cinematic, image-led, immersive',
    fontDirection: 'minimal sans with oversized display moments',
    colors: { ...warmColors, background: '#191320', surface: '#2A2138' },
    shape: 'dark cards, large media, glass overlays',
  },
} as const

export const visualSystem = {
  productKind: slot4BrandConfig.productKind,
  recommendedPreset:
    slot4BrandConfig.productKind === 'visual'
      ? 'visual-gallery'
      : slot4BrandConfig.productKind === 'editorial'
        ? 'editorial-paper'
        : slot4BrandConfig.productKind === 'directory'
          ? 'tech-directory'
          : 'organic-journal',
  radius: {
    sm: '0.6rem',
    md: '1rem',
    lg: '1.4rem',
    xl: '2rem',
  },
  motion: {
    pageLoad: 'animate-in fade-in slide-in-from-bottom-4 duration-700',
    cardHover: 'transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl',
    softHover: 'transition duration-300 hover:opacity-85',
    reduceMotionSafe: 'motion-reduce:transform-none motion-reduce:transition-none',
  },
  typography: {
    eyebrow: 'text-xs font-semibold uppercase tracking-[0.26em]',
    heroTitle: 'text-5xl font-semibold tracking-[-0.045em] sm:text-6xl lg:text-7xl',
    sectionTitle: 'text-3xl font-semibold tracking-[-0.035em] sm:text-4xl',
    body: 'text-base leading-8',
    caption: 'text-xs font-medium uppercase tracking-[0.18em]',
  },
  surfaces: {
    glass: 'border border-white/10 bg-white/[0.05] backdrop-blur-xl',
    paper: 'border border-white/10 bg-[var(--slot4-surface-bg)] shadow-[0_24px_70px_rgba(2,6,23,0.45)]',
    quiet: 'border border-white/10 bg-white/[0.03]',
    dark: 'border border-white/10 bg-black/30 shadow-[0_24px_70px_rgba(0,0,0,0.4)]',
  },
  layout: {
    page: 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
    sectionY: 'py-16 sm:py-20 lg:py-28',
    cardGrid: 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3',
  },
} as const

export function getVisualPreset(name: Slot4VisualPreset = visualSystem.recommendedPreset as Slot4VisualPreset) {
  return visualPresets[name]
}
