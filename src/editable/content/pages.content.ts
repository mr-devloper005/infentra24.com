import { slot4BrandConfig } from '@/editable/theme/brand.config'

const brand = slot4BrandConfig.siteName

export const pagesContent = {
  home: {
    metadata: {
      title: 'Press Release Distribution & Media Outreach Platform',
      description:
        'Distribute press releases, syndicate your news to trusted media channels, and grow brand visibility with measurable reach — all from one modern media distribution platform.',
      openGraphTitle: 'Get your story everywhere it matters',
      openGraphDescription:
        'Press release distribution, news syndication, and PR campaign tools built for brands, agencies, and newsrooms.',
      keywords: ['press release distribution', 'news syndication', 'media outreach', 'PR campaigns', 'brand visibility'],
    },
    hero: {
      badge: 'Media distribution, simplified',
      title: ['Your story,', 'everywhere it matters.'],
      description:
        'Publish and distribute press releases, syndicate news across trusted media channels, and put your brand in front of journalists and the audiences that move markets — with reach you can measure.',
      primaryCta: { label: 'Distribute a release', href: '/create' },
      secondaryCta: { label: 'Explore the newsroom', href: '/updates' },
      searchPlaceholder: 'Search releases, companies, industries, and coverage',
      focusLabel: 'Live newsroom',
      featureCardBadge: 'live distribution',
      featureCardTitle: 'Every release lands in front of the right newsrooms.',
      featureCardDescription:
        'Fresh announcements move to the front of the feed automatically, keeping your latest coverage visible the moment it goes live.',
    },
    stats: [
      { value: '500+', label: 'Media & news channels' },
      { value: '40k+', label: 'Releases distributed' },
      { value: '120+', label: 'Industries covered' },
      { value: '98%', label: 'Client retention' },
    ],
    problems: {
      eyebrow: 'Why PR feels harder than it should',
      title: ['Getting noticed is', 'fragmented, slow, and unclear.'],
      description:
        'Without the right platform, distribution becomes guesswork. We bring clarity, reach, and measurement to every announcement you publish.',
      items: [
        {
          title: 'Limited reach',
          description: 'Great news goes nowhere when it only reaches a handful of outlets and a single audience.',
        },
        {
          title: 'Scattered channels',
          description: 'Juggling journalists, wires, and platforms separately wastes hours and dilutes your message.',
        },
        {
          title: 'No visibility on impact',
          description: 'Most teams publish and hope, with no clear view of where coverage landed or who engaged.',
        },
        {
          title: 'Slow time-to-press',
          description: 'Manual outreach delays announcements until the moment has already passed.',
        },
      ],
    },
    features: {
      eyebrow: 'Everything you need to be heard',
      title: ['One platform for', 'distribution that performs.'],
      description:
        'From drafting to syndication to coverage tracking, run the entire media distribution workflow in one connected place.',
      items: [
        {
          title: 'Press release distribution',
          description:
            'Publish once and push your announcement across news media, industry verticals, and partner channels in minutes.',
        },
        {
          title: 'News syndication',
          description:
            'Syndicate stories to a growing network of outlets so the right readers discover your news organically.',
        },
        {
          title: 'Targeted media outreach',
          description:
            'Reach journalists and publishers by industry and category instead of blasting a generic list.',
        },
        {
          title: 'Brand visibility tracking',
          description:
            'See where your coverage lives, follow related stories, and keep your newsroom presence consistent.',
        },
        {
          title: 'Campaign-ready workflows',
          description:
            'Plan, schedule, and organize PR campaigns with structured posts, categories, and clean publishing.',
        },
        {
          title: 'SEO-friendly newsroom',
          description:
            'Every release lives on a fast, search-optimized page so your announcements keep working long after launch.',
        },
      ],
    },
    intro: {
      badge: 'Built for modern PR teams',
      title: 'A connected newsroom for brands, agencies, and communicators.',
      paragraphs: [
        'This platform brings press release distribution, news syndication, and media outreach together so your team can move from announcement to coverage without switching tools.',
        'Instead of scattering releases across disconnected wires and inboxes, every story is published to a structured newsroom with categories, search, and related coverage that keep your news discoverable.',
        'Whether you launch a product, share company news, or run a full PR campaign, the experience stays fast, measurable, and on-brand from draft to distribution.',
      ],
      sideBadge: 'At a glance',
      sidePoints: [
        'Distribute releases across hundreds of news and industry channels.',
        'Organize announcements with dynamic, master-panel-driven categories.',
        'Keep coverage discoverable with search and related-story links.',
        'Launch on a fast, SEO-ready newsroom that compounds over time.',
      ],
      primaryLink: { label: 'Browse the newsroom', href: '/updates' },
      secondaryLink: { label: 'Distribute a release', href: '/create' },
    },
    cta: {
      badge: 'Ready when you are',
      title: 'Put your next announcement in front of the right audience.',
      description:
        'Join the brands and agencies using our platform to distribute press releases, syndicate news, and grow brand visibility with measurable reach.',
      primaryCta: { label: 'Distribute a release', href: '/create' },
      secondaryCta: { label: 'Talk to our team', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest releases and coverage in this section.',
    },
  },
  about: {
    badge: 'About us',
    title: 'We help brands get heard, everywhere.',
    description: `${brand} is a modern media distribution platform built to turn announcements into measurable reach across news media, industry publications, and the audiences that matter.`,
    paragraphs: [
      'We started with a simple belief: great news deserves more than a single outlet. Brands, agencies, and communicators needed a faster, clearer way to distribute press releases and syndicate stories without stitching together a dozen disconnected tools.',
      'Today, our platform connects your newsroom to a wide network of channels, organizes coverage with dynamic categories, and keeps every release discoverable long after launch — so your visibility compounds instead of fading.',
    ],
    mission: {
      eyebrow: 'Our mission',
      title: 'Make professional media distribution accessible to every brand.',
      description:
        'We remove the friction between an announcement and its audience, so teams of any size can publish, syndicate, and be discovered with confidence.',
    },
    vision: {
      eyebrow: 'Our vision',
      title: 'A world where the right story always reaches the right reader.',
      description:
        'We are building the connective tissue between newsrooms, publishers, and audiences — measurable, transparent, and built for the pace of modern PR.',
    },
    values: [
      {
        title: 'Reach with intent',
        description: 'We prioritize relevant, category-led distribution over noise so coverage actually lands.',
      },
      {
        title: 'Clarity and measurement',
        description: 'Every release should be trackable, discoverable, and built to keep performing over time.',
      },
      {
        title: 'Trustworthy by design',
        description: 'Clean publishing, fast pages, and credible presentation protect your brand at every step.',
      },
    ],
    whyChooseUs: {
      eyebrow: 'Why choose us',
      title: 'Distribution, syndication, and outreach — without the busywork.',
      items: [
        { title: 'Wide media reach', description: 'Push announcements across hundreds of news and industry channels in minutes.' },
        { title: 'Brand growth', description: 'Keep your newsroom active and discoverable to grow visibility release after release.' },
        { title: 'Industry impact', description: 'Reach decision-makers in the verticals where your story carries the most weight.' },
        { title: 'Always-on newsroom', description: 'SEO-ready pages keep your coverage working long after the announcement goes live.' },
      ],
    },
    stats: [
      { value: '500+', label: 'Distribution channels' },
      { value: '40k+', label: 'Releases delivered' },
      { value: '120+', label: 'Industries served' },
      { value: '24/7', label: 'Live newsroom' },
    ],
  },
  contact: {
    eyebrow: `Contact ${brand}`,
    title: 'Let’s get your story in front of the right audience.',
    description:
      'Tell us about your announcement, campaign, or distribution needs. Our team will route you to the right desk and respond quickly — no generic support queue.',
    formTitle: 'Send us a message',
    info: [
      { label: 'Editorial & newsroom', value: 'Story ideas, embargoes, and publishing questions.' },
      { label: 'Media partnerships', value: 'Syndication, channel partnerships, and PR campaigns.' },
      { label: 'General support', value: 'Account, distribution, and platform help.' },
    ],
    response: {
      title: 'What to expect',
      points: [
        'A real reply from our team, usually within one business day.',
        'Routing to the right desk for editorial, partnerships, or support.',
        'Clear next steps for distributing or syndicating your news.',
      ],
    },
    trust: ['Trusted by brands & agencies', '500+ media channels', 'Measurable reach'],
  },
  search: {
    metadata: {
      title: 'Search the newsroom',
      description: 'Search press releases, news coverage, companies, and categories across the platform.',
    },
    hero: {
      badge: 'Search the archive',
      title: 'Find releases, coverage, and companies faster.',
      description:
        'Search by keyword, industry, category, or content type to discover announcements from every active section of the newsroom.',
      placeholder: 'Search by keyword, company, industry, or headline',
    },
    resultsTitle: 'Latest from the newsroom',
  },
  create: {
    metadata: {
      title: 'Distribute a release',
      description: 'Draft and distribute press releases and news to the platform.',
    },
    locked: {
      badge: 'Member access',
      title: 'Log in to distribute your release.',
      description:
        'Sign in to open the publishing workspace and prepare a press release for distribution across the newsroom and connected channels.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Draft and distribute your announcement.',
      description:
        'Choose a content type, add your details, and prepare a clean, distribution-ready release with headline, summary, links, and full story.',
    },
    formTitle: 'Release details',
    submitLabel: 'Submit for distribution',
    successTitle: 'Your release was submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Log in to your media distribution account.',
      badge: 'Member access',
      title: 'Welcome back to your newsroom.',
      description: 'Log in to distribute releases, manage submissions, and track your coverage across the platform.',
      formTitle: 'Log in',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then log in.',
      success: 'Login successful. Redirecting…',
      createCta: 'Create an account',
      benefits: [
        'Distribute press releases across hundreds of channels',
        'Track coverage and related stories in one newsroom',
        'Reach journalists and audiences by industry',
      ],
    },
    signup: {
      metadataDescription: 'Create your media distribution account.',
      badge: 'Get started free',
      title: 'Create your account and start distributing.',
      description:
        'Set up your newsroom in minutes. Distribute releases, syndicate news, and grow brand visibility with measurable reach.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting…',
      loginCta: 'Log in',
      benefits: [
        'Publish your first release the day you sign up',
        'Organize campaigns with dynamic categories',
        'SEO-ready pages that keep working after launch',
      ],
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related coverage',
      fallbackTitle: 'Release details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested coverage',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const
