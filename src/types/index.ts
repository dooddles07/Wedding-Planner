/**
 * The domain, in one place.
 *
 * Everything the site renders is shaped by these types. Demo content in
 * src/content conforms to them, and swapping the local repository for a real
 * backend means producing the same shapes — nothing downstream changes.
 */

/* -------------------------------------------------------------------------
   Shared vocabulary
   ------------------------------------------------------------------------- */

export type Season = "spring" | "summer" | "autumn" | "winter";

export type WeddingStyleId =
  | "modern"
  | "romantic"
  | "garden"
  | "coastal"
  | "classic"
  | "destination"
  | "intimate"
  | "black-tie"
  | "cultural"
  | "minimal";

export interface WeddingStyle {
  id: WeddingStyleId;
  name: string;
  /** One line, in the studio’s voice. Shown under the name on hover. */
  tagline: string;
  description: string;
  imageId: string;
  /** Hex swatches that define the style’s palette on the style page. */
  palette: string[];
  /** Copy fragments the quiz reuses when it describes a result. */
  keywords: string[];
}

export type VenueType =
  | "country-house"
  | "barn"
  | "coastal"
  | "garden"
  | "city"
  | "chateau"
  | "vineyard"
  | "castle"
  | "restaurant"
  | "marquee";

export type VendorCategory =
  | "photographers"
  | "videographers"
  | "florists"
  | "caterers"
  | "hair-makeup"
  | "djs"
  | "bands"
  | "decor"
  | "stationery"
  | "cake"
  | "transport"
  | "dresses"
  | "suits"
  | "jewellery"
  | "planners";

/** Indicative bands. Never a fabricated exact price. */
export type PriceBand = 1 | 2 | 3 | 4;

/* -------------------------------------------------------------------------
   Media
   ------------------------------------------------------------------------- */

export interface Photograph {
  id: string;
  /** Unsplash photo id — the stable part of images.unsplash.com/photo-<id>. */
  unsplashId: string;
  alt: string;
  credit: string;
  creditUrl: string;
  /** Dominant tone, used as the blur placeholder while the image loads. */
  tone: string;
  aspect: "portrait" | "landscape" | "square" | "tall";
}

/* -------------------------------------------------------------------------
   People
   ------------------------------------------------------------------------- */

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Couple {
  id: string;
  /** Both names, as they’d like them written. */
  partnerOne: string;
  partnerTwo: string;
  email: string;
  /** ISO date. Null while they’re still deciding. */
  weddingDate: string | null;
  location: string | null;
  guestCount: number | null;
  budget: number | null;
  styleIds: WeddingStyleId[];
  createdAt: string;
}

/* -------------------------------------------------------------------------
   Editorial
   ------------------------------------------------------------------------- */

export interface WeddingStory {
  slug: string;
  couple: string;
  /** "Sofia & Nadine, at home in Puglia" — the editorial headline. */
  title: string;
  standfirst: string;
  location: string;
  country: string;
  venue: string;
  date: string;
  season: Season;
  guestCount: number;
  styleIds: WeddingStyleId[];
  heroImageId: string;
  /** Ordered prose sections. Some carry a photograph, some don’t. */
  chapters: StoryChapter[];
  /** The planner’s account of what was actually hard. */
  challenge: { title: string; body: string };
  designNotes: string[];
  runningOrder: { time: string; label: string }[];
  galleryImageIds: string[];
  credits: { role: string; name: string }[];
  readMinutes: number;
}

export interface StoryChapter {
  heading?: string;
  body: string[];
  imageId?: string;
  /** Sits in the margin rail beside the chapter. */
  marginNote?: string;
  pullQuote?: string;
}

export interface Inspiration {
  slug: string;
  title: string;
  caption: string;
  imageId: string;
  styleIds: WeddingStyleId[];
  season: Season;
  location: string;
  venueType: VenueType;
  /** Hex swatches pulled from the photograph. */
  colours: string[];
  mood: string[];
  /** Links back to the story it came from, when it came from one. */
  storySlug?: string;
}

export interface Testimonial {
  id: string;
  couple: string;
  location: string;
  weddingType: string;
  quote: string;
  imageId: string;
  /** Demo content flag — kept in the data so the UI can label it honestly. */
  demo: true;
}

/* -------------------------------------------------------------------------
   Directories
   ------------------------------------------------------------------------- */

export interface Venue {
  slug: string;
  name: string;
  location: string;
  region: string;
  country: string;
  type: VenueType;
  standfirst: string;
  description: string[];
  capacitySeated: number;
  capacityStanding: number;
  priceBand: PriceBand;
  /** Indicative hire range, clearly framed as indicative in the UI. */
  priceFrom: number;
  priceTo: number;
  indoor: boolean;
  outdoor: boolean;
  accommodation: number;
  exclusiveUse: boolean;
  styleIds: WeddingStyleId[];
  features: string[];
  heroImageId: string;
  galleryImageIds: string[];
  faqs: FAQ[];
  /** Rough coordinates for the static map. */
  coordinates: { lat: number; lng: number };
  /** Seasons with dates still open, per the demo dataset. */
  availability: Season[];
}

export interface Vendor {
  slug: string;
  name: string;
  category: VendorCategory;
  location: string;
  standfirst: string;
  description: string[];
  priceBand: PriceBand;
  priceFrom: number;
  travelsNationally: boolean;
  travelsInternationally: boolean;
  styleIds: WeddingStyleId[];
  specialities: string[];
  heroImageId: string;
  portfolioImageIds: string[];
  /** Demo dataset. The UI labels these as sample profiles. */
  demo: true;
}

export interface Service {
  slug: string;
  name: string;
  /** The one-line promise. */
  promise: string;
  standfirst: string;
  description: string[];
  includes: string[];
  idealFor: string[];
  /** Indicative starting fee. */
  feeFrom: number;
  feeNote: string;
  imageId: string;
  /** Sits above the name in the margin rail. */
  index: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

/* -------------------------------------------------------------------------
   Planning tools
   ------------------------------------------------------------------------- */

export type TaskCategory =
  | "planning"
  | "venue"
  | "vendors"
  | "attire"
  | "beauty"
  | "guests"
  | "invitations"
  | "ceremony"
  | "reception"
  | "photography"
  | "transport"
  | "honeymoon"
  | "legal"
  | "final-week"
  | "wedding-day";

export type TaskPriority = "low" | "normal" | "high";

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  /** Months before the wedding this usually happens. 0 = the day itself. */
  monthsBefore: number;
  done: boolean;
  priority: TaskPriority;
  /** ISO date, set by the couple. */
  dueDate: string | null;
  note: string | null;
  /** Seeded from the standard checklist vs. added by the couple. */
  custom: boolean;
}

export type BudgetCategory =
  | "venue"
  | "catering"
  | "photography"
  | "videography"
  | "florals"
  | "decor"
  | "attire"
  | "entertainment"
  | "stationery"
  | "transport"
  | "planner"
  | "misc"
  | "contingency";

export interface BudgetItem {
  category: BudgetCategory;
  label: string;
  /** Share of the total, 0–1. Sums to 1 across all items. */
  share: number;
  /** Overridden by the couple; falls back to share x total. */
  allocated: number;
  spent: number;
  note?: string;
}

export interface BudgetPlan {
  total: number;
  guestCount: number;
  location: string;
  styleId: WeddingStyleId | null;
  planningLevel: "full" | "partial" | "day-of" | "none";
  items: BudgetItem[];
  updatedAt: string;
}

export interface TimelineItem {
  id: string;
  /** Months before the wedding. 0 = the day, -1 = after. */
  monthsBefore: number;
  label: string;
  taskIds: string[];
}

/* -------------------------------------------------------------------------
   Guests
   ------------------------------------------------------------------------- */

export type RsvpStatus = "pending" | "attending" | "declined" | "maybe";
export type MealChoice = "meat" | "fish" | "vegetarian" | "vegan" | "child" | null;

export interface Guest {
  id: string;
  name: string;
  email: string | null;
  /** "Bride’s family", "University", "Work" — free text, their own grouping. */
  group: string;
  side: "one" | "two" | "both";
  rsvp: RsvpStatus;
  meal: MealChoice;
  dietary: string | null;
  plusOne: boolean;
  plusOneName: string | null;
  /** Which events they’re invited to: ceremony, dinner, party, brunch. */
  events: string[];
  note: string | null;
}

/* -------------------------------------------------------------------------
   The quiz
   ------------------------------------------------------------------------- */

export interface QuizOption {
  value: string;
  label: string;
  /** Shown under the label. Optional — some questions need no explanation. */
  hint?: string;
  imageId?: string;
  /** Style weights this answer contributes to the final profile. */
  weights?: Partial<Record<WeddingStyleId, number>>;
}

export interface QuizQuestion {
  id: string;
  /** The running-order style time marker for this step. */
  marker: string;
  question: string;
  /** A line of context in the planner’s voice. */
  note?: string;
  kind: "choice" | "image-choice" | "scale" | "date" | "text" | "number";
  options?: QuizOption[];
  multiple?: boolean;
  optional?: boolean;
  placeholder?: string;
}

export type QuizAnswers = Record<string, string | string[] | number | null>;

export interface QuizResult {
  /** Three to five words that describe the direction. */
  direction: string[];
  headline: string;
  summary: string;
  primaryStyle: WeddingStyle;
  supportingStyles: WeddingStyle[];
  recommendedServiceSlug: string;
  recommendedVenueSlugs: string[];
  recommendedInspirationSlugs: string[];
  nextSteps: string[];
}

/* -------------------------------------------------------------------------
   Conversion
   ------------------------------------------------------------------------- */

export type LeadSource =
  | "hero"
  | "quiz"
  | "budget"
  | "guide"
  | "contact"
  | "venue"
  | "vendor"
  | "service"
  | "newsletter"
  | "footer";

export interface Lead {
  id: string;
  name: string;
  email: string;
  weddingDate: string | null;
  location: string | null;
  guestCount: number | null;
  message: string | null;
  source: LeadSource;
  /** Anything the quiz or budget tool already knows about them. */
  context: Record<string, unknown>;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  /** venue or vendor slug */
  targetSlug: string;
  targetType: "venue" | "vendor";
  name: string;
  email: string;
  weddingDate: string | null;
  message: string;
  createdAt: string;
}

/* -------------------------------------------------------------------------
   The couple’s own wedding site
   ------------------------------------------------------------------------- */

export type SiteTemplate = "first-light" | "long-table" | "last-dance";

export interface WeddingSite {
  slug: string;
  template: SiteTemplate;
  partnerOne: string;
  partnerTwo: string;
  date: string | null;
  location: string;
  venue: string;
  story: string;
  heroImageId: string;
  schedule: { time: string; title: string; detail: string }[];
  travel: string;
  accommodation: string;
  dressCode: string;
  registry: string;
  registryUrl: string;
  galleryImageIds: string[];
  rsvpEnabled: boolean;
  published: boolean;
  updatedAt: string;
}

/* -------------------------------------------------------------------------
   Saved items
   ------------------------------------------------------------------------- */

export type SaveableKind = "inspiration" | "venue" | "vendor" | "wedding";

export interface SavedItem {
  kind: SaveableKind;
  slug: string;
  savedAt: string;
}
