/**
 * Every brand string lives here.
 *
 * Swapping MARRAM for a real studio is a single-file edit: change the values
 * below and the wordmark, metadata, footer, nav and all voice copy follow.
 */

export const brand = {
  name: "Marram",
  wordmark: "MARRAM",
  /** Why the name. Used on the about page and in the footer. */
  etymology:
    "Marram is the grass that holds a dune together. Roots three metres down, nothing much to look at above ground.",
  discipline: "Wedding studio",
  base: "Aldeburgh, Suffolk",
  reach: "Britain and Europe",
  founded: 2014,
  email: "hello@marram.studio",
  phone: "+44 1728 000000",
  address: {
    street: "The Net Shed, Crag Path",
    city: "Aldeburgh",
    region: "Suffolk",
    postcode: "IP15 5BS",
    country: "GB",
  },
  social: {
    instagram: "https://instagram.com",
    pinterest: "https://pinterest.com",
  },
  /** Used for canonicals and OG. Override with NEXT_PUBLIC_SITE_URL in prod. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://marram.studio").replace(/\/+$/, ""),
} as const;

export const voice = {
  /** The line that does the most work. Sits under the hero headline. */
  positioning:
    "We plan weddings in Britain and Europe. Around forty a year, which is fewer than we could take and about right.",
  /** Meta description default. */
  metaDescription:
    "Marram is a wedding studio in Aldeburgh, Suffolk, planning weddings across Britain and Europe. Full planning, design and wedding-day management.",
  newsletter: {
    heading: "Notes for the newly engaged",
    body: "One email a month. What’s worth booking early, what isn’t, and a wedding we loved.",
    cta: "Sign up",
    confirmation: "You’re on the list. First note arrives at the start of the month.",
  },
} as const;

export const nav = {
  primary: [
    { label: "Weddings", href: "/weddings" },
    { label: "Inspiration", href: "/inspiration" },
    { label: "Venues", href: "/venues" },
    { label: "Vendors", href: "/vendors" },
    { label: "Planning", href: "/planning" },
    { label: "About", href: "/about" },
  ],
  cta: { label: "Talk to a planner", href: "/contact" },
} as const;

export const footerNav = [
  {
    heading: "Look",
    links: [
      { label: "Real weddings", href: "/weddings" },
      { label: "Inspiration", href: "/inspiration" },
      { label: "Venues", href: "/venues" },
      { label: "Vendors", href: "/vendors" },
    ],
  },
  {
    heading: "Plan",
    links: [
      { label: "Planning hub", href: "/planning" },
      { label: "Find your direction", href: "/planning/quiz" },
      { label: "Budget planner", href: "/planning/budget" },
      { label: "Timeline", href: "/planning/timeline" },
      { label: "Checklist", href: "/planning/checklist" },
      { label: "The guide", href: "/guide" },
    ],
  },
  {
    heading: "Work with us",
    links: [
      { label: "Services", href: "/services" },
      { label: "About", href: "/about" },
      { label: "Questions", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
] as const;

export const footerMeta = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
] as const;

/**
 * The demo-content notice. This dataset is invented so the site can be seen
 * working; saying so plainly is better than dressing it up.
 */
export const demoNotice =
  "Sample content. Weddings, venues, vendors and couples on this site are invented for demonstration.";
