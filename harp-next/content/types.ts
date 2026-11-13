/**
 * Content contract shared by BOTH datasets:
 *   content/reference/  → verbatim original (Precept) copy, used only as visual/structural reference
 *   content/harp/       → HARP business content. Anything not verified by the owner is marked "[TBD] …".
 * Components only ever see `SiteContent`; they never import either dataset directly.
 */
export type Source = "reference" | "harp";
export interface Link { label: string; href: string; external?: boolean }

export interface Stat { value: number | null; decimals?: number; suffix?: string; label: string; tag: string; body: string }
export interface Slide { title: string; body: string; href?: string; assetId: string; placeholder?: boolean }
export interface Step { title: string; body: string }
export interface Quote { company: string; quote: string; placeholder?: boolean }
export interface TimelineItem { year: string; body: string; assetId: string }
export interface Person { name: string; role: string; assetId: string }
export interface Location { city: string; country: string; email: string; assetId: string }
export interface Capability { index: string; tag: string; title: string; slug?: string; assetId: string }
export interface Industry { name: string; items: string[] }
export interface Job { title: string; meta: [string, string] }
export interface NewsEntry {
  slug: string; title: string; category: "Article" | "Case Study";
  date: string | null; // ISO yyyy-mm-dd
  author?: string; authorAssetId?: string; heroAssetId: string;
  /** "published" = real body (MDX); "placeholder" = designed placeholder page, no invented body */
  status: "published" | "placeholder";
}
export interface PageMeta { title: string; description: string }

export interface SiteContent {
  source: Source;
  brand: { name: string; wordmark: string; menuLabel: string; tagline: string; url: string; legalLine: string };
  seo: Record<"home" | "about" | "capabilities" | "careers" | "contact" | "newsroom" | "privacy" | "notFound", PageMeta>;
  nav: { links: Link[]; socials: Link[]; cta: { heading: string; button: string }; newsletter: { label: string; placeholder: string; button: string; success: string } };
  home: {
    hero: { lines: [string, string]; meta: { label: string; value: string }[] };
    about: { title: string; columns: { heading: string; body: string }[]; cta: Link };
    slider: Slide[];
    industries: Slide[];
    process: { label: string; steps: Step[] };
    stats: { eyebrow: string; title: string; items: Stat[] };
    testimonials: Quote[];
    clients: { label: string; names: string[] };
    newsroom: { eyebrow: string; title: string };
  };
  about: {
    header: { eyebrow: string; title: string; body: string };
    timeline: { title: string; items: TimelineItem[] };
    leadership: { eyebrow: string; title: string; people: Person[] };
    locations: { eyebrow: string; locations: Location[] };
    contact: { eyebrow: string; title: string; body: string; channels: { label: string; email: string }[] };
  };
  capabilities: {
    intro: string; eyebrow: string; title: string; items: Capability[];
    industries: { title: string; body: string; eyebrow: string; list: Industry[] };
  };
  capabilityDetails: Record<string, {
    title: string; intro: string; overview: string; heading: string;
    services: { title: string; body: string }[]; systemsLabel: string;
    systems: { title: string; body: string }[]; status: "published" | "placeholder";
  }>;
  careers: {
    eyebrow: string; title: string; body: string; cta: string; statement: string;
    values: { index: string; title: string; body: string }[];
    teamLine: string; apply: string; positionsTitle: string; positionsCount: number | null; jobs: Job[];
  };
  contact: {
    eyebrow: string; title: string; body: string;
    channels: { label: string; email: string }[];
    form: { title: string; name: string; email: string; message: string; submit: string; success: string };
    hq: { label: string; lines: string[] };
  };
  newsroom: { eyebrow: string; title: string; categories: string[]; entries: NewsEntry[]; latestLabel: string; bodyPlaceholder: string };
  privacy: { title: string; paragraphs: string[]; updated: string | null; status: "published" | "placeholder" };
  notFound: { code: string; title: string; body: string; cta: string };
}
