import type { SiteContent, NewsEntry } from "../types";
import { reference } from "../reference";

/**
 * HARP DATASET — the only content shown by default.
 * The ONLY verified fact about HARP is its name. Everything else is a clearly marked placeholder:
 *   • text begins with "[TBD]"
 *   • numbers are `null` (rendered as "TBD")
 *   • emails / links are "" (rendered as inert "[TBD]" text)
 * Structural UI labels (Home, About, Submit …) are not business claims and are kept.
 * Replace values here (or add MDX in content/newsroom/harp/) as HARP supplies verified information.
 */
const t = (what: string) => `[TBD] ${what}`;
const n = (len: number) => Array.from({ length: len }, (_, i) => i + 1);

const slotImages = reference; // image SLOT ids are shared with the reference dataset (see Img: HARP mode never shows Precept images)

export const harp: SiteContent = {
  source: "harp",
  brand: { name: "HARP", wordmark: "HARP", menuLabel: "HARP", tagline: t("tagline"), url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000", legalLine: "© HARP — [TBD] legal entity" },
  seo: {
    home: { title: "HARP — [TBD] positioning", description: t("home page description") },
    about: { title: "About — HARP", description: t("about page description") },
    capabilities: { title: "Products — HARP", description: t("products page description") },
    careers: { title: "Careers — HARP", description: t("careers page description") },
    contact: { title: "Contact — HARP", description: t("contact page description") },
    newsroom: { title: "Workshops — HARP", description: t("workshops description") },
    privacy: { title: "Privacy Policy — HARP", description: t("privacy page description") },
    notFound: { title: "Page Not Found — HARP", description: "The page you're looking for can't be found." },
  },
  nav: {
    links: slotImages.nav.links,
    socials: ["Instagram", "Facebook", "LinkedIn", "X"].map((label) => ({ label, href: "" })), // [TBD] — no verified profiles
    cta: { heading: t("closing call to action"), button: "Get in touch" },
    newsletter: { label: "Newsletter", placeholder: "Your email", button: "Sign Up", success: "Thanks — you're on the list." },
  },
  home: {
    hero: { lines: ["HARP", "ROBOTICS"], meta: [{ label: "Made in:", value: "India" }, { label: "Facilities:", value: "Advanced Manufacturing" }, { label: "Deployed:", value: "Industrial Environments" }, { label: "Operating:", value: "Robotics & Automation" }] },
    about: { title: "About Us", columns: [{ heading: "What we are", body: ("HARP Robotics is building the next generation of hybrid robotics, exploring the intersection of aerial mobility, ground movement and intelligent engineering.") }, { heading: "Why it matters", body: ("We believe robotics should move beyond conventional boundaries. By bringing different modes of movement together, we aim to explore new possibilities in how machines interact with and navigate the world.") }], cta: { label: "Learn More", href: "/about" } },
    slider: n(4).map((i) => ({ title: t(`Slide ${i} title`), body: t(`Slide ${i} description`), href: undefined, assetId: slotImages.home.slider[i - 1]!.assetId, placeholder: true })),
    industries: n(5).map((i) => ({ title: t(`Industry ${i}`), body: t(`Industry ${i} description`), assetId: slotImages.home.industries[i - 1]!.assetId, placeholder: true })),
    process: { label: "Process steps", steps: n(5).map((i) => ({ title: t(`Step ${i}`), body: t(`Step ${i} description`) })) },
    stats: { eyebrow: "stats", title: "By the Numbers", items: ["RELIABILITY", "THROUGHPUT", "SCALE", "REACH"].map((tag) => ({ value: null, label: t(`${tag.toLowerCase()} metric label`), tag, body: t(`${tag.toLowerCase()} explanation (requires verified figure)`) })) },
    testimonials: n(4).map((i) => ({ company: t(`Client ${i}`), quote: t("Testimonial — requires client approval"), placeholder: true })),
    clients: { label: "Clients", names: n(6).map((i) => `[TBD] Client logo ${i}`) },
    newsroom: { eyebrow: "Recent Workshops", title: "Workshops" },
  },
  about: {
    header: { eyebrow: ("Rooted in India."), title: ("About HARP ROBOTICS"), body: ("Building the next generation of hybrid robotics.") },
    timeline: { title: "Our Timeline", items: slotImages.about.timeline.items.map((it, i) => ({ year: i === 4 ? "Present" : "[TBD]", body: t(`Milestone ${i + 1}`), assetId: it.assetId })) },
    leadership: { eyebrow: "Team", title: "Our Leadership", people: slotImages.about.leadership.people.map((p) => ({ name: t("Name"), role: t("Role"), assetId: p.assetId })) },
    locations: { eyebrow: "Our Locations", locations: slotImages.about.locations.locations.map((l) => ({ city: t("City"), country: t("Country"), email: "", assetId: l.assetId })) },
    contact: { eyebrow: "Contact", title: "Contact", body: t("contact invitation"), channels: ["General", "Media", "Investor Relations"].map((label) => ({ label, email: "" })) },
  },
  capabilities: {
    intro: "", eyebrow: "", title: "Our Products",
    items: slotImages.capabilities.items.map((c, i) => ({ ...c, tag: "", title: t(`Capability ${i + 1}`) })),
    industries: { eyebrow: t("list heading"), title: "Industries", body: t("industries introduction"), list: n(6).map((i) => ({ name: t(`Industry ${i}`), items: [t("Application"), t("Application"), t("Application")] })) },
  },
  capabilityDetails: Object.fromEntries(slotImages.capabilities.items.map((c, i) => [c.slug!, {
    title: t(`Capability ${i + 1}`), status: "placeholder" as const, intro: "", overview: "", heading: "", services: [], systemsLabel: "", systems: [],
  }])),
  careers: {
    eyebrow: "Careers", title: t("Careers headline"), body: t("careers introduction"), cta: "See Open Positions", statement: t("hiring statement"),
    values: n(4).map((i) => ({ index: `0${i}`, title: t(`Value ${i}`), body: t(`Value ${i} description`) })),
    teamLine: t("team line"), apply: "apply now", positionsTitle: "Open Positions", positionsCount: null,
    jobs: n(4).map((i) => ({ title: t(`Role ${i}`), meta: [t("Location"), t("Type")] as [string, string] })),
  },
  contact: {
    eyebrow: "Contact", title: "Contact", body: t("contact invitation"),
    channels: [{ label: "General", email: "" }, { label: "Investor Relations", email: "" }],
    form: { title: "Form", name: "Name", email: "Email", message: "Message", submit: "Send", success: "Thank you — your message has been sent." },
    hq: { label: "HQ", lines: [t("Street address"), t("City, region, postcode")] },
  },
  newsroom: {
    eyebrow: "Categories", title: "Workshops", categories: ["Completed", "Ongoing", "Upcoming"], latestLabel: "Recent Workshops",
    bodyPlaceholder: "This story has not been written yet. The page layout is in place; the article body is pending.",
    // Placeholder entries keep the 8 documented URLs. Real HARP stories: add MDX files to content/newsroom/harp/ (same slug overrides the placeholder).
    entries: reference.newsroom.entries.map((e, i): NewsEntry => {
      const titles = ["Products", "Workshops", "3D Printing"];
      const heroAssets = ["news-products", "news-workshops", "news-3d-printing"];
      return {
        slug: e.slug,
        title: titles[i] ?? t(`Story title ${i + 1}`),
        category: e.category,
        date: null,
        heroAssetId: heroAssets[i] ?? e.heroAssetId,
        status: "placeholder",
      };
    }),
  },
  privacy: { title: "Privacy Policy", status: "placeholder", updated: null, paragraphs: [t("Privacy policy — must be written / approved by HARP's legal counsel. Reference wording was deliberately NOT carried over.")] },
  notFound: reference.notFound,
};
