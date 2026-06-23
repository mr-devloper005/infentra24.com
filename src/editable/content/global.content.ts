import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Press release distribution & media outreach',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Press distribution, news syndication & brand visibility',
    primaryLinks: [
      { label: 'Newsroom', href: '/updates' },
      
     
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Distribute a release', href: '/create' },
      secondary: { label: 'Talk to us', href: '/contact' },
    },
  },
  footer: {
    tagline: 'One platform for press releases, news syndication, and media outreach',
    description:
      'A modern media distribution platform that gets your announcements in front of journalists, publishers, and the right audiences — with measurable reach across hundreds of news and industry channels.',
    columns: [
      {
        title: 'Platform',
        links: [
          { label: 'Newsroom', href: '/updates' },

          { label: 'Search the archive', href: '/search' },
        ],
      },
      {
        title: 'Company',
        links: [
          { label: 'About us', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Distribute a release', href: '/create' },
        ],
      },
      {
        title: 'Account',
        links: [
          { label: 'Log in', href: '/login' },
          { label: 'Create account', href: '/signup' },
        ],
      },
    ],
    bottomNote: 'Built for fast, measurable, category-led media distribution.',
  },
  commonLabels: {
    readMore: 'Read release',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related coverage',
    published: 'Distributed',
  },
} as const
